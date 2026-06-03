package com.financialdashboard.domain.port.in;

import com.financialdashboard.application.dto.income.*;
import java.time.LocalDate;
import java.util.List;

public interface IncomeUseCase {
    IncomeResponse create(CreateIncomeRequest request);
    IncomeResponse update(Long id, UpdateIncomeRequest request);
    IncomeResponse findById(Long id);
    List<IncomeResponse> findAll(LocalDate dateFrom, LocalDate dateTo);
    void delete(Long id);
}
