package org.bs.bookshare.mok.service;

import com.auth0.jwt.exceptions.JWTDecodeException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.bs.bookshare.exceptions.AppUserException;
import org.bs.bookshare.model.AppRole;
import org.bs.bookshare.model.AppUser;
import org.bs.bookshare.model.Roles;
import org.bs.bookshare.mok.repositories.AppRoleRepository;
import org.bs.bookshare.mok.repositories.AppUserRepository;
import org.bs.bookshare.security.TokenGenerator;
import org.bs.bookshare.utils.IpAddressRetriever;
import org.bs.bookshare.utils.mail.MailProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import javax.servlet.http.HttpServletRequest;
import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import static org.bs.bookshare.common.Codes.LANGUAGE;
import static org.bs.bookshare.common.Codes.USER_NOT_FOUND;

@Service
@RequiredArgsConstructor
@Transactional
public class AppUserServiceImplementation implements AppUserService, UserDetailsService {
    private final AppUserRepository appUserRepository;
    private final AppRoleRepository appRoleRepository;
    private final PasswordEncoder passwordEncoder;
    private final MailProvider mailProvider;
    private final HttpServletRequest request;
    private final EntityManager entityManager;
    @Autowired
    private final Environment environment;

    @Override
    public AppUser createUser(String login, String email, String password, String language) throws AppUserException {
        List<AppUser> users = appUserRepository.findAll();

        if (login == null || login.length() < 3) {
            throw AppUserException.LoginTooShort();
        }
        if (password == null || password.length() < 8) {
            throw AppUserException.passwordTooShort();
        }
        if (email == null) {
            throw AppUserException.emailInvalid();
        }
        if (users.stream().anyMatch(u -> (u.getEmail().equals(email)))) {
            throw AppUserException.emailExists();
        }
        if (users.stream().anyMatch(u -> (u.getLogin().equals(login)))) {
            throw AppUserException.loginExists();
        }
        if (!Arrays.stream(LANGUAGE).anyMatch(lang -> lang.equals(language.toLowerCase()))) {
            throw AppUserException.unknownLanguage();
        }
        AppUser user = new AppUser(login, email, password, language);
        user.setCreatedBy(user);
        AppRole role = appRoleRepository.findByName(Roles.ROLE_USER);
        user.getAppRoles().add(role);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        appUserRepository.save(user);
        String token = TokenGenerator.generateActivationToken(user.getLogin(), new Date(System.currentTimeMillis() + 7 * 24 * 60 * 60 * 1000));
        mailProvider.sendActivationMail(user.getEmail(), token, user.getLanguage());
        return user;
    }


    @Override
    public void addRoleToUser(Long id, String roleName) throws AppUserException {
        AppUser user = appUserRepository.findById(id).orElseThrow(AppUserException::userNotFound);
        AppRole role = appRoleRepository.findByName(roleName);
        if (role == null) {
            throw AppUserException.roleNotFound();
        }
        if (user.getAppRoles().contains(role)) {
            throw AppUserException.roleExists();
        }
        user.getAppRoles().add(role);
        String editorName = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        AppUser editor = appUserRepository.findByLogin(editorName);
        user.setModifiedBy(editor);

    }

    @Override
    public void revokeRoleFromUser(Long id, String roleName) throws AppUserException {
        AppUser user = appUserRepository.findById(id).orElseThrow(AppUserException::userNotFound);
        AppRole role = appRoleRepository.findByName(roleName);
        String caller = SecurityContextHolder.getContext().getAuthentication().getName();
        if (role == null) {
            throw AppUserException.roleNotFound();
        }
        if (!user.getAppRoles().contains(role)) {
            throw AppUserException.roleDoesntExists();
        }
        if (user.getLogin().equals(caller) && Roles.ROLE_ADMIN.equals(roleName)) {
            throw AppUserException.actionNotAllowed();
        }
        if (user.getAppRoles().size() == 1) {
            throw AppUserException.atLeastOneRole();
        }
        user.getAppRoles().remove(role);
        String editorName = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        AppUser editor = appUserRepository.findByLogin(editorName);
        user.setModifiedBy(editor);
    }

    @Override
    public AppUser getUser(Long id) throws AppUserException {
        return appUserRepository.findById(id).orElseThrow(AppUserException::userNotFound);
    }

    @Override
    public AppUser getUser(String login) throws AppUserException {
        AppUser user = appUserRepository.findByLogin(login);
        if (user == null) {
            throw AppUserException.userNotFound();
        }
        return user;
    }

    @Override
    public AppUser getUserWithRoles(String login) throws AppUserException {
        AppUser user = appUserRepository.findByLoginAndFetchRolesEagerly(login);
        if (user == null) {
            throw AppUserException.userNotFound();
        }
        return user;
    }

    @Override
    public List<AppUser> getAllUsers() {
        return appUserRepository.findAll();
    }

    @Override
    public List<AppUser> getFilteredUsers(String login, String email) {
        return appUserRepository.findAllFilterByLoginAndEmail(login, email);
    }

