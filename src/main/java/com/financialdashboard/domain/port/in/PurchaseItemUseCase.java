package com.financialdashboard.domain.port.in;

import com.financialdashboard.application.dto.purchaseitem.*;
import java.time.LocalDate;
import java.util.List;

public interface PurchaseItemUseCase {
    PurchaseItemResponse create(CreatePurchaseItemRequest request);
    PurchaseItemResponse update(Long id, UpdatePurchaseItemRequest request);
    PurchaseItemResponse findById(Long id);
    List<PurchaseItemResponse> findAll();
    void delete(Long id);
    List<PurchaseItemResponse> findByPurchaseId(Long purchaseId);
}
