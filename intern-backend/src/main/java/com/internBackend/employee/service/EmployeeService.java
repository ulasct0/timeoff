package com.internBackend.employee.service;

import com.internBackend.employee.entity.Employee;

import java.util.List;

public interface EmployeeService {

    String getPositionByEmployeeId(Long employeeId);
    long countAllEmployees();

    List<Employee> fetchAllEmployees();
    Employee fetchEmployeeById(Long id);
    Employee createEmployee(Employee employee);
    Employee updateEmployee(Employee employee);
    String deleteEmployee(Employee employee);
}