    @Override
    public void changePassword(String login, String oldPassword, String newPassword, String newPasswordMatch) throws AppUserException {

        AppUser user;
        try {
            user = appUserRepository.findByLogin(login);
        } catch (Exception e) {
            throw AppUserException.userNotFound();
        }
        if (user == null) {
            throw AppUserException.userNotFound();
        }
        if (!newPassword.equals(newPasswordMatch)) {
            throw AppUserException.passwordsDontMatch();
        }
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw AppUserException.IncorrectPassword();
        }
        if (oldPassword.equals(newPassword)) {
            throw AppUserException.passwordUsed();
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        String editorName = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        AppUser editor = appUserRepository.findByLogin(editorName);
        user.setModifiedBy(editor);
    }

    @Override
    public void disableUser(Long id, String name) throws AppUserException {
        AppUser user = appUserRepository.findById(id).orElseThrow(AppUserException::userNotFound);
        if (user.getDisabled()) {
            throw AppUserException.userAlreadyDisabled();
        }
        if (user.getLogin().equals(name)) {
            throw AppUserException.actionNotAllowed();
        }
        user.setDisabled(true);
        String editorName = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        AppUser editor = appUserRepository.findByLogin(editorName);
        user.setModifiedBy(editor);

    }

    @Override
    public void enableUser(Long id, String name) throws AppUserException {
        AppUser user = appUserRepository.findById(id).orElseThrow(AppUserException::userNotFound);
        if (!user.getDisabled()) {
            throw AppUserException.userNotDisabled();
        }
        user.setDisabled(false);
        String editorName = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        AppUser editor = appUserRepository.findByLogin(editorName);
        user.setModifiedBy(editor);
    }

    @Override
    public void changeLanguage(String login, String language) throws AppUserException {
        AppUser user;
        try {
            user = appUserRepository.findByLogin(login);
        } catch (Exception e) {
            throw AppUserException.userNotFound();
        }
        if (user == null) {
            throw AppUserException.userNotFound();
        }
        if (Arrays.stream(LANGUAGE).noneMatch(lang -> {
            return lang.equals(language.toLowerCase());
        })) {
            throw AppUserException.unknownLanguage();
        }
        if (user.getLanguage().equals(language)) {
            throw AppUserException.languageAlreadyInUse();
        }
        user.setLanguage(language.toLowerCase());
        String editorName = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        AppUser editor = appUserRepository.findByLogin(editorName);
        user.setModifiedBy(editor);

    }

    @Override
    public void activateUser(String token) throws AppUserException {
        DecodedJWT jwt;
        String login;
        try {
            jwt = TokenGenerator.verifyActivationToken(token);
            login = jwt.getSubject();
        } catch (JWTDecodeException e) {
            throw AppUserException.activationTokenInvalid();

        } catch (JWTVerificationException e) {
            throw AppUserException.activationTokenExpired();
        }

        AppUser user;
        try {
            user = appUserRepository.findByLogin(login);
        } catch (Exception e) {
            throw AppUserException.userNotFound();
        }
        if (user == null) {
            throw AppUserException.userNotFound();
        }
        if (user.getActivated()) {
            throw AppUserException.alreadyActivated();
        }
        user.setActivated(true);
        user.setModifiedBy(user);
    }

