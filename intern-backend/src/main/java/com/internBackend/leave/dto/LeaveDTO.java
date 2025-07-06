package com.internBackend.leave.dto;


import com.internBackend.timeoff.entity.Status;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@Builder
public class LeaveDTO {
    private Long id;
    private Long employeeId;
    private String employeeFullName;
    private LocalDate date;
    private Status status;
    private String reason;
}
