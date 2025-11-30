package com.taskmanager.utils;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import com.taskmanager.model.domain.Task;
import com.taskmanager.model.dto.entity.TaskFilter;

import jakarta.persistence.criteria.Predicate;

@Component
public class TaskFilterUtil {

    public Specification<Task> buildSpecification(String email, TaskFilter filters) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(criteriaBuilder.equal(root.get("owner").get("email"), email));

            if (filters.getTitle() != null && !filters.getTitle().isEmpty()) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("title")),
                        "%" + filters.getTitle().toLowerCase() + "%"));
            }

            if (filters.getStatus() != null) {
                predicates.add(criteriaBuilder.equal(root.get("status"), filters.getStatus()));
            }

            if (filters.getDeadline() != null) {

                LocalDateTime startOfDay = filters.getDeadline().atStartOfDay();
                LocalDateTime endOfDay = filters.getDeadline().atTime(LocalTime.MAX);

                predicates.add(criteriaBuilder.between(root.get("deadline"), startOfDay, endOfDay));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

    public Sort parseSortParameter(String sort) {
        if (sort == null || sort.isEmpty()) {
            return Sort.by(Sort.Direction.DESC, "createdAt");
        }

        String[] sortParams = sort.split(",");
        if (sortParams.length != 2) {
            return Sort.by(Sort.Direction.DESC, "createdAt");
        }

        String field = sortParams[0];
        Sort.Direction direction = Sort.Direction.fromString(sortParams[1]);

        return Sort.by(direction, field);
    }
}
