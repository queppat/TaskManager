package com.taskmanager.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.taskmanager.exception.DeleteFailedException;
import com.taskmanager.exception.TaskNotFoundException;
import com.taskmanager.exception.UserNotFoundException;
import com.taskmanager.model.domain.Task;
import com.taskmanager.model.domain.User;
import com.taskmanager.model.dto.entity.TaskDTO;
import com.taskmanager.model.dto.request.CreateTaskRequest;
import com.taskmanager.model.dto.request.UpdateTaskRequest;
import com.taskmanager.repository.TaskRepository;
import com.taskmanager.repository.UserRepository;
import com.taskmanager.utils.TaskMapper;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class TaskService {

    private final UserRepository userRepository;
    private final TaskRepository taskRepository;
    private final TaskMapper taskMapper;

    @Transactional
    public TaskDTO createTask(String email, CreateTaskRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + email));

        Task newTask = Task.builder()
                .owner(user)
                .title(request.getTitle())
                .description(request.getDescription())
                .deadline(request.getDeadline())
                .status(request.getStatus())
                .build();

        taskRepository.save(newTask);

        log.info("(createTask) successfully for user: " + email);

        return taskMapper.entityToDTO(newTask);
    }

    @Transactional
    public List<TaskDTO> getUserTasks(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + email));

        List<TaskDTO> reponse = user.getTasks().stream()
                .map(taskMapper::entityToDTO)
                .toList();

        log.info("(getUserTasks) Successfully return tasks for user: " + email);
        return reponse;
    }

    @Transactional
    public TaskDTO updateTask(String email, UpdateTaskRequest request, Long taskId) {
        Task task = taskRepository.findByIdAndOwnerEmail(taskId, email)
                .orElseThrow(() -> new TaskNotFoundException("Task not found or access denied"));

        if (request.getTitle() != null)
            task.setTitle(request.getTitle());
        if (request.getDescription() != null)
            task.setDescription(request.getDescription());
        if (request.getStatus() != null)
            task.setStatus(request.getStatus());

        log.info("(updateTask) task updated successfully for user: {}", email);
        return taskMapper.entityToDTO(task);
    }

    @Transactional
    public void deleteTask(String email, Long id) {
        int deleteSuccessfully = taskRepository.deleteByOwnerEmail(email, id);

        if(deleteSuccessfully <= 0){
            throw new TaskNotFoundException("Task not found or you don't have permission to delete it");
        }
        
        log.info("(deleteTask) delete for user with email: {} was: {}", email, deleteSuccessfully);
    }
}
