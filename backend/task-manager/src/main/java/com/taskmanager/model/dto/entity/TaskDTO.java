package com.taskmanager.model.dto.entity;

import java.time.LocalDateTime;

import com.taskmanager.model.enums.TaskStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TaskDTO {
    
    private Long id;
    private Long ownerId;
    private String title;
    private String description;
    private LocalDateTime deadline;
    private TaskStatus status;
}
