package com.internBackend.spending.repository;

import com.internBackend.timeoff.entity.Status;
import com.internBackend.spending.entity.Spending;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface SpendingRepository extends JpaRepository<Spending, Long> {

    @Query("SELECT COUNT(s) FROM Spending s WHERE s.status != 'Pending' AND s.employeeId = ?1")
    long countUsedSpendingsByEmployeeId(Long employeeId);

    @Query("SELECT COUNT(s) FROM Spending s WHERE s.status = 'Pending'")
    long countPendingSpendings();

    List<Spending> getAllSpendingsByEmployeeId(Long employeeId);

    @Query("SELECT COUNT(s) FROM Spending s")
    long countAllSpendings();

    @Query("SELECT COUNT(s) from Spending s where s.status='Approved'")
    long countAllApprovedSpendings();

    @Query("SELECT COUNT(s) FROM Spending s WHERE s.status = 'Approved' AND s.employeeId = ?1")
    long countAllApprovedSpendingsByEmployeeId(Long employeeId);

    List<Spending> findAllSpendingsByStatus(Status status);

    @Query("SELECT s FROM Spending s WHERE s.status = 'Approved' AND s.startDate = :today")
    List<Spending> getTodayAndApprovedSpendings(@Param("today") LocalDate today);

    @Query("SELECT COUNT(s) FROM Spending s WHERE s.status = 'Approved' AND s.startDate = :today")
    long countTodayAndApprovedSpendings(@Param("today") LocalDate today);

    @Query("SELECT COUNT(s) FROM Spending s WHERE s.employeeId = ?1")
    long countAllSpendingsByEmployeeId(Long employeeId);
}
