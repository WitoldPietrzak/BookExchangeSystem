package org.bs.bookshare.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.AlgorithmMismatchException;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Component
public class TokenGenerator {

    private static Algorithm accessAlgorithm;
    private static Algorithm refreshAlgorithm;
    private static Algorithm activationAlgorithm;
    private static Algorithm enablingAlgorithm;
    private static Algorithm passwordResetAlgorithm;



    @Autowired
    public TokenGenerator(Environment environment) {
        accessAlgorithm =Algorithm.HMAC256(Objects.requireNonNull(environment.getProperty("jwt_secret_access")));
        refreshAlgorithm =Algorithm.HMAC256(Objects.requireNonNull(environment.getProperty("jwt_secret_refresh")));
        activationAlgorithm =Algorithm.HMAC256(Objects.requireNonNull(environment.getProperty("jwt_secret_activate")));
        enablingAlgorithm =Algorithm.HMAC256(Objects.requireNonNull(environment.getProperty("jwt_secret_enable")));
        passwordResetAlgorithm =Algorithm.HMAC256(Objects.requireNonNull(environment.getProperty("jwt_secret_password")));
    }


    public static String generateAuthenticationToken(String username, Date expiresAt, String issuer, List<String> claims) {
        return JWT.create()
                .withSubject(username)
                .withExpiresAt(expiresAt)
                .withIssuer(issuer)
                .withClaim("roles", claims)
                .sign(accessAlgorithm);
    }

    public static String generateRefreshToken(String username, Date expiresAt, String issuer) {
        return JWT.create()
                .withSubject(username)
                .withExpiresAt(expiresAt)
                .withIssuer(issuer)
                .sign(refreshAlgorithm);
    }

    public static String generateActivationToken(String username, Date expiresAt) {
        return JWT.create()
                .withSubject(username)
                .withExpiresAt(expiresAt)
                .sign(activationAlgorithm);
    }

    public static String generateEnablingToken(String username, Date expiresAt) {
        return JWT.create()
                .withSubject(username)
                .withExpiresAt(expiresAt)
                .sign(enablingAlgorithm);
    }

    public static String generatePasswordChangeToken(String username, String oldPassword, Date expiresAt) {
        Map<String, String> map = new HashMap<>();
        map.put("password", oldPassword);
        return JWT.create()
                .withSubject(username).withPayload(map)
                .withExpiresAt(expiresAt)
                .sign(passwordResetAlgorithm);
    }

    public static DecodedJWT verifyAccessToken(String token) {
        JWTVerifier verifier = JWT.require(accessAlgorithm).build();
        return verifier.verify(token);

    }
    public static DecodedJWT verifyRefreshToken(String token) {
        JWTVerifier verifier = JWT.require(refreshAlgorithm).build();
        return verifier.verify(token);

    }
    public static DecodedJWT verifyActivationToken(String token) {
        JWTVerifier verifier = JWT.require(activationAlgorithm).build();
        return verifier.verify(token);

    }
    public static DecodedJWT verifyEnablingToken(String token) {
        JWTVerifier verifier = JWT.require(enablingAlgorithm).build();
        return verifier.verify(token);

    }
    public static DecodedJWT verifyPasswordResetToken(String token) {
        JWTVerifier verifier = JWT.require(passwordResetAlgorithm).build();
        return verifier.verify(token);

    }
}
