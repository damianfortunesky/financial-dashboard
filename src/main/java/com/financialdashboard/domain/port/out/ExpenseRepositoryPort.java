package com.financialdashboard.domain.port.out;

import com.financialdashboard.domain.model.Expense;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ExpenseRepositoryPort {
    Expense save(Expense entity);
    void update(Expense entity);
    Optional<Expense> findById(Long id);
    List<Expense> findAll(LocalDate dateFrom, LocalDate dateTo, Long categoryId, Long subcategoryId, Long paymentMethodId, Long merchantId, Boolean necessary);
    void deleteById(Long id);
}
