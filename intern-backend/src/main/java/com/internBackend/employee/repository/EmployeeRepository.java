package com.internBackend.employee.repository;

import com.internBackend.employee.entity.Employee;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface EmployeeRepository extends CrudRepository<Employee, Long> {
    Optional<Employee> findByEmailAndPassword(String email, String password);

    @Query("SELECT e.position FROM Employee e WHERE e.id = ?1")
    String getPositionByEmployeeId(Long employeeId);

    @Query("SELECT COUNT(e) FROM Employee e")
    long countAllEmployees();

    @Query("SELECT e FROM Employee e WHERE e.position = :position")
    List<Employee> getEmployeesByPosition(@Param("position") String position);


    @Query("SELECT DISTINCT t.employee FROM Timeoff t WHERE :today BETWEEN t.startDate AND t.endDate")
    List<Employee> getEmployeesOnTimeoff(@Param("today") LocalDate today);
}
