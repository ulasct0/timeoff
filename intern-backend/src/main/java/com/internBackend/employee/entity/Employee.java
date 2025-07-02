package com.internBackend.employee.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "employees", schema = "timeoff")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 100)
    private String surname;

    @Enumerated(EnumType.STRING) // Optional but recommended
    private Gender gender;

    @Column
    private String avatar;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(nullable = false, length = 255)
    private String password;

    @Column(name = "position", length = 100)
    private String position;

    private Double salary;

    @Column
    private String address;

    @Column(name = "phone_number", length = 50)
    private String phoneNumber;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;
}
