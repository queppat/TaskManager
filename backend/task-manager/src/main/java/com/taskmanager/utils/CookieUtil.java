package com.taskmanager.utils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

@Component
public class CookieUtil {

    @Value("${app.cookie.path}")
    private String path;

    @Value("${app.cookie.domain}")
    private String domain;

    @Value("${app.cookie.secure}")
    private boolean secure;

    @Value("${app.cookie.http-only}")
    private boolean httpOnly;

    @Value("${app.cookie.same-site}")
    private String sameSite;

    @Value ("${app.jwt.refresh-expiration}")
    private Long refreshExpiration;

    public ResponseCookie createRefreshTokenCookie(String token) {
        return ResponseCookie.from("refreshToken", token)
                .httpOnly(httpOnly)
                .secure(secure)
                .domain(domain)
                .path(path)
                .maxAge(refreshExpiration)
                .sameSite(sameSite)
                .build();
    }

    public ResponseCookie createLogoutCookie() {
        return ResponseCookie.from("refreshToken", "")
                .httpOnly(httpOnly)
                .secure(secure)
                .domain(domain)
                .path(path)
                .maxAge(0)
                .sameSite(sameSite)
                .build();
    }
}
