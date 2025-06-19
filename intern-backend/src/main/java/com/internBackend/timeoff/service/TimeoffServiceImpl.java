package com.internBackend.timeoff.service;

import com.internBackend.employee.entity.Employee;
import com.internBackend.employee.repository.EmployeeRepository;
import com.internBackend.timeoff.entity.Timeoff;
import com.internBackend.timeoff.repository.TimeoffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    @Override
    public List<Timeoff> fetchAllTimeoffs() {
        return timeoffRepository.findAll();
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

    public Integer getRemainingTimeoffByEmployeeId(Long employeeId){

        Integer yearsPassed = 0;

        var employee = employeeRepository.findById(employeeId);
        if(employee.isPresent()){
            Period period = Period.between(employee.get().getStartDate(), LocalDate.now());
            yearsPassed = period.getYears();
        }

        var earnedTimeoffs = yearsPassed * 14;

        var usedTimeoffs = timeoffRepository.getAllApprovedTimeoffCountByEmployeeId(employeeId);

        return earnedTimeoffs - usedTimeoffs;
    }
}
