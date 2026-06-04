package com.financialdashboard.domain.port.out;

import com.financialdashboard.domain.model.PaymentMethod;
import java.util.List;
import java.util.Optional;

public interface PaymentMethodRepositoryPort {
    PaymentMethod save(PaymentMethod entity);
    void update(PaymentMethod entity);
    Optional<PaymentMethod> findById(Long id);
    List<PaymentMethod> findAll();
    void deleteById(Long id);
    boolean existsByName(String name);
}
