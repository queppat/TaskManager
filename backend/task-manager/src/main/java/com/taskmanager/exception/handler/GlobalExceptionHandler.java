package com.taskmanager.exception.handler;

import java.util.NoSuchElementException;

import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.taskmanager.exception.DeleteFailedException;
import com.taskmanager.exception.EmptyRequestException;
import com.taskmanager.exception.InvalidRefreshTokenException;
import com.taskmanager.exception.RefreshTokenNotFoundException;
import com.taskmanager.exception.TaskNotFoundException;
import com.taskmanager.exception.UpdateFailedException;
import com.taskmanager.exception.UserExistException;
import com.taskmanager.exception.UserNotFoundException;
import com.taskmanager.exception.WrongParamException;
import com.taskmanager.utils.ExceptionResponseModel;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;

@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<Object> handleNoSuchElementException(NoSuchElementException ex, HttpServletRequest request) {

        log.warn("(404) Resource not found in {} {}: {}",
                request.getMethod(), request.getRequestURI(), ex.getMessage());

        return ExceptionResponseModel.createModel(404, ex.getMessage());

    }

    @ExceptionHandler(EmptyRequestException.class)
    public ResponseEntity<Object> handleEmptyRequestException(EmptyRequestException ex, HttpServletRequest request) {

        log.warn("(400) Bad request in {} {}: {}",
                request.getMethod(), request.getRequestURI(), ex.getMessage());

        return ExceptionResponseModel.createModel(400, ex.getMessage());
    }

    @ExceptionHandler(WrongParamException.class)
    public ResponseEntity<Object> handleWrongParamException(WrongParamException ex, HttpServletRequest request) {

        log.warn("(400) Wrong param passed in {} {}: {}",
                request.getMethod(), request.getRequestURI(), ex.getMessage());

        return ExceptionResponseModel.createModel(400, ex.getMessage());
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Object> handleJsonParseError(HttpMessageNotReadableException ex, HttpServletRequest request) {

        log.error("(400) JSON parse error in {} {}: {}",
                request.getMethod(), request.getRequestURI(), ex.getMessage());

        return ExceptionResponseModel.createModel(400, ex.getMessage());
    }

    @ExceptionHandler(NullPointerException.class)
    public ResponseEntity<Object> handleNullPointerException(NullPointerException ex, HttpServletRequest request) {

        log.error("(500) Null pointer in {} {}: {}",
                request.getMethod(), request.getRequestURI(), ex.getMessage());

        return ExceptionResponseModel.createModel(500, ex.getMessage());
    }

    @ExceptionHandler(InvalidRefreshTokenException.class)
    public ResponseEntity<Object> handleInvalidRefreshTokenException(InvalidRefreshTokenException ex,
            HttpServletRequest request) {

        log.warn("(400) Invalid refresh token in {} {}: {}",
                request.getMethod(), request.getRequestURI(), ex.getMessage());

        return ExceptionResponseModel.createModel(400, ex.getMessage());
    }

    @ExceptionHandler(RefreshTokenNotFoundException.class)
    public ResponseEntity<Object> handleRefreshTokenNotFoundException(RefreshTokenNotFoundException ex,
            HttpServletRequest request) {

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

    @ExceptionHandler(UserExistException.class)
    public ResponseEntity<Object> handleUserExistException(UserExistException ex, HttpServletRequest request) {

        log.warn("(409) User already exist {} {}: {}",
                request.getMethod(), request.getRequestURI(), ex.getMessage());

        return ExceptionResponseModel.createModel(409, ex.getMessage());
    }

    @ExceptionHandler(TaskNotFoundException.class)
    public ResponseEntity<Object> handleTaskNotFoundException(TaskNotFoundException ex, HttpServletRequest request) {

        log.warn("(404) Task not found {} {}: {}",
                request.getMethod(), request.getRequestURI(), ex.getMessage());

        return ExceptionResponseModel.createModel(404, ex.getMessage());
    }

    @ExceptionHandler(UpdateFailedException.class)
    public ResponseEntity<Object> handleUpdateFaledException(UpdateFailedException ex, HttpServletRequest request) {

        log.warn("(400) Update information failed {} {}: {}",
                request.getMethod(), request.getRequestURI(), ex.getMessage());

        return ExceptionResponseModel.createModel(400, ex.getMessage());
    }

    @ExceptionHandler(DeleteFailedException.class)
    public ResponseEntity<Object> handleDeleteFailedException(DeleteFailedException ex, HttpServletRequest request) {

        log.warn("(400) Delete information failed {} {}: {}",
                request.getMethod(), request.getRequestURI(), ex.getMessage());

        return ExceptionResponseModel.createModel(400, ex.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleException(Exception ex, HttpServletRequest request) {

        log.error("(500) Unexpected error in {} {}: {}",
                request.getMethod(), request.getRequestURI(), ex.getMessage(), ex);

        return ExceptionResponseModel.createModel(500, "An unexpected error occurred");
    }
}
