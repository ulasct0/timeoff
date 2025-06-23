package com.internBackend.timeoff.service;

import com.internBackend.employee.entity.Employee;
import com.internBackend.employee.repository.EmployeeRepository;
import com.internBackend.timeoff.entity.Timeoff;
import com.internBackend.timeoff.repository.TimeoffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;
import java.util.Optional;

@Service
public class TimeoffServiceImpl implements TimeoffService {

    @Autowired
    private TimeoffRepository timeoffRepository;
    @Autowired
    private EmployeeRepository employeeRepository;

    public TimeoffServiceImpl(TimeoffRepository timeoffRepository, EmployeeRepository employeeRepository) {
        this.timeoffRepository = timeoffRepository;
        this.employeeRepository = employeeRepository;
    }

    @Override
    public List<Timeoff> fetchAllTimeoffs() {
        return timeoffRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Timeoff> getAllTimeoffsByEmployeeId(Long employeeId) {
        return timeoffRepository.getAllTimeoffsByEmployeeId(employeeId);
    }

    @Override
    public void updateStatusById(Long id, String status) {
        timeoffRepository.updateStatusById(id, status);
    }

    @Override
    @Transactional(readOnly = true)
    public Long countAllTimeoffs() {
        return timeoffRepository.countAllTimeoffs();
    }

    @Override
    @Transactional(readOnly = true)
    public Long countAllApprovedTimeoffs() {
        return timeoffRepository.countAllApprovedTimeoffs();
    }

    @Override
    @Transactional(readOnly = true)
    public Long countAllApprovedTimeoffsByEmployeeId(Long employeeId) {
        return timeoffRepository.countAllApprovedTimeoffsByEmployeeId(employeeId);
    }

    @Override
    public Timeoff fetchTimeoffById(Long id) {
        return timeoffRepository.findById(id).get();
    }

    @Override
    public Timeoff createTimeoff(Timeoff timeoff) {
        return timeoffRepository.save(timeoff);
    }

    @Override
    public Timeoff updateTimeoff(Timeoff timeoff) {
        return timeoffRepository.save(timeoff);
    }

    @Override
    public String deleteTimeoff(Timeoff timeoff) {
        timeoffRepository.delete(timeoff);
        return "Task is deleted successfully for id: " + timeoff.getId();
    }

    @Override
    public Integer getRemainingTimeoffByEmployeeId(Long employeeId) {
        int yearsPassed = 0;
        var employeeOpt = employeeRepository.findById(employeeId);
        if (employeeOpt.isPresent()) {
            var employee = employeeOpt.get();
            Period period = Period.between(employee.getStartDate(), LocalDate.now());
            yearsPassed = period.getYears();
        }
        int earnedTimeoffs = yearsPassed * 14;
        var usedTimeoffs = Math.toIntExact(timeoffRepository.countAllApprovedTimeoffsByEmployeeId(employeeId));
        return earnedTimeoffs - usedTimeoffs;
    }
}
