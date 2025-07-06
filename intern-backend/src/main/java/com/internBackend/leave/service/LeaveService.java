package com.internBackend.leave.service;

import com.internBackend.leave.dto.LeaveDTO;
import com.internBackend.leave.entity.Leave;
import java.util.List;


public interface LeaveService {
    List<Leave> fetchAllLeaves();
    List<Leave> getAllLeavesByEmployeeId(Long employeeId);
    Long countAllLeaves();
    Long countAllApprovedLeaves();
    Long countAllApprovedLeavesByEmployeeId(Long employeeId);

    Leave fetchLeaveById(Long id);
    Leave createLeave(Leave leave);
    Leave updateLeave(Leave leave);
    String deleteLeave(Leave leave);
    Leave changeLeaveStatus(Long id);

    List<LeaveDTO> getPendingLeaves();
    Long countPendingLeaves();
    List<LeaveDTO> getTodayAndApprovedLeaves();
    Long countTodayAndApprovedLeaves();

    LeaveDTO convertToDTO(Leave leave);

    List<LeaveDTO> fetchAllLeaveDTOs();
    List<LeaveDTO> fetchAllLeaveDTOsByEmployeeId(Long employeeId);
    Long countAllLeavesByEmployeeId(Long employeeId);
}
