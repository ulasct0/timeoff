package com.internBackend.spending.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.internBackend.employee.entity.Employee;
import com.internBackend.timeoff.entity.Status;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

/**
 * JPA entity mapping for the spending.spendings table.
 */
@Entity
@Table(name = "spendings", schema = "timeoff")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Spending {

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
    @Column(name = "spending_amount", nullable = false)
    private Integer spendingAmount;

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
