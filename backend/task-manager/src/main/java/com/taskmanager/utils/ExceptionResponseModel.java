package com.taskmanager.utils;

import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public class ExceptionResponseModel {
    
    public static ResponseEntity<Object> createModel(Integer status, String message){
        return switch(status) {
            case 400 ->  badRequestResponse("Bad request", status, message);
            case 404 -> notFoundResponse("Not found", status, message);
            case 500 -> internalServerResponse("Internal server error", status, message);
            default -> null;
        };
    }

    private static ResponseEntity<Object> badRequestResponse(String title, Integer status, String message){

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(getReponseModel(title, status, message));
    }

    private static ResponseEntity<Object> notFoundResponse(String title, Integer status, String message){

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(getReponseModel(title, status, message));
    }   

    private static ResponseEntity<Object> internalServerResponse(String title, Integer status, String message){

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(getReponseModel(title, status, message));
    }

    private static Map<?,?> getReponseModel(String title, Integer status, String message){
        return Map.of(
            "title", title,
            "status", status,
            "message", message,
            "timestamp",  LocalDateTime.now()
        );
    }

    private ExceptionResponseModel(){

    }
}
