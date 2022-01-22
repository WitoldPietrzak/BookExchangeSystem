package org.bs.bookshare.auth;

import lombok.RequiredArgsConstructor;
import org.bs.bookshare.exceptions.AppUserException;
import org.bs.bookshare.model.AppUser;
import org.bs.bookshare.model.Roles;
import org.bs.bookshare.mok.service.AppUserService;
import org.bs.bookshare.utils.IpAddressRetriever;
import org.bs.bookshare.utils.mail.MailProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

import static org.bs.bookshare.common.Codes.INCORRECT_PASSWORD;
import static org.bs.bookshare.common.Codes.USER_DISABLED;
import static org.bs.bookshare.common.Codes.USER_NOT_ACTIVE;
import static org.bs.bookshare.common.Codes.USER_NOT_FOUND;

@RequiredArgsConstructor
@Component
@Service
@Configurable
public class CustomAuthenticationManager implements AuthenticationManager {

    @Autowired
    private AppUserService userService;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private MailProvider mailProvider;

    private final PasswordEncoder passwordEncoder;

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        AppUser user = null;
        String login = authentication.getName();
        if (login == null) {
            throw new BadCredentialsException(USER_NOT_FOUND);
        }
        try {
            user = userService.getUserWithRoles(login);
        } catch (AppUserException e) {
            throw new BadCredentialsException(USER_NOT_FOUND);
        }

        try {
            if (user.getAppRoles().stream().anyMatch(role -> Roles.ROLE_ADMIN.equals(role.getName()))) {
                mailProvider.sendAdminLoginAttemptMail(user.getEmail(), IpAddressRetriever.getClientIpAddressFromHttpServletRequest(), user.getLanguage());

            }

            if (!passwordEncoder.matches((String) authentication.getCredentials(), user.getPassword())) {
                throw new BadCredentialsException(INCORRECT_PASSWORD);
            }

            if (!user.getActivated()) {
                throw new BadCredentialsException(USER_NOT_ACTIVE);

            }
            if (user.getDisabled()) {
                throw new BadCredentialsException(USER_DISABLED);
            }
        } catch (BadCredentialsException e) {
            try {
                userService.registerLoginAttempt(user.getId(), false);
            } catch (AppUserException appUserException) {
                throw e;
            }

            throw e;
        }
        UserDetails userDetails = userDetailsService.loadUserByUsername(login);
        try {

            userService.registerLoginAttempt(user.getId(), true);
        } catch (AppUserException e) {
            throw new BadCredentialsException(USER_NOT_FOUND);
        }
        return new UsernamePasswordAuthenticationToken(userDetails, authentication.getCredentials());
    }
}
