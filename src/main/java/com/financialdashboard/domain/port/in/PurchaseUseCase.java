package com.financialdashboard.domain.port.in;

import com.financialdashboard.application.dto.purchase.*;
import java.time.LocalDate;
import java.util.List;

public interface PurchaseUseCase {
    PurchaseResponse create(CreatePurchaseRequest request);
    PurchaseResponse update(Long id, UpdatePurchaseRequest request);
    PurchaseResponse findById(Long id);
    List<PurchaseResponse> findAll(LocalDate dateFrom, LocalDate dateTo);
    void delete(Long id);
}
