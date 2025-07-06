package com.internBackend.leave.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.internBackend.employee.entity.Employee;
import com.internBackend.timeoff.entity.Status;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "leaves", schema = "timeoff")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Leave {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    /**
     * Raw employee ID for JSON serialization.
     */
    @Column(name = "employee_id", nullable = false)
    private Long employeeId;

    /**
     * JPA relationship to the Employee entity (not serialized).
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false, insertable = false, updatable = false)
    @JsonIgnore
    private Employee employee;

    @Column(name = "date", nullable = false)
    private LocalDate date;

    @Enumerated(EnumType.STRING)
    @Column(length = 100, nullable = false)
    private Status status;

    @Column(columnDefinition = "TEXT")
    private String reason;
}
