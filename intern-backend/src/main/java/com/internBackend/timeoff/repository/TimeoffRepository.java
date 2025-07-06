package com.internBackend.timeoff.repository;

import com.internBackend.timeoff.dto.TimeoffDTO;
import com.internBackend.timeoff.entity.Status;
import com.internBackend.timeoff.entity.Timeoff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TimeoffRepository extends JpaRepository<Timeoff, Long> {

    @Query("SELECT COUNT(t) FROM Timeoff t WHERE t.status != 'Pending' AND t.employeeId = ?1")
    long countUsedTimeoffsByEmployeeId(Long employeeId);

    @Query("SELECT COUNT(t) FROM Timeoff t WHERE t.status = 'Pending'")
    long countPendingTimeoffs();

    List<Timeoff> getAllTimeoffsByEmployeeId(Long employeeId);

    @Query("SELECT COUNT(t) FROM Timeoff t")
    long countAllTimeoffs();

    @Query("SELECT COUNT(t) from Timeoff t where t.status='Approved'")
    long countAllApprovedTimeoffs();

    @Query("SELECT COUNT(t) FROM Timeoff t WHERE t.status = 'Approved' AND t.employeeId = ?1")
    long countAllApprovedTimeoffsByEmployeeId(Long employeeId);

    List<Timeoff> findAllTimeoffsByStatus(Status status);

    @Query("SELECT t FROM Timeoff t WHERE t.status = 'Approved' AND :today BETWEEN t.startDate AND t.endDate")
    List<Timeoff> getTodayAndApprovedTimeoffs(@Param("today") LocalDate today);

    @Query("SELECT COUNT(t) FROM Timeoff t WHERE t.status = 'Approved' AND t.startDate = :today")
    long countTodayAndApprovedTimeoffs(@Param("today") LocalDate today);

    @Query("SELECT COUNT(t) FROM Timeoff t WHERE t.employeeId = ?1")
    long countAllTimeoffsByEmployeeId(Long employeeId);
}
