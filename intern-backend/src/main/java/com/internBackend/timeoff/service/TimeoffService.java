package com.internBackend.timeoff.service;

import com.internBackend.timeoff.dto.TimeoffDTO;
import com.internBackend.timeoff.entity.Timeoff;

import java.util.List;

public interface TimeoffService {
    List<Timeoff> fetchAllTimeoffs();
    List<Timeoff> getAllTimeoffsByEmployeeId(Long employeeId);
    Long countAllTimeoffs();
    Long countAllApprovedTimeoffs();
    Long countAllApprovedTimeoffsByEmployeeId(Long employeeId);
    Long countUsedTimeoffsByEmployeeId(Long employeeId);


    Integer getRemainingTimeoffByEmployeeId(Long employeeId);

    Timeoff fetchTimeoffById(Long id);
    Timeoff createTimeoff(Timeoff timeoff);
    Timeoff updateTimeoff(Timeoff timeoff);
    String deleteTimeoff(Timeoff timeoff);
    Timeoff changeTimeoffStatus(Long id);

    List<TimeoffDTO> getPendingTimeoffs();
    Long countPendingTimeoffs();
    List<TimeoffDTO> getTodayAndApprovedTimeoffs();
    Long countTodayAndApprovedTimeoffs();

    TimeoffDTO convertToDTO(Timeoff timeoff);

    List<TimeoffDTO> fetchAllTimeoffDTOs();
    List<TimeoffDTO> fetchAllTimeoffDTOsByEmployeeId(Long employeeId);
    Long countAllTimeoffsByEmployeeId(Long employeeId);
}
