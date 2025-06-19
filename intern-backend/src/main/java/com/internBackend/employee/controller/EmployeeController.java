package com.internBackend.employee.controller;

import com.internBackend.employee.entity.Employee;
import com.internBackend.employee.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(maxAge = 3360)
@RestController
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @GetMapping("/api/v1/employees")
    public ResponseEntity<List<Employee>> fetchAllEmployees(){
        return ResponseEntity.ok(employeeService.fetchAllEmployees());
    }

    @GetMapping("/api/v1/employees/{id}")
    public ResponseEntity<Employee> fetchById(@PathVariable("id") Long id){
        return ResponseEntity.ok(employeeService.fetchEmployeeById(id));
    }

    @PostMapping("/api/v1/employees")
    public ResponseEntity<Employee> createEmployee(@RequestBody Employee employee){
        employee.setId(null);
        return ResponseEntity.ok(employeeService.createEmployee(employee));
    }

    @PutMapping("/api/v1/employees/{id}")
    public ResponseEntity<Employee> updateEmployee(@PathVariable("id") Long id, @RequestBody Employee employee){
        Employee employeeObj = employeeService.fetchEmployeeById(id);
        if(employeeObj != null){
            // Update every column
            employeeObj.setName(employee.getName());
            employeeObj.setSurname(employee.getSurname());
            employeeObj.setAvatar(employee.getAvatar());
            employeeObj.setEmail(employee.getEmail());
            employeeObj.setPassword(employee.getPassword());
            employeeObj.setPosition(employee.getPosition());
            employeeObj.setAddress(employee.getAddress());
            employeeObj.setPhoneNumber(employee.getPhoneNumber());
            employeeObj.setRemainingTimeoff(employee.getRemainingTimeoff());
        }
        return ResponseEntity.ok(employeeService.updateEmployee(employeeObj));
    }

    @DeleteMapping("/api/v1/employees/{id}")
    public ResponseEntity<Map<String, String>> deleteEmployee(@PathVariable("id") Long id){
        Employee deleteObj = employeeService.fetchEmployeeById(id);
        Map<String, String> response = new HashMap<>();

        if(deleteObj != null){
            String deleteMsg = employeeService.deleteEmployee(deleteObj);
            response.put("message", deleteMsg);
        } else {
            response.put("message", "Employee not found with id: " + id);
        }
        return ResponseEntity.ok(response);
    }
}