    @Override
    public void resetPassword(String token, String newPassword, String newPasswordMatch) throws AppUserException {
        DecodedJWT jwt;
        String login;
        String oldPassword;
        try {
            jwt = TokenGenerator.verifyPasswordResetToken(token);
            login = jwt.getSubject();
            oldPassword = jwt.getClaim("password").asString();
        } catch (JWTDecodeException e) {
            throw AppUserException.resetTokenInvalid();

        } catch (JWTVerificationException e) {
            throw AppUserException.resetTokenExpired();
        }

        AppUser user;
        try {
            user = appUserRepository.findByLogin(login);
        } catch (Exception e) {
            throw AppUserException.userNotFound();
        }
        if (user == null) {
            throw AppUserException.userNotFound();
        }
        if (!oldPassword.equals(user.getPassword())) {
            throw AppUserException.alreadyReset();
        }
        if (!newPassword.equals(newPasswordMatch)) {
            throw AppUserException.passwordsDontMatch();
        }
        if (passwordEncoder.matches(newPassword, user.getPassword())) {
            throw AppUserException.passwordUsed();
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setModifiedBy(user);
    }

    @Override
    public void verifyPasswordResetToken(String token) throws AppUserException {
        DecodedJWT jwt;
        String login;
        String oldPassword;
        try {
            jwt = TokenGenerator.verifyPasswordResetToken(token);
            login = jwt.getSubject();
            oldPassword = jwt.getClaim("password").asString();
        } catch (JWTDecodeException e) {
            throw AppUserException.resetTokenInvalid();

        } catch (JWTVerificationException e) {
            throw AppUserException.resetTokenExpired();
        }
        AppUser user;
        try {
            user = appUserRepository.findByLogin(login);
        } catch (Exception e) {
            throw AppUserException.userNotFound();
        }
        if (user == null) {
            throw AppUserException.userNotFound();
        }
        if (!oldPassword.equals(user.getPassword())) {
            throw AppUserException.alreadyReset();
        }
    }

    @Override
    public void sendResetPasswordRequest(String loginOrEmail) {
        AppUser user;

        try {
            if (loginOrEmail.contains("@")) {
                user = appUserRepository.findByEmail(loginOrEmail);
            } else {
                user = appUserRepository.findByLogin(loginOrEmail);
            }
        } catch (Exception e) {
            return;
        }
        if (user == null) {
            return;
        }
        if (!user.getActivated()) {
            return;
        }
        String token = TokenGenerator.generatePasswordChangeToken(user.getLogin(), user.getPassword(), new Date(System.currentTimeMillis() + (Long.parseLong(Objects.requireNonNull(environment.getProperty("reset_password_token_valid_time_in_hours"))) * 60 * 60 * 1000)));
        mailProvider.sendPasswordResetMail(user.getEmail(), token, user.getLanguage());
    }

    @Override
    public void registerLoginAttempt(Long id, Boolean success) throws AppUserException {
        AppUser user;
        user = appUserRepository.findById(id).orElseThrow(AppUserException::userNotFound);
        if (success) {
            user.setLastSuccessfulLogin(LocalDateTime.now());
            user.setLastSuccessfulLoginIp(IpAddressRetriever.getClientIpAddressFromHttpServletRequest(request));
            user.setLoginAttempts(0);
        } else {
            user.setLastUnsuccessfulLogin(LocalDateTime.now());
            user.setLastUnsuccessfulLoginIp(IpAddressRetriever.getClientIpAddressFromHttpServletRequest(request));
            user.setLoginAttempts(user.getLoginAttempts() + 1);
            if (user.getLoginAttempts() == Integer.parseInt(Objects.requireNonNull(environment.getProperty("max_login_attempts_before_disable")))) {
                user.setDisabled(true);
                String token = TokenGenerator.generateEnablingToken(user.getLogin(), new Date(System.currentTimeMillis() + (Long.parseLong(Objects.requireNonNull(environment.getProperty("enable_account_token_valid_time_in_days"))) * 24 * 60 * 60 * 1000)));
                mailProvider.sendAccountEnableMail(user.getEmail(), token, user.getLanguage());
            }
        }

    }

    @Override
    public void enableUserByToken(String token) throws AppUserException {
        DecodedJWT jwt = TokenGenerator.verifyEnablingToken(token);
        String login = jwt.getSubject();
        AppUser user;
        try {
            user = appUserRepository.findByLogin(login);
        } catch (Exception e) {
            throw AppUserException.userNotFound();
        }
        if (user == null) {
            throw AppUserException.userNotFound();
        }
        if (!user.getDisabled()) {
            throw AppUserException.userNotDisabled();
        }
        user.setDisabled(false);
        user.setModifiedBy(user);
    }

    @Override
    public Map<String, Object> refreshToken(String token) throws AppUserException {
        DecodedJWT jwt = TokenGenerator.verifyRefreshToken(token);
        AppUser user;
        try {
            user = appUserRepository.findByLogin(jwt.getSubject());
        } catch (Exception e) {
            throw AppUserException.userNotFound();
        }
        if (user == null) {
            throw AppUserException.userNotFound();
        }
        List<String> authorities = user.getAppRoles().stream().map(AppRole::getName).collect(Collectors.toCollection(ArrayList::new));
        String refreshToken = TokenGenerator.generateRefreshToken(jwt.getSubject(), new Date(System.currentTimeMillis() + ((long) Integer.parseInt(Objects.requireNonNull(environment.getProperty("refresh_token_valid_time_in_days"))) * 7 * 60 * 60 * 1000)), jwt.getIssuer());
        String accessToken = TokenGenerator.generateAuthenticationToken(jwt.getSubject(), new Date(System.currentTimeMillis() + ((long) Integer.parseInt(Objects.requireNonNull(environment.getProperty("access_token.valid_time_in_minutes"))) * 60 * 1000)), jwt.getIssuer(), authorities);
        Map<String, Object> tokens = new HashMap<>();
        tokens.put("accessToken", accessToken);
        tokens.put("refreshToken", refreshToken);
        tokens.put("roles", authorities);
        return tokens;

    }

    @Scheduled(cron = "0 0 0 * * *")
    public void deleteUnactivatedUsers() {
        Query query = entityManager.createQuery("SELECT u FROM AppUser u WHERE u.activated = false AND u.creationDateTime < :date");
        List<AppUser> users = query.setParameter("date", LocalDateTime.now().minusDays(7)).getResultList();
        appUserRepository.deleteAll(users);
    }


    @Override
    public UserDetails loadUserByUsername(String login) throws UsernameNotFoundException {

        AppUser user = appUserRepository.findByLogin(login);
        if (user == null) {
            throw new UsernameNotFoundException(USER_NOT_FOUND);
        }
        Collection<SimpleGrantedAuthority> authorities = new ArrayList<>();
        user.getAppRoles().forEach(role -> {
            authorities.add(new SimpleGrantedAuthority(role.getName()));
        });
        return new User(user.getLogin(), user.getPassword(), user.getActivated(), true, true, !user.getDisabled(), authorities);
    }
}
