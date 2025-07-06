package com.internBackend.employee.dto;

import com.internBackend.employee.entity.Position;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PositionCountDTO {
    private Position position;
    private Long count;
}