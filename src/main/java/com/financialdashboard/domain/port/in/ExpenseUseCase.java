package com.financialdashboard.domain.port.in;

import com.financialdashboard.application.dto.expense.*;
import java.time.LocalDate;
import java.util.List;

public interface ExpenseUseCase {
    ExpenseResponse create(CreateExpenseRequest request);
    ExpenseResponse update(Long id, UpdateExpenseRequest request);
    ExpenseResponse findById(Long id);
    List<ExpenseResponse> findAll(LocalDate dateFrom, LocalDate dateTo, Long categoryId, Long subcategoryId, Long paymentMethodId, Long merchantId, Boolean necessary);
    void delete(Long id);
}
