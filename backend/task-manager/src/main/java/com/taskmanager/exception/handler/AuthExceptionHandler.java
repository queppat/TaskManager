package com.taskmanager.exception.handler;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.taskmanager.exception.InvalidRefreshTokenException;
import com.taskmanager.exception.RefreshTokenNotFoundException;
import com.taskmanager.exception.UserNotFoundException;
import com.taskmanager.utils.ExceptionResponseModel;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;

@ControllerAdvice
@Slf4j
public class AuthExceptionHandler {

    @ExceptionHandler(InvalidRefreshTokenException.class)
    public ResponseEntity<Object> handleInvalidRefreshTokenException(InvalidRefreshTokenException ex, HttpServletRequest request) {

        log.warn("(400) Invalid refresh token in {} {}: {}",
            request.getMethod(), request.getRequestURI(), ex.getMessage());

        return ExceptionResponseModel.createModel(400, ex.getMessage());
    }

    @ExceptionHandler(RefreshTokenNotFoundException.class)
    public ResponseEntity<Object> handleRefreshTokenNotFoundException(RefreshTokenNotFoundException ex, HttpServletRequest request) {
        
        log.warn("(400) Refresh token not found in {} {}: {}",
            request.getMethod(), request.getRequestURI(), ex.getMessage());

        return ExceptionResponseModel.createModel(400, ex.getMessage());
    }
    
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<Object> handleUserNotFoundException(UserNotFoundException ex, HttpServletRequest request) {

        log.warn("(404) User not found in {} {}: {}",
            request.getMethod(), request.getRequestURI(), ex.getMessage());

        return ExceptionResponseModel.createModel(404, ex.getMessage());
    }
}

