package com.taskmanager.utils;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.taskmanager.exception.EmptyRequestException;
import com.taskmanager.model.enums.Role;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class JwtTokenProvider {

    @Value("${app.jwt.access-secret}")
    private String jwtAccessSecret;

    @Value("${app.jwt.refresh-secret}")
    private String jwtRefreshSecret;

    @Value("${app.jwt.access-expiration}")
    private Long jwtAccessExpiration;

    @Value("${app.jwt.refresh-expiration}")
    private Long jwtRefreshExpiration;

    private final SecureRandom secureRandom = new SecureRandom();

    private SecretKey getAccessSigningKey() {
        return Keys.hmacShaKeyFor(jwtAccessSecret.getBytes());
    }

    private SecretKey getRefreshSigningKey() {
        return Keys.hmacShaKeyFor(jwtRefreshSecret.getBytes());
    }

    public String generateAccessToken(Long id, String email, String username, Set<Role> roles, Boolean isNew) {
        var now = new Date();
        var expiryDate = new Date(now.getTime() + jwtAccessExpiration);

        List<String> roleNames = roles.stream()
                .map(Enum::name)
                .toList();

        String token = Jwts.builder()
                .setSubject(email)
                .claim("id", id)
                .claim("type", "ACCESS")
                .claim("username", username)
                .claim("isNew", isNew)
                .claim("roles", roleNames)
                .setId(generateTokenId())
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getAccessSigningKey(), SignatureAlgorithm.HS256)
                .compact();

        log.info("(generateAccessToken) Access token generated successfully for: {}", email);
        return token;
    }

    public String generateRefreshToken(String email) {
        var now = new Date();
        var expiryDate = new Date(now.getTime() + jwtRefreshExpiration);

        String token = Jwts.builder()
                .setSubject(email)
                .claim("type", "REFRESH")
                .setId(generateTokenId())
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getRefreshSigningKey(), SignatureAlgorithm.HS256)
                .compact();

        log.info("(generateRefreshToken) Refresh token generated successfully for: {}", email);
        return token;
    }

    public Set<Role> getRolesFromAccessToken(String token) {
        var claims = Jwts.parserBuilder()
                .setSigningKey(getAccessSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();

        @SuppressWarnings("unchecked")
        List<String> roleNames = claims.get("roles", List.class);

        if (roleNames == null) {
            return Set.of(Role.USER);
        }

        return roleNames.stream()
                .map(Role::valueOf)
                .collect(Collectors.toSet());
    }

    public String getEmailFromAccessToken(String token) {
        var claims = Jwts.parserBuilder()
                .setSigningKey(getAccessSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();

        String email = claims.getSubject();
        log.debug("Extracted email from token claims: {}", email);
        return email;
    }

    public String getEmailFromRefreshToken(String token) {
        if (token == null || token.isEmpty()) {
            throw new EmptyRequestException("Bad request (empty or null)");
        }
        var claims = Jwts.parserBuilder()
                .setSigningKey(getRefreshSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }

    public boolean validateAccessToken(String token) {
        return validateToken(token, getAccessSigningKey());
    }

    public boolean validateRefreshToken(String token) {
        return validateToken(token, getRefreshSigningKey());
    }

    private String generateTokenId() {
        var bytes = new byte[16];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private boolean validateToken(String token, SecretKey signingKey) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(signingKey)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public Long getAccessExpiration() {
        return jwtAccessExpiration;
    }

    public Instant getRefreshTokenExpiry() {
        return Instant.now().plusMillis(jwtRefreshExpiration);
    }

}
