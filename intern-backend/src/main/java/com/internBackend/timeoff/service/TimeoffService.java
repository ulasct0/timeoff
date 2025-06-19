package com.internBackend.timeoff.service;

import com.internBackend.timeoff.entity.Timeoff;

import java.util.List;

public interface TimeoffService {
    List<Timeoff> fetchAllTimeoffs();
    Timeoff fetchTimeoffById(Long id);
    Timeoff createTimeoff(Timeoff timeoff);
    Timeoff updateTimeoff(Timeoff timeoff);
    String deleteTimeoff(Timeoff timeoff);
}
