package org.bs.bookshare.auth;

import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.bs.bookshare.exceptions.AppUserException;
import org.bs.bookshare.model.AppUser;
import org.bs.bookshare.mok.service.AppUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.context.annotation.Bean;
import org.springframework.core.env.Environment;
import org.springframework.security.authentication.AccountStatusException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Component
@Service
@Configurable
public class CustomAuthenticationProvider implements AuthenticationProvider {

    @Autowired
    AppUserService userService;

    @Override
    public Authentication authenticate(Authentication authentication) {

        AppUser user = null;
        String login = authentication.getName();
        if (login == null) {
            throw new BadCredentialsException("User does not exist"); //TODO lokalizacja
        }
        try {
            user = userService.getUser(login);
        } catch (AppUserException e) {
            throw new BadCredentialsException(e.getMessage());
        }

        if (user.getAppRoles() == null) {
            throw new BadCredentialsException("WTF"); //TODO lokalizacja
        }
        if (!user.getActivated()) {
            throw new BadCredentialsException("Konto niekatywowane");   //TODO wyjątki lokalizacja

        }
        if (user.getDisabled()) {
            throw new BadCredentialsException("Konto zablokowane");   //TODO wyjątki lokalizacja

        }


        return null;
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return authentication.equals(UsernamePasswordAuthenticationToken.class);
    }
}
