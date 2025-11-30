package com.taskmanager.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.taskmanager.exception.TaskNotFoundException;
import com.taskmanager.exception.UserNotFoundException;
import com.taskmanager.model.domain.Task;
import com.taskmanager.model.domain.User;
import com.taskmanager.model.dto.entity.TaskDTO;
import com.taskmanager.model.dto.entity.TaskFilter;
import com.taskmanager.model.dto.request.CreateTaskRequest;
import com.taskmanager.model.dto.request.UpdateTaskRequest;
import com.taskmanager.model.dto.response.PagedResponse;
import com.taskmanager.repository.TaskRepository;
import com.taskmanager.repository.UserRepository;
import com.taskmanager.utils.TaskFilterUtil;
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
    private final TaskFilterUtil taskFilterUtil;

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
    public PagedResponse<TaskDTO> getUserTasks(String email, int page, int size, TaskFilter filters, String sort) {
        if (Boolean.FALSE.equals(userRepository.existsByEmail(email))) {
            throw new UserNotFoundException("User not found: " + email);
        }

        int pageSize = Math.min(size, 10);

        Sort sortOptions = taskFilterUtil.parseSortParameter(sort);
        Pageable pageable = PageRequest.of(page, pageSize, sortOptions);

        Specification<Task> spec = taskFilterUtil.buildSpecification(email, filters);

        Page<Task> taskPage = taskRepository.findAll(spec, pageable);

        PagedResponse<TaskDTO> pagedResponse = new PagedResponse<>(taskPage.map(taskMapper::entityToDTO));

        log.info("(getUserTasks) Successfully return tasks for user: " + email);
        return pagedResponse;
    }

    @Transactional
    public TaskDTO updateTask(String email, UpdateTaskRequest request, Long taskId) {
        Task task = taskRepository.findByIdAndOwnerEmail(taskId, email)
                .orElseThrow(() -> new TaskNotFoundException("Task not found or access denied"));

        if (request.getTitle() != null)
            task.setTitle(request.getTitle());
        if (request.getDescription() != null)
            task.setDescription(request.getDescription());
        if (request.getDeadline() != null) {
            task.setDeadline(request.getDeadline());
        }
        if (request.getStatus() != null)
            task.setStatus(request.getStatus());

        log.info("(updateTask) task updated successfully for user: {}", email);
        return taskMapper.entityToDTO(task);
    }

    @Transactional
    public void deleteTask(String email, Long id) {
        int deleteSuccessfully = taskRepository.deleteByOwnerEmail(email, id);

        if (deleteSuccessfully <= 0) {
            throw new TaskNotFoundException("Task not found or you don't have permission to delete it");
        }

        log.info("(deleteTask) delete for user with email: {} was: {}", email, deleteSuccessfully);
    }
}
