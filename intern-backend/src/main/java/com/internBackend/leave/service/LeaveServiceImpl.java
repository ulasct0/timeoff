package com.internBackend.leave.service;

import com.internBackend.employee.entity.Employee;
import com.internBackend.employee.repository.EmployeeRepository;
import com.internBackend.leave.dto.LeaveDTO;
import com.internBackend.leave.entity.Leave;
import com.internBackend.leave.repository.LeaveRepository;
import com.internBackend.timeoff.entity.Status;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class LeaveServiceImpl implements LeaveService {

    @Autowired
    private LeaveRepository leaveRepository;
    @Autowired
    private EmployeeRepository employeeRepository;

    public LeaveServiceImpl(LeaveRepository leaveRepository, EmployeeRepository employeeRepository) {
        this.leaveRepository = leaveRepository;
        this.employeeRepository = employeeRepository;
    }

    @Override
    public LeaveDTO convertToDTO(Leave leave) {
        Employee emp = employeeRepository.findById(leave.getEmployeeId())
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        return LeaveDTO.builder()
                .id(leave.getId())
                .employeeId(emp.getId())
                .employeeFullName(emp.getName() + " " + emp.getSurname())
                .date(leave.getDate())
                .status(leave.getStatus())
                .reason(leave.getReason())
                .build();
    }

    @Override
    public List<Leave> fetchAllLeaves() {
        return leaveRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Leave> getAllLeavesByEmployeeId(Long employeeId) {
        return leaveRepository.getAllLeavesByEmployeeId(employeeId);
    }

    @Override
    @Transactional(readOnly = true)
    public Long countAllLeaves() {
        return leaveRepository.countAllLeaves();
    }

    @Override
    @Transactional(readOnly = true)
    public Long countAllApprovedLeaves() {
        return leaveRepository.countAllApprovedLeaves();
    }

    @Override
    @Transactional(readOnly = true)
    public Long countAllApprovedLeavesByEmployeeId(Long employeeId) {
        return leaveRepository.countAllApprovedLeavesByEmployeeId(employeeId);
    }

    @Override
    public Leave fetchLeaveById(Long id) {
        return leaveRepository.findById(id).get();
    }

    @Override
    public Leave createLeave(Leave leave) {
        return leaveRepository.save(leave);
    }

    @Override
    public Leave updateLeave(Leave leave) {
        return leaveRepository.save(leave);
    }

    @Override
    public String deleteLeave(Leave leave) {
        leaveRepository.delete(leave);
        return "Task is deleted successfully for id: " + leave.getId();
    }

    @Override
    @Transactional
    public Leave changeLeaveStatus(Long id) {
        Leave t = leaveRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Leave not found: " + id));;

        if (t.getStatus().equals(Status.valueOf("Pending")) || t.getStatus().equals(Status.valueOf("Rejected"))) {
            t.setStatus(Status.valueOf("Approved"));
        } else {
            t.setStatus(Status.valueOf("Rejected"));
        }

        return t;
    }

    @Override
    public List<LeaveDTO> getPendingLeaves() {
        List<Leave> leaves = leaveRepository.findAllLeavesByStatus(Status.valueOf("Pending"));
        return leaves.stream()
                .map(this::convertToDTO)
                .toList();
    }

    @Override
    public Long countPendingLeaves() {
        return leaveRepository.countPendingLeaves();
    }

    @Override
    public List<LeaveDTO> getTodayAndApprovedLeaves() {
        List<Leave> leaves = this.leaveRepository.getTodayAndApprovedLeaves(LocalDate.now());
        return leaves.stream()
                .map(this::convertToDTO)
                .toList();
    }

    @Override
    public Long countTodayAndApprovedLeaves() {
        return this.leaveRepository.countTodayAndApprovedLeaves(LocalDate.now());
    }

    @Override
    public List<LeaveDTO> fetchAllLeaveDTOs() {
        List<Leave> leaves = leaveRepository.findAll();
        return leaves.stream()
                .map(this::convertToDTO)
                .toList();
    }

    @Override
    public List<LeaveDTO> fetchAllLeaveDTOsByEmployeeId(Long employeeId){
        List<Leave> leaves = leaveRepository.getAllLeavesByEmployeeId(employeeId);
        return leaves.stream()
                .map(this::convertToDTO)
                .toList();
    }
    @Override
    public Long countAllLeavesByEmployeeId(Long employeeId){
        return leaveRepository.countAllLeavesByEmployeeId(employeeId);
    }
}
