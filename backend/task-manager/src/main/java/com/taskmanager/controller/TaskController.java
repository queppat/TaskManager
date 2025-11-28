package com.taskmanager.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.taskmanager.model.dto.entity.TaskDTO;
import com.taskmanager.model.dto.entity.UserDetailsImpl;
import com.taskmanager.model.dto.request.CreateTaskRequest;
import com.taskmanager.model.dto.request.UpdateTaskRequest;
import com.taskmanager.model.dto.response.PagedResponse;
import com.taskmanager.service.TaskService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskSerice;

    @GetMapping
    public ResponseEntity<PagedResponse<TaskDTO>> getUserTasks(@AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        String email = userDetails.getUsername();

        var serviceResponse = taskSerice.getUserTasks(email, page, size);

        log.info("(200) (GET /api/tasks) Get tasks successfully for user: " + email);
        return ResponseEntity.ok().body(serviceResponse);
    }

    @PostMapping
    public ResponseEntity<TaskDTO> createTask(@AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody CreateTaskRequest request) {

        String email = userDetails.getUsername();
        log.info("Email from user: " + email);

        var serviceResponse = taskSerice.createTask(userDetails.getUsername(), request);

        log.info("(200) (POST /api/tasks) Create task successfully for user: " + email);
        return ResponseEntity.ok().body(serviceResponse);
    }

    @PatchMapping("/{taskId}")
    public ResponseEntity<TaskDTO> updateTask(@AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Long taskId,
            @RequestBody UpdateTaskRequest request) {

        String email = userDetails.getUsername();

        var serviceResponse = taskSerice.updateTask(userDetails.getUsername(), request, taskId);

        log.info("(200) (PATCH /api/tasks/{}) Update task successfully for user: {}", taskId, email);

        return ResponseEntity.ok().body(serviceResponse);
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<Object> deleteTask(@AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Long taskId) {

        String email = userDetails.getUsername();

        taskSerice.deleteTask(userDetails.getUsername(), taskId);

        log.info("(200) (DELETE /api/tasks/{}) Delete task successfully for user: {}", taskId, email);
        return ResponseEntity.ok().body(Map.of("message", "Successfully delete"));
    }

}
