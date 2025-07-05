package com.internBackend.employee.dto;

import com.internBackend.employee.entity.Gender;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GenderCountDTO {
    private Gender gender;
    private Long count;
}
