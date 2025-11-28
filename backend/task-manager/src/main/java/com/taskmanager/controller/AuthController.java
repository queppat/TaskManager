package com.taskmanager.controller;

import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.taskmanager.model.dto.entity.TokenDTO;
import com.taskmanager.model.dto.request.LoginRequest;
import com.taskmanager.model.dto.request.RegisterRequest;
import com.taskmanager.model.dto.response.AccessTokenResponse;
import com.taskmanager.model.dto.response.RegisterResponse;
import com.taskmanager.service.UserService;
import com.taskmanager.utils.CookieUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Controller
@RequiredArgsConstructor
@RequestMapping("/api/auth")
@Slf4j
public class AuthController {

    private final UserService userService;
    private final CookieUtil cookieUtil;

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@RequestBody RegisterRequest registerRequest) {

        TokenDTO serviceResponse = userService.registerUser(registerRequest);

        ResponseCookie refreshTokenCookie = cookieUtil.createRefreshTokenCookie(
                serviceResponse.getRefreshToken());

        RegisterResponse registerResponse = new RegisterResponse(serviceResponse.getAccessToken());

        var response = ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString())
                .body(registerResponse);

        log.info("(POST /api/auth/register) (200) Register proccess fineshed successfully for ",
                registerRequest.getEmail());

        return response;
    }

    @PostMapping("/login")
    public ResponseEntity<AccessTokenResponse> login(@RequestBody LoginRequest loginRequest) {

        TokenDTO loginServiceResponse = userService.loginUser(loginRequest);

        ResponseCookie refreshTokenCookie = cookieUtil.createRefreshTokenCookie(
                loginServiceResponse.getRefreshToken());

        AccessTokenResponse registerResponse = new AccessTokenResponse(loginServiceResponse.getAccessToken());

        var response = ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString())
                .body(registerResponse);

        log.info("(POST /api/auth/login) (200) Login proccess fineshed successfully for ",
                loginRequest.getEmail());

        return response;
    }

    @PostMapping("/refresh")
    public ResponseEntity<AccessTokenResponse> refreshTokens(
            @CookieValue(required = false) String refreshToken) {

        TokenDTO refreshServiceRespones = userService.refreshTokens(refreshToken);

        ResponseCookie refreshTokenCookie = cookieUtil
                .createRefreshTokenCookie(refreshServiceRespones.getRefreshToken());

        AccessTokenResponse registerResponse = new AccessTokenResponse(refreshServiceRespones.getAccessToken());

        var response = ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString())
                .body(registerResponse);

        log.info("(POST /api/auth/refresh) (200) Tokens refresh fineshed successfully for token", refreshToken);

        return response;
    }

    @PostMapping("/logout")
    public ResponseEntity<Object> logout(
            @CookieValue(required = false) String refreshToken) {

        ResponseCookie logoutCookie = cookieUtil.createLogoutCookie();

        log.info("(POST /api/auth/logout) (200) Successful logout");
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, logoutCookie.toString())
                .body(Map.of("message", "Successful logout"));
    }

}
