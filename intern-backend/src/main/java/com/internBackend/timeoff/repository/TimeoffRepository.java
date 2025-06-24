package com.internBackend.timeoff.repository;

import com.internBackend.timeoff.entity.Timeoff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TimeoffRepository extends JpaRepository<Timeoff, Long> {

    List<Timeoff> getAllTimeoffsByEmployeeId(Long employeeId);

    @Query("SELECT COUNT(t) FROM Timeoff t")
    long countAllTimeoffs();

    @Query("SELECT COUNT(t) from Timeoff t where t.status='approved'")
    long countAllApprovedTimeoffs();

    @Query("SELECT COUNT(t) FROM Timeoff t WHERE t.status = 'approved' AND t.employeeId = ?1")
    long countAllApprovedTimeoffsByEmployeeId(Long employeeId);
}
