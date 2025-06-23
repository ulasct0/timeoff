package com.internBackend.timeoff.service;

import com.internBackend.timeoff.entity.Timeoff;

import java.util.List;

public interface TimeoffService {
    List<Timeoff> fetchAllTimeoffs();
    List<Timeoff> getAllTimeoffsByEmployeeId(Long employeeId);
    void updateStatusById(Long id, String status);
    Long countAllTimeoffs();
    Long countAllApprovedTimeoffs();
    Long countAllApprovedTimeoffsByEmployeeId(Long employeeId);
    Integer getRemainingTimeoffByEmployeeId(Long employeeId);

    Timeoff fetchTimeoffById(Long id);
    Timeoff createTimeoff(Timeoff timeoff);
    Timeoff updateTimeoff(Timeoff timeoff);
    String deleteTimeoff(Timeoff timeoff);
}
