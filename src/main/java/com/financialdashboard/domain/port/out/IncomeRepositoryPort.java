package com.financialdashboard.domain.port.out;

import com.financialdashboard.domain.model.Income;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface IncomeRepositoryPort {
    Income save(Income entity);
    void update(Income entity);
    Optional<Income> findById(Long id);
    List<Income> findAll(LocalDate dateFrom, LocalDate dateTo);
    void deleteById(Long id);
}
