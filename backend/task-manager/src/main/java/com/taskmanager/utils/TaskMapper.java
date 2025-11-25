package com.taskmanager.utils;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.taskmanager.model.domain.Task;
import com.taskmanager.model.dto.entity.TaskDTO;

@Mapper(componentModel = "spring")
public interface TaskMapper {

    @Mapping(source = "owner.id", target = "ownerId")
    public TaskDTO entityToDTO(Task task);

    @Mapping(source = "ownerId", target = "owner.id")
    public Task dtoToEntity(TaskDTO taskDTO);

}
