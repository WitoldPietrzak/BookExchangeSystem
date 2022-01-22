package org.bs.bookshare.security.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.bs.bookshare.exceptions.AppUserException;
import org.bs.bookshare.model.AppUser;
import org.bs.bookshare.model.Roles;
import org.bs.bookshare.mok.service.AppUserService;
import org.bs.bookshare.mok.service.AppUserServiceImplementation;
import org.bs.bookshare.security.TokenGenerator;
import org.bs.bookshare.utils.IpAddressRetriever;
import org.bs.bookshare.utils.mail.MailProvider;
import org.springframework.core.env.Environment;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.FORBIDDEN;

@RequiredArgsConstructor
public class AppAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;

    private final Environment environment;

    private final AppUserService appUserService;

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        String login = request.getParameter("login");
        String password = request.getParameter("password");
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(login, password);
        return authenticationManager.authenticate(authenticationToken);
    }


    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authResult) throws IOException, ServletException {
        User user = (User) authResult.getPrincipal();
        String accessToken = TokenGenerator.generateAuthenticationToken(user.getUsername(), new Date(System.currentTimeMillis() + (long) Integer.parseInt(Objects.requireNonNull(environment.getProperty("access_token.valid_time_in_minutes"))) * 60 * 1000), request.getRequestURL().toString(), user.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList()));
        String refreshToken = TokenGenerator.generateRefreshToken(user.getUsername(), new Date(System.currentTimeMillis() + ((long) Integer.parseInt(Objects.requireNonNull(environment.getProperty("refresh_token_valid_time_in_days"))) * 7 * 60 * 60 * 1000)), request.getRequestURL().toString());

        Map<String, Object> responseToken = new HashMap<>();
        responseToken.put("access_token", accessToken);
        responseToken.put("refresh_token", refreshToken);
        responseToken.put("access_levels", user.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList()));
        AppUser appUser = null;
        try {
            appUser = appUserService.getUser(user.getUsername());
            responseToken.put("language", appUser.getLanguage());
        } catch (AppUserException e) {
            response.setStatus(FORBIDDEN.value());
            Map<String, String> response_message = new HashMap<>();
            response_message.put("message", e.getMessage());
            response.setContentType("application/json");
            new ObjectMapper().writeValue(response.getOutputStream(), response_message);
        }
        response.setContentType("application/json");
        new ObjectMapper().writeValue(response.getOutputStream(), responseToken);

    }

    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) throws IOException, ServletException {
        Map<String, String> responseMap = new HashMap<>();
        response.setStatus(401);
        responseMap.put("message", failed.getMessage());
        response.setContentType("application/json");
        new ObjectMapper().writeValue(response.getOutputStream(), responseMap);
    }
}
