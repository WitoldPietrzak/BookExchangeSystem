package org.bs.bookshare.mok.service;

import com.auth0.jwt.interfaces.DecodedJWT;
import lombok.RequiredArgsConstructor;
import org.bs.bookshare.exceptions.AppUserException;
import org.bs.bookshare.model.AppRole;
import org.bs.bookshare.model.AppUser;
import org.bs.bookshare.model.Roles;
import org.bs.bookshare.mok.repositories.AppRoleRepository;
import org.bs.bookshare.mok.repositories.AppUserRepository;
import org.bs.bookshare.security.TokenGenerator;
import org.bs.bookshare.utils.mail.MailProvider;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.List;

import static org.bs.bookshare.common.Codes.LANGUAGE;
import static org.bs.bookshare.common.Codes.USER_NOT_FOUND;

@Service
@RequiredArgsConstructor
@Transactional
//@Slf4j
public class AppUserServiceImplementation implements AppUserService, UserDetailsService {
    private final AppUserRepository appUserRepository;
    private final AppRoleRepository appRoleRepository;
    private final PasswordEncoder passwordEncoder;
    private final MailProvider mailProvider;

    @Override
    public AppUser createUser(AppUser user) throws AppUserException {
        List<AppUser> users = appUserRepository.findAll(); //TODO dodać wyjątki
        if (users.stream().anyMatch(u -> (u.getEmail().equals(user.getEmail())))) {
            throw AppUserException.emailExists();
        }
        if (users.stream().anyMatch(u -> (u.getLogin().equals(user.getLogin())))) {
            throw AppUserException.loginExists();
        }
        if (!Arrays.stream(LANGUAGE).anyMatch(lang -> {
            return lang.equals(user.getLanguage().toLowerCase());
        })) {
            throw AppUserException.unknownLanguage();
        }
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

    }

    @Override
    public void revokeRoleFromUser(Long id, String roleName) throws AppUserException {  //TODO Dodaćzabezpieczenie przed zabraniem sobie amdina
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
        user.getAppRoles().remove(role);
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
    public List<AppUser> getAllUsers() {
        return appUserRepository.findAll();
    }

    @Override
    public void changePassword(String login, String oldPassword, String newPassword, String newPasswordMatch) throws AppUserException {

        AppUser user;
        try {
            user = appUserRepository.findByLogin(login);
        } catch (Exception e) {
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
    }

    @Override
    public void disableUser(Long id, String name) throws AppUserException {
        AppUser user = appUserRepository.findById(id).orElseThrow(AppUserException::userNotFound);
        if (user.getDisabled()) {
            throw AppUserException.userDisabled();
        }
        if (user.getLogin().equals(name)) {
            throw AppUserException.actionNotAllowed();
        }
        user.setDisabled(true);

    }

    @Override
    public void enableUser(Long id, String name) throws AppUserException {
        AppUser user = appUserRepository.findById(id).orElseThrow(AppUserException::userNotFound);
        if (!user.getDisabled()) {
            throw AppUserException.userNotDisabled();
        }
        user.setDisabled(false);
    }

    @Override
    public void changeLanguage(String login, String language) throws AppUserException {
        AppUser user;
        try {
            user = appUserRepository.findByLogin(login);
        } catch (Exception e) {
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

    }

    @Override
    public void activateUser(String token) throws AppUserException {

        DecodedJWT jwt = TokenGenerator.verifyToken(token);
        String login = jwt.getSubject();
        AppUser user;
        try {
            user = appUserRepository.findByLogin(login);
        } catch (Exception e) {
            throw AppUserException.userNotFound();
        }
        if (user.getActivated()) {
            throw AppUserException.alreadyActivated();
        }
        user.setActivated(true);
    }

    @Override
    public void resetPassword(String token, String newPassword, String newPasswordMatch) throws AppUserException {
        DecodedJWT jwt = TokenGenerator.verifyToken(token);
        String login = jwt.getSubject();
        String oldPassword = jwt.getClaim("password").asString();
        AppUser user;
        try {
            user = appUserRepository.findByLogin(login);
        } catch (Exception e) {
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
        if (!user.getActivated()) {
            return;
        }
        String token = TokenGenerator.generatePasswordChangeToken(user.getLogin(), user.getPassword(), new Date(System.currentTimeMillis() + (60 * 60 * 1000))); //TODO okres waznosci do property
        mailProvider.sendPasswordResetMail(user.getEmail(), token, user.getLanguage());
    }

    @Override
    public void registerLoginAttempt(Long id, Boolean success) throws AppUserException {
        AppUser user;
        user = appUserRepository.findById(id).orElseThrow(AppUserException::userNotFound);
        if (success) {
            user.setLastSuccessfulLogin(LocalDateTime.now());
            user.setLoginAttempts(0);
        } else {
            user.setLastUnsuccessfulLogin(LocalDateTime.now());
            user.setLoginAttempts(user.getLoginAttempts() + 1);
            if (user.getLoginAttempts() == 3) {  //TODO do properties
                user.setDisabled(true);
                String token = TokenGenerator.generateActivationToken(user.getLogin(), new Date(System.currentTimeMillis() + (7 * 24 * 60 * 60 * 1000)));   //TODO do properties
                mailProvider.sendAccountEnableMail(user.getEmail(), token, user.getLanguage());
            }
        }

    }

    @Override
    public void enableUserByToken(String token) throws AppUserException {
        DecodedJWT jwt = TokenGenerator.verifyToken(token);
        String login = jwt.getSubject();
        AppUser user;
        try {
            user = appUserRepository.findByLogin(login);
        } catch (Exception e) {
            throw AppUserException.userNotFound();
        }
        if (!user.getDisabled()) {
            throw AppUserException.userNotDisabled();
        }
        user.setDisabled(false);
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
