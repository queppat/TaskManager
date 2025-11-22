package com.taskmanager.exception.handler;

import java.util.NoSuchElementException;

import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.taskmanager.exception.EmptyRequestException;
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

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleException(Exception ex, HttpServletRequest request) {
        
        log.error("(500) Unexpected error in {} {}: {}", 
            request.getMethod(), request.getRequestURI(), ex.getMessage(), ex);
        
        return ExceptionResponseModel.createModel(500, "An unexpected error occurred");
    }
}
