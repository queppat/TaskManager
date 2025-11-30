package com.taskmanager.model.dto.entity;

import java.time.LocalDate;

import com.taskmanager.model.enums.TaskStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TaskFilter {
    
    private String title;
    private TaskStatus status;
    private LocalDate deadline;

}
