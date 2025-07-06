package com.internBackend.employee.repository;

import com.internBackend.employee.dto.GenderCountDTO;
import com.internBackend.employee.dto.PositionCountDTO;
import com.internBackend.employee.entity.Employee;
import com.internBackend.employee.entity.Position;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface EmployeeRepository extends CrudRepository<Employee, Long> {
    Optional<Employee> findByEmailAndPassword(String email, String password);

    @Query("SELECT e.position FROM Employee e WHERE e.id = ?1")
    Position getPositionByEmployeeId(Long employeeId);

    @Query("SELECT COUNT(e) FROM Employee e")
    long countAllEmployees();

    @Query("SELECT e FROM Employee e WHERE e.position = :position")
    List<Employee> getEmployeesByPosition(@Param("position") String position);


    @Query("SELECT DISTINCT t.employee FROM Spending t WHERE :today BETWEEN t.startDate AND t.endDate")
    List<Employee> getEmployeesOnTimeoff(@Param("today") LocalDate today);


    @Query("SELECT new com.internBackend.employee.dto.GenderCountDTO(e.gender, COUNT(e)) " +
            "FROM Employee e GROUP BY e.gender")
    List<GenderCountDTO> countEmployeesByGender();

    @Query("SELECT new com.internBackend.employee.dto.PositionCountDTO(e.position, COUNT(e)) " +
            "FROM Employee e GROUP BY e.position")
    List<PositionCountDTO> countEmployeesByPosition();

    @Modifying
    @Query("UPDATE Employee e SET e.position = :position WHERE e.id = :employeeId")
    int changeEmployeePosition(@Param("employeeId") Long employeeId, @Param("position") Position position);

}
