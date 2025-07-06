package com.internBackend.employee.service;

import com.internBackend.employee.dto.GenderCountDTO;
import com.internBackend.employee.dto.PositionCountDTO;
import com.internBackend.employee.entity.Employee;
import com.internBackend.employee.entity.Position;

import java.util.List;

public interface EmployeeService {

    Position getPositionByEmployeeId(Long employeeId);
    long countAllEmployees();
    long authenticate(String email, String password);

    List<Employee> fetchAllEmployees();
    Employee fetchEmployeeById(Long id);
    Employee createEmployee(Employee employee);
    Employee updateEmployee(Employee employee);
    String deleteEmployee(Employee employee);
    List<Employee> getEmployeesOnTimeoff();

    List<GenderCountDTO> getGenderCounts();
    List<PositionCountDTO> getPositionCounts();
    boolean changeEmployeePosition(Long employeeId, Position newPosition);
}
