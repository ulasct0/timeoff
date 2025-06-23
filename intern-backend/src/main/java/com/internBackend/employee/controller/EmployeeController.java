package com.internBackend.employee.controller;

import com.internBackend.employee.entity.Employee;
import com.internBackend.employee.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*",maxAge = 3360)
@RestController
@RequestMapping("/api/v1/employees")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @GetMapping
    public ResponseEntity<List<Employee>> fetchAllEmployees(){
        return ResponseEntity.ok(employeeService.fetchAllEmployees());
    }

    @GetMapping("/stats/count")
    public ResponseEntity<Long> countAllEmployees(){
        return ResponseEntity.ok(employeeService.countAllEmployees());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Employee> fetchEmployeeById(@PathVariable("id") Long id){
        return ResponseEntity.ok(employeeService.fetchEmployeeById(id));
    }

    @GetMapping("/position/{id}")
    public ResponseEntity<String> getPositionByEmployeeId(@PathVariable("id") Long id) {
        String position = employeeService.getPositionByEmployeeId(id);
        return ResponseEntity.ok(position);
    }

    @PostMapping("")
    public ResponseEntity<Employee> createEmployee(@RequestBody Employee employee){
        employee.setId(null);
        return ResponseEntity.ok(employeeService.createEmployee(employee));
    }

    @PutMapping("/{id}")
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
        }
        return ResponseEntity.ok(employeeService.updateEmployee(employeeObj));
    }

    @DeleteMapping("/{id}")
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
