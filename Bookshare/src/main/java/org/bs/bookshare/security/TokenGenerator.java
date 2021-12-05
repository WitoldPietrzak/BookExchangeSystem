package org.bs.bookshare.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;

import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class TokenGenerator {
    private static final Algorithm algorithm = Algorithm.HMAC256("secret".getBytes()); //TODO zakodować to

    public static String generateAuthenticationToken(String username, Date expiresAt, String issuer, List<String> claims) {
        return JWT.create()
                .withSubject(username)
                .withExpiresAt(expiresAt)
                .withIssuer(issuer)
                .withClaim("roles", claims)
                .sign(algorithm);
    }

    public static String generateActivationToken(String username, Date expiresAt) {
        return JWT.create()
                .withSubject(username)
                .withExpiresAt(expiresAt)
                .sign(algorithm);
    }

    public static String generatePasswordChangeToken(String username, String oldPassword, Date expiresAt) {
        Map<String, String> map = new HashMap<>();
        map.put("password", oldPassword);
        return JWT.create()
                .withSubject(username).withPayload(map)
                .withExpiresAt(expiresAt)
                .sign(algorithm);
    }

    public static DecodedJWT verifyToken(String token) {
        JWTVerifier verifier = JWT.require(algorithm).build();
        return verifier.verify(token);

    }
}
