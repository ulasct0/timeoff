package com.internBackend.spending.controller;

import com.internBackend.spending.entity.Spending;
import com.internBackend.spending.service.SpendingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(maxAge = 3360)
@RestController
@RequestMapping("/api/v1/spendings")
public class SpendingController {

    @Autowired
    private final SpendingService spendingService;

    public SpendingController(SpendingService spendingService) {
        this.spendingService = spendingService;
    }

    @GetMapping
    public ResponseEntity<List<Spending>> fetchAllSpendings() {
        return ResponseEntity.ok(spendingService.fetchAllSpendings());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Spending> fetchSpendingById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(spendingService.fetchSpendingById(id));
    }

    @GetMapping("/employee/allSpendings/{id}")
    public ResponseEntity<List<Spending>> getAllSpendingsByEmployeeId(@PathVariable("id") Long id) {
        return ResponseEntity.ok(spendingService.getAllSpendingsByEmployeeId(id));
    }

    /** 3. Fetch all Spendings for a given employee */
    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<Spending>> fetchByEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(
                spendingService.getAllSpendingsByEmployeeId(employeeId)
        );
    }

    @GetMapping("/employee/used/{employeeId}")
    public ResponseEntity<Long> countUsedSpendingsByEmployeeId(@PathVariable Long employeeId) {
        return ResponseEntity.ok(
                spendingService.countUsedSpendingsByEmployeeId(employeeId)
        );
    }

    @PostMapping
    public ResponseEntity<Spending> createSpending(@RequestBody Spending spending) {
        spending.setId(null);
        return ResponseEntity.ok(spendingService.createSpending(spending));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Spending> updateSpending(
            @PathVariable Long id,
            @RequestBody Spending spending
    ) {
        // 1) Load the existing row by ID (so JPA knows you mean “update”)
        Spending existing = spendingService.fetchSpendingById(id);

        // 2) Copy every field you care about from the incoming JSON…
        existing.setEmployeeId(spending.getEmployeeId());
        existing.setStartDate(spending.getStartDate());
        existing.setEndDate(spending.getEndDate());
        existing.setSpendingAmount(spending.getSpendingAmount());
        existing.setStatus(spending.getStatus());
        existing.setReason(spending.getReason());

        // 3) Save the managed entity, which results in an UPDATE
        Spending updated = spendingService.updateSpending(existing);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteSpending(@PathVariable("id") Long id) {
        Spending existing = spendingService.fetchSpendingById(id);
        Map<String, String> response = new HashMap<>();

        if (existing != null) {
            String msg = spendingService.deleteSpending(existing);
            response.put("message", msg);
        } else {
            response.put("message", "Task not found with id: " + id);
        }
        return ResponseEntity.ok(response);
    }

    /** 8. Get total count of all spendings */
    @GetMapping("/count")
    public ResponseEntity<Long> getTotalCount() {
        return ResponseEntity.ok(spendingService.countAllSpendings());
    }

    @GetMapping("/approved/count")
    public ResponseEntity<Long> getTotalApprovedCount() {
        return ResponseEntity.ok(spendingService.countAllApprovedSpendings());
    }

    /** 9. Get count of approved spendings for an employee */
    @GetMapping("/employee/{employeeId}/approved/count")
    public ResponseEntity<Long> getApprovedCount(
            @PathVariable Long employeeId
    ) {
        return ResponseEntity.ok(
                spendingService.countAllApprovedSpendingsByEmployeeId(employeeId)
        );
    }

    @GetMapping("/employee/remaining/{employeeId}")
    public ResponseEntity<Integer> getRemainingSpending(
            @PathVariable Long employeeId
    ) {
        int remaining = spendingService.getRemainingSpendingByEmployeeId(employeeId);
        return ResponseEntity.ok(remaining);
    }

    @GetMapping("/changeSpendingStatus/{id}")
    public Spending changeSpendingStatus(@PathVariable Long id) {
        return spendingService.changeSpendingStatus(id);
    }

    @GetMapping("/pendingSpendings")
    public ResponseEntity<List<Spending>> getPendingSpendings() {
        return ResponseEntity.ok(spendingService.getPendingSpendings());
    }

    @GetMapping("/countPendingSpendings")
    public ResponseEntity<Long> countPendingSpendings() {
        return ResponseEntity.ok(spendingService.countPendingSpendings());
    }

    @GetMapping("/todayAndApprovedSpendings")
    public ResponseEntity<List<Spending>> getTodayAndApprovedSpendings() {
        return ResponseEntity.ok(spendingService.getTodayAndApprovedSpendings());
    }

    @GetMapping("/countTodayAndApprovedSpendings")
    public ResponseEntity<Long> countTodayAndApprovedSpendings() {
        return ResponseEntity.ok(spendingService.countTodayAndApprovedSpendings());
    }

    @GetMapping("/count/{employeeId}")
    public ResponseEntity<Long> countAllSpendingsByEmployeeId(@PathVariable Long employeeId) {
        return ResponseEntity.ok(spendingService.countAllSpendingsByEmployeeId(employeeId));
    }
}