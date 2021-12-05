package org.bs.bookshare.security.filter;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.bs.bookshare.auth.CustomAuthenticationProvider;
import org.bs.bookshare.security.TokenGenerator;
import org.springframework.beans.factory.annotation.Autowired;
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

@RequiredArgsConstructor
public class AppAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;

    private final Environment environment;

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

        Map<String, String> responseToken = new HashMap<>();
        responseToken.put("access_token", accessToken);
        response.setContentType("application/json");
        new ObjectMapper().writeValue(response.getOutputStream(), responseToken);

    }

    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) throws IOException, ServletException {
        Map<String, String> responseMap = new HashMap<>();
        response.setStatus(401);
        responseMap.put("status", String.valueOf(response.getStatus()));
        responseMap.put("error", failed.getMessage());
        responseMap.put("message", failed.getMessage());
        response.setContentType("application/json");
        new ObjectMapper().writeValue(response.getOutputStream(), responseMap);
    }  //TODO
}
