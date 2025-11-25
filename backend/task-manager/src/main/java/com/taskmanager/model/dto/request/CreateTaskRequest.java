package com.taskmanager.model.dto.request;

import java.time.LocalDateTime;

import com.taskmanager.model.enums.TaskStatus;

import lombok.Getter;

@Getter
public class CreateTaskRequest {
    
    private String title;
    private String description;
    private LocalDateTime deadline;
    private TaskStatus status;
}
