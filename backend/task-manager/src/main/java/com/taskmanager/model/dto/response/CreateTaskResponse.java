package com.taskmanager.model.dto.response;

import java.time.LocalDateTime;

import com.taskmanager.model.enums.TaskStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CreateTaskResponse {
    
    private Long id;
    private String description;
    private LocalDateTime deadline;
    private TaskStatus status;
}
