package com.internBackend.timeoff.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.internBackend.employee.entity.Employee;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

/**
 * JPA entity mapping for the timeoff.timeoffs table.
 */
@Entity
@Table(name = "timeoffs", schema = "timeoff")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Timeoff {

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

    /**
     * Start date of the time off.
     */
    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    /**
     * End date of the time off.
     */
    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    /**
     * Type identifier (e.g. vacation=1, sick=2).
     */
    @Column(name = "type_id", nullable = false)
    private Integer typeId;

    /**
     * Current status (e.g. pending, approved, rejected).
     */
    @Enumerated(EnumType.STRING)
    @Column(length = 100, nullable = false)
    private Status status;

    /**
     * Optional reason or comment.
     */
    @Column(columnDefinition = "TEXT")
    private String reason;
}
