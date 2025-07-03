package com.internBackend.timeoff.dto;

import com.internBackend.timeoff.entity.Status;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@Builder
public class TimeoffDTO {
    private Long id;
    private Long employeeId;
    private String employeeFullName;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer typeId;
    private Status status;
    private String reason;
}
