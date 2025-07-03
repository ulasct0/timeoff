package com.internBackend.timeoff.controller;

import com.internBackend.timeoff.dto.TimeoffDTO;
import com.internBackend.timeoff.entity.Timeoff;
import com.internBackend.timeoff.service.TimeoffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(maxAge = 3360)
@RestController
@RequestMapping("/api/v1/timeoffs")
public class TimeoffController {

    @Autowired
    private final TimeoffService timeoffService;

    public TimeoffController(TimeoffService timeoffService) {
        this.timeoffService = timeoffService;
    }

    @GetMapping
    public ResponseEntity<List<Timeoff>> fetchAllTimeoffs() {
        return ResponseEntity.ok(timeoffService.fetchAllTimeoffs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Timeoff> fetchTimeoffById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(timeoffService.fetchTimeoffById(id));
    }

    @GetMapping("/employee/allTimeoffs/{id}")
    public ResponseEntity<List<Timeoff>> getAllTimeoffsByEmployeeId(@PathVariable("id") Long id) {
        return ResponseEntity.ok(timeoffService.getAllTimeoffsByEmployeeId(id));
    }

    /** 3. Fetch all timeoffs for a given employee */
    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<Timeoff>> fetchByEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(
                timeoffService.getAllTimeoffsByEmployeeId(employeeId)
        );
    }

    @GetMapping("/employee/used/{employeeId}")
    public ResponseEntity<Long> countUsedTimeoffsByEmployeeId(@PathVariable Long employeeId) {
        return ResponseEntity.ok(
                timeoffService.countUsedTimeoffsByEmployeeId(employeeId)
        );
    }

    @PostMapping
    public ResponseEntity<Timeoff> createTimeoff(@RequestBody Timeoff timeoff) {
        timeoff.setId(null);
        return ResponseEntity.ok(timeoffService.createTimeoff(timeoff));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Timeoff> updateTimeoff(
            @PathVariable Long id,
            @RequestBody Timeoff timeoff
    ) {
        // 1) Load the existing row by ID (so JPA knows you mean “update”)
        Timeoff existing = timeoffService.fetchTimeoffById(id);

        // 2) Copy every field you care about from the incoming JSON…
        existing.setEmployeeId(timeoff.getEmployeeId());
        existing.setStartDate  (timeoff.getStartDate());
        existing.setEndDate    (timeoff.getEndDate());
        existing.setTypeId     (timeoff.getTypeId());
        existing.setStatus     (timeoff.getStatus());
        existing.setReason     (timeoff.getReason());

        // 3) Save the managed entity, which results in an UPDATE
        Timeoff updated = timeoffService.updateTimeoff(existing);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteTimeoff(@PathVariable("id") Long id) {
        Timeoff existing = timeoffService.fetchTimeoffById(id);
        Map<String, String> response = new HashMap<>();

        if (existing != null) {
            String msg = timeoffService.deleteTimeoff(existing);
            response.put("message", msg);
        } else {
            response.put("message", "Task not found with id: " + id);
        }
        return ResponseEntity.ok(response);
    }

    /** 8. Get total count of all timeoffs */
    @GetMapping("/count")
    public ResponseEntity<Long> getTotalCount() {
        return ResponseEntity.ok(timeoffService.countAllTimeoffs());
    }

    @GetMapping("/approved/count")
    public ResponseEntity<Long> getTotalApprovedCount() {
        return ResponseEntity.ok(timeoffService.countAllApprovedTimeoffs());
    }

    /** 9. Get count of approved timeoffs for an employee */
    @GetMapping("/employee/{employeeId}/approved/count")
    public ResponseEntity<Long> getApprovedCount(
            @PathVariable Long employeeId
    ) {
        return ResponseEntity.ok(
                timeoffService.countAllApprovedTimeoffsByEmployeeId(employeeId)
        );
    }

    @GetMapping("/employee/remaining/{employeeId}")
    public ResponseEntity<Integer> getRemainingTimeoff(
            @PathVariable Long employeeId
    ) {
        int remaining = timeoffService.getRemainingTimeoffByEmployeeId(employeeId);
        return ResponseEntity.ok(remaining);
    }

    @GetMapping("/changeTimeoffStatus/{id}")
    public Timeoff changeTimeoffStatus(@PathVariable Long id) {
        return timeoffService.changeTimeoffStatus(id);
    }

    @GetMapping("/pendingTimeoffs")
    public ResponseEntity<List<TimeoffDTO>> getPendingTimeoffs() {
        return ResponseEntity.ok(timeoffService.getPendingTimeoffs());
    }

    @GetMapping("/countPendingTimeoffs")
    public ResponseEntity<Long> countPendingTimeoffs() {
        return ResponseEntity.ok(timeoffService.countPendingTimeoffs());
    }

    @GetMapping("/todayAndApprovedTimeoffs")
    public ResponseEntity<List<TimeoffDTO>> getTodayAndApprovedTimeoffs() {
        return ResponseEntity.ok(timeoffService.getTodayAndApprovedTimeoffs());
    }

    @GetMapping("/countTodayAndApprovedTimeoffs")
    public ResponseEntity<Long> countTodayAndApprovedTimeoffs() {
        return ResponseEntity.ok(timeoffService.countTodayAndApprovedTimeoffs());
    }

    @GetMapping("/withFullName")
    public ResponseEntity<List<TimeoffDTO>> fetchAllTimeoffsWithFullName() {
        return ResponseEntity.ok(timeoffService.fetchAllTimeoffDTOs());
    }

    @GetMapping("/withFullName/{employeeId}")
    public ResponseEntity<List<TimeoffDTO>> fetchAllTimeoffsByEmployeeIdWithFullName(@PathVariable Long employeeId) {
        return ResponseEntity.ok(timeoffService.fetchAllTimeoffDTOsByEmployeeId(employeeId));
    }

    @GetMapping("/count/{employeeId}")
    public ResponseEntity<Long> countAllTimeoffsByEmployeeId(@PathVariable Long employeeId) {
        return ResponseEntity.ok(timeoffService.countAllTimeoffsByEmployeeId(employeeId));
    }
}