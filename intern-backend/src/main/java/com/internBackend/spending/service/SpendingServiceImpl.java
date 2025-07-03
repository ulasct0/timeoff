package com.internBackend.spending.service;

import com.internBackend.employee.repository.EmployeeRepository;
import com.internBackend.spending.entity.Spending;
import com.internBackend.spending.repository.SpendingRepository;
import com.internBackend.timeoff.entity.Status;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;

@Service
public class SpendingServiceImpl implements SpendingService {

    private static final Logger log = LoggerFactory.getLogger(SpendingServiceImpl.class);

    @Autowired
    private SpendingRepository spendingRepository;
    @Autowired
    private EmployeeRepository employeeRepository;

    public SpendingServiceImpl(SpendingRepository spendingRepository, EmployeeRepository employeeRepository) {
        this.spendingRepository = spendingRepository;
        this.employeeRepository = employeeRepository;
    }

    @Override
    public List<Spending> fetchAllSpendings() {
        return spendingRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Spending> getAllSpendingsByEmployeeId(Long employeeId) {
        return spendingRepository.getAllSpendingsByEmployeeId(employeeId);
    }

    @Override
    @Transactional(readOnly = true)
    public Long countAllSpendings() {
        return spendingRepository.countAllSpendings();
    }

    @Override
    @Transactional(readOnly = true)
    public Long countAllApprovedSpendings() {
        return spendingRepository.countAllApprovedSpendings();
    }

    @Override
    @Transactional(readOnly = true)
    public Long countAllApprovedSpendingsByEmployeeId(Long employeeId) {
        return spendingRepository.countAllApprovedSpendingsByEmployeeId(employeeId);
    }

    @Override
    public Spending fetchSpendingById(Long id) {
        return spendingRepository.findById(id).get();
    }

    @Override
    public Spending createSpending(Spending spending) {
        return spendingRepository.save(spending);
    }

    @Override
    public Spending updateSpending(Spending spending) {
        return spendingRepository.save(spending);
    }

    @Override
        public String deleteSpending(Spending spending) {
        spendingRepository.delete(spending);
        return "Task is deleted successfully for id: " + spending.getId();
    }

    @Override
    public Integer getRemainingSpendingByEmployeeId(Long employeeId) {

        int yearsPassed = 0;
        var employeeOpt = employeeRepository.findById(employeeId);
        if (employeeOpt.isPresent()) {
            var employee = employeeOpt.get();
            Period period = Period.between(employee.getStartDate(), LocalDate.now());
            yearsPassed = period.getYears();
        }

        int earnedSpendings = yearsPassed * 14;
        var usedSpendings = Math.toIntExact(spendingRepository.countAllApprovedSpendingsByEmployeeId(employeeId));

        return earnedSpendings - usedSpendings;

    }

    @Override
    public Long countUsedSpendingsByEmployeeId(Long employeeId){
        return spendingRepository.countUsedSpendingsByEmployeeId(employeeId);
    }

    @Override
    @Transactional
    public Spending changeSpendingStatus(Long id) {
        Spending t = spendingRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Spending not found: " + id));

        if (t.getStatus().equals(Status.valueOf("Pending")) || t.getStatus().equals(Status.valueOf("Rejected"))) {
            t.setStatus(Status.valueOf("Approved"));
        } else {
            t.setStatus(Status.valueOf("Rejected"));
        }

        return t;
    }

    @Override
    public List<Spending> getPendingSpendings() {
        return spendingRepository.findAllSpendingsByStatus(Status.valueOf("Pending"));
    }

    @Override
    public Long countPendingSpendings() {
        return spendingRepository.countPendingSpendings();
    }

    @Override
    public List<Spending> getTodayAndApprovedSpendings() {
        return this.spendingRepository.getTodayAndApprovedSpendings(LocalDate.now());

    }

    @Override
    public Long countTodayAndApprovedSpendings() {
        return this.spendingRepository.countTodayAndApprovedSpendings(LocalDate.now());
    }

    @Override
    public Long countAllSpendingsByEmployeeId(Long employeeId){
        return spendingRepository.countAllSpendingsByEmployeeId(employeeId);
    }
}
