package com.financialdashboard.infrastructure.persistence.repository;

import com.financialdashboard.domain.model.PurchaseItem;
import com.financialdashboard.domain.port.out.PurchaseItemRepositoryPort;
import com.financialdashboard.infrastructure.persistence.mapper.PurchaseItemMapper;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class PurchaseItemRepositoryAdapter implements PurchaseItemRepositoryPort {
    private final PurchaseItemMapper mapper;

    @Override
    public PurchaseItem save(PurchaseItem entity) { mapper.insert(entity); return entity; }

    @Override
    public void update(PurchaseItem entity) { mapper.update(entity); }

    @Override
    public Optional<PurchaseItem> findById(Long id) { return mapper.findById(id); }

    @Override
    public List<PurchaseItem> findAll() { return mapper.findAll(); }

    @Override
    public void deleteById(Long id) { mapper.deleteById(id); }

    @Override
    public List<PurchaseItem> findByPurchaseId(Long purchaseId) { return mapper.findByPurchaseId(purchaseId); }

}
