package com.internBackend.employee.service;

import com.internBackend.employee.entity.Employee;
import com.internBackend.employee.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;



    @Override
    @Transactional(readOnly = true)
    public String getPositionByEmployeeId(Long employeeId) {
        return employeeRepository.getPositionByEmployeeId(employeeId);
    }

    @Override
    public long countAllEmployees() {
        return employeeRepository.countAllEmployees();
    }

    @Override
    public List<Employee> fetchAllEmployees() {
        return (List<Employee>) employeeRepository.findAll();
    }

    @Override
    public Employee fetchEmployeeById(Long id) {
        return employeeRepository.findById(id).get();
    }

    @Override
    public Employee createEmployee(Employee employee) {
        return employeeRepository.save(employee);
    }

    @Override
    public Employee updateEmployee(Employee employee) {
        return employeeRepository.save(employee);
    }

    @Override
    public String deleteEmployee(Employee employee) {
        employeeRepository.delete(employee);
        return "Employee is Deleted Successfully for id: " + employee.getId();
    }
}