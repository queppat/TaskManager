package com.taskmanager.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.taskmanager.model.domain.Task;
import com.taskmanager.model.enums.TaskStatus;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    @Modifying
    @Query("UPDATE Task t SET t.title = :title, t.description = :description, t.status = :status WHERE t.id = :id AND t.owner.email = :email")
    int updateTask(@Param("email") String email, 
                   @Param("id") Long id,
                   @Param("title") String title,
                   @Param("description") String description,
                   @Param("status") TaskStatus status);
    Optional<Task> findByIdAndOwnerEmail(Long id, String email);

    @Modifying
    @Query("DELETE FROM Task t WHERE t.owner.email = :email AND t.id = :id")
    int deleteByOwnerEmail(@Param("email")String email, @Param("id") Long id);
}
