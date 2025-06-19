package com.internBackend.timeoff.repository;

import com.internBackend.timeoff.entity.Timeoff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface TimeoffRepository extends JpaRepository<Timeoff, Long> {

    Timeoff[] getAllByEmployeeId(Long employeeId);

    void setTimeoffStatus(Long id, String status);

    @Query("SELECT COUNT(*) FROM Timeoff")
    Integer getAllTimeoffCount();

    @Query("SELECT COUNT(*) FROM Timeoff WHERE status = 'approved' AND employeeId = ?1")
    Integer getAllApprovedTimeoffCountByEmployeeId(Long employeeId);
}
