package com.financialdashboard.infrastructure.persistence.repository;

import com.financialdashboard.domain.model.PaymentMethod;
import com.financialdashboard.domain.port.out.PaymentMethodRepositoryPort;
import com.financialdashboard.infrastructure.persistence.mapper.PaymentMethodMapper;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class PaymentMethodRepositoryAdapter implements PaymentMethodRepositoryPort {
    private final PaymentMethodMapper mapper;

    @Override
    public PaymentMethod save(PaymentMethod entity) { mapper.insert(entity); return entity; }

    @Override
    public void update(PaymentMethod entity) { mapper.update(entity); }

    @Override
    public Optional<PaymentMethod> findById(Long id) { return mapper.findById(id); }

    @Override
    public List<PaymentMethod> findAll() { return mapper.findAll(); }

    @Override
    public void deleteById(Long id) { mapper.softDeleteById(id); }

    @Override
    public boolean existsByName(String name) { return mapper.existsByName(name); }

}
