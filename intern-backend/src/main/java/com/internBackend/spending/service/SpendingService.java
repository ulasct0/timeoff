package com.internBackend.spending.service;
import com.internBackend.spending.entity.Spending;

import java.util.List;

public interface SpendingService {
    List<Spending> fetchAllSpendings();
    List<Spending> getAllSpendingsByEmployeeId(Long employeeId);
    Long countAllSpendings();
    Long countAllApprovedSpendings();
    Long countAllApprovedSpendingsByEmployeeId(Long employeeId);
    Long countUsedSpendingsByEmployeeId(Long employeeId);


    Integer getRemainingSpendingByEmployeeId(Long employeeId);

    Spending fetchSpendingById(Long id);
    Spending createSpending(Spending spending);
    Spending updateSpending(Spending spending);
    String deleteSpending(Spending spending);
    Spending changeSpendingStatus(Long id);

    List<Spending> getPendingSpendings();
    Long countPendingSpendings();
    List<Spending> getTodayAndApprovedSpendings();
    Long countTodayAndApprovedSpendings();

    Long countAllSpendingsByEmployeeId(Long employeeId);
}
