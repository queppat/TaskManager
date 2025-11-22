package com.taskmanager.exception;

public class WrongParamException extends RuntimeException {
    
    public WrongParamException(String message){
        super(message);
    }
}
