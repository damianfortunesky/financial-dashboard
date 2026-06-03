package com.financialdashboard.domain.port.out;

import com.financialdashboard.domain.model.Purchase;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface PurchaseRepositoryPort {
    Purchase save(Purchase entity);
    void update(Purchase entity);
    Optional<Purchase> findById(Long id);
    List<Purchase> findAll(LocalDate dateFrom, LocalDate dateTo);
    void deleteById(Long id);
}
