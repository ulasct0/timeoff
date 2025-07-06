package com.internBackend.leave.repository;

import com.internBackend.leave.entity.Leave;
import com.internBackend.timeoff.entity.Status;
import com.internBackend.timeoff.entity.Timeoff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface LeaveRepository  extends JpaRepository<Leave, Long> {

    @Query("SELECT COUNT(t) FROM Leave t WHERE t.status = 'Pending'")
    long countPendingLeaves();

    List<Leave> getAllLeavesByEmployeeId(Long employeeId);

    @Query("SELECT COUNT(t) FROM Leave t")
    long countAllLeaves();

    @Query("SELECT COUNT(t) from Leave t where t.status='Approved'")
    long countAllApprovedLeaves();

    @Query("SELECT COUNT(t) FROM Leave t WHERE t.status = 'Approved' AND t.employeeId = ?1")
    long countAllApprovedLeavesByEmployeeId(Long employeeId);

    List<Leave> findAllLeavesByStatus(Status status);

    @Query("SELECT t FROM Leave t WHERE t.status = 'Approved' AND :today = t.date")
    List<Leave> getTodayAndApprovedLeaves(@Param("today") LocalDate today);

    @Query("SELECT COUNT(t) FROM Leave t WHERE t.status = 'Approved' AND t.date = :today")
    long countTodayAndApprovedLeaves(@Param("today") LocalDate today);

    @Query("SELECT COUNT(t) FROM Leave t WHERE t.employeeId = ?1")
    long countAllLeavesByEmployeeId(Long employeeId);
}
