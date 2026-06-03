package com.financialdashboard.infrastructure.persistence.repository;

import com.financialdashboard.domain.model.Purchase;
import com.financialdashboard.domain.port.out.PurchaseRepositoryPort;
import com.financialdashboard.infrastructure.persistence.mapper.PurchaseMapper;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class PurchaseRepositoryAdapter implements PurchaseRepositoryPort {
    private final PurchaseMapper mapper;

    @Override
    public Purchase save(Purchase entity) { mapper.insert(entity); return entity; }

    @Override
    public void update(Purchase entity) { mapper.update(entity); }

    @Override
    public Optional<Purchase> findById(Long id) { return mapper.findById(id); }

    @Override
    public List<Purchase> findAll(LocalDate dateFrom, LocalDate dateTo) { return mapper.findAllFiltered(dateFrom, dateTo); }

    @Override
    public void deleteById(Long id) { mapper.deleteById(id); }

}
