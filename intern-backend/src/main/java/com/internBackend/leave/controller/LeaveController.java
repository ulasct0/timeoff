package com.internBackend.leave.controller;

import com.internBackend.leave.dto.LeaveDTO;
import com.internBackend.leave.entity.Leave;
import com.internBackend.leave.service.LeaveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(maxAge = 3360)
@RestController
@RequestMapping("/api/v1/leaves")
public class LeaveController {
    private final LeaveService leaveService;

    @Autowired
    public LeaveController(LeaveService leaveService) {
        this.leaveService = leaveService;
    }

    @GetMapping
    public ResponseEntity<List<Leave>> fetchAllLeaves() {
        return ResponseEntity.ok(leaveService.fetchAllLeaves());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Leave> fetchLeaveById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(leaveService.fetchLeaveById(id));
    }

    @GetMapping("/employee/allLeaves/{id}")
    public ResponseEntity<List<Leave>> getAllLeavesByEmployeeId(@PathVariable("id") Long id) {
        return ResponseEntity.ok(leaveService.getAllLeavesByEmployeeId(id));
    }

    /** 3. Fetch all leaves for a given employee */
    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<Leave>> fetchByEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(
                leaveService.getAllLeavesByEmployeeId(employeeId)
        );
    }

    @PostMapping
    public ResponseEntity<Leave> createLeave(@RequestBody Leave leave) {
        leave.setId(null);
        return ResponseEntity.ok(leaveService.createLeave(leave));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Leave> updateLeave(
            @PathVariable Long id,
            @RequestBody Leave leave
    ) {
        // 1) Load the existing row by ID (so JPA knows you mean “update”)
        Leave existing = leaveService.fetchLeaveById(id);

        // 2) Copy every field you care about from the incoming JSON…
        existing.setEmployeeId(leave.getEmployeeId());
        existing.setDate  (leave.getDate());
        existing.setStatus     (leave.getStatus());
        existing.setReason     (leave.getReason());

        // 3) Save the managed entity, which results in an UPDATE
        Leave updated = leaveService.updateLeave(existing);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteLeave(@PathVariable("id") Long id) {
        Leave existing = leaveService.fetchLeaveById(id);
        Map<String, String> response = new HashMap<>();

        if (existing != null) {
            String msg = leaveService.deleteLeave(existing);
            response.put("message", msg);
        } else {
            response.put("message", "Task not found with id: " + id);
        }
        return ResponseEntity.ok(response);
    }

    /** 8. Get total count of all leaves */
    @GetMapping("/count")
    public ResponseEntity<Long> getTotalCount() {
        return ResponseEntity.ok(leaveService.countAllLeaves());
    }

    @GetMapping("/approved/count")
    public ResponseEntity<Long> getTotalApprovedCount() {
        return ResponseEntity.ok(leaveService.countAllApprovedLeaves());
    }

    /** 9. Get count of approved leaves for an employee */
    @GetMapping("/employee/{employeeId}/approved/count")
    public ResponseEntity<Long> getApprovedCount(
            @PathVariable Long employeeId
    ) {
        return ResponseEntity.ok(
                leaveService.countAllApprovedLeavesByEmployeeId(employeeId)
        );
    }

    @GetMapping("/changeLeaveStatus/{id}")
    public  ResponseEntity<Leave> changeLeaveStatus(@PathVariable Long id) {
        return ResponseEntity.ok(leaveService.changeLeaveStatus(id));
    }

    @GetMapping("/pendingLeaves")
    public ResponseEntity<List<LeaveDTO>> getPendingLeaves() {
        return ResponseEntity.ok(leaveService.getPendingLeaves());
    }

    @GetMapping("/countPendingLeaves")
    public ResponseEntity<Long> countPendingLeaves() {
        return ResponseEntity.ok(leaveService.countPendingLeaves());
    }

    @GetMapping("/todayAndApprovedLeaves")
    public ResponseEntity<List<LeaveDTO>> getTodayAndApprovedLeaves() {
        return ResponseEntity.ok(leaveService.getTodayAndApprovedLeaves());
    }

    @GetMapping("/countTodayAndApprovedLeaves")
    public ResponseEntity<Long> countTodayAndApprovedLeaves() {
        return ResponseEntity.ok(leaveService.countTodayAndApprovedLeaves());
    }

    @GetMapping("/withFullName")
    public ResponseEntity<List<LeaveDTO>> fetchAllLeavesWithFullName() {
        return ResponseEntity.ok(leaveService.fetchAllLeaveDTOs());
    }

    @GetMapping("/withFullName/{employeeId}")
    public ResponseEntity<List<LeaveDTO>> fetchAllLeavesByEmployeeIdWithFullName(@PathVariable Long employeeId) {
        return ResponseEntity.ok(leaveService.fetchAllLeaveDTOsByEmployeeId(employeeId));
    }

    @GetMapping("/count/{employeeId}")
    public ResponseEntity<Long> countAllLeavesByEmployeeId(@PathVariable Long employeeId) {
        return ResponseEntity.ok(leaveService.countAllLeavesByEmployeeId(employeeId));
    }
}
