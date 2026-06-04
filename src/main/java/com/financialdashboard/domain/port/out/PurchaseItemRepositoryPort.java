package com.financialdashboard.domain.port.out;

import com.financialdashboard.domain.model.PurchaseItem;
import java.util.List;
import java.util.Optional;

public interface PurchaseItemRepositoryPort {
    PurchaseItem save(PurchaseItem entity);
    void update(PurchaseItem entity);
    Optional<PurchaseItem> findById(Long id);
    List<PurchaseItem> findAll();
    void deleteById(Long id);
    List<PurchaseItem> findByPurchaseId(Long purchaseId);
}
