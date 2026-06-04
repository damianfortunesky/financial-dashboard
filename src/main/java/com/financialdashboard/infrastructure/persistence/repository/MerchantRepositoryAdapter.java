package com.financialdashboard.infrastructure.persistence.repository;

import com.financialdashboard.domain.model.Merchant;
import com.financialdashboard.domain.port.out.MerchantRepositoryPort;
import com.financialdashboard.infrastructure.persistence.mapper.MerchantMapper;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class MerchantRepositoryAdapter implements MerchantRepositoryPort {
    private final MerchantMapper mapper;

    @Override
    public Merchant save(Merchant entity) { mapper.insert(entity); return entity; }

    @Override
    public void update(Merchant entity) { mapper.update(entity); }

    @Override
    public Optional<Merchant> findById(Long id) { return mapper.findById(id); }

    @Override
    public List<Merchant> findAll() { return mapper.findAll(); }

    @Override
    public void deleteById(Long id) { mapper.softDeleteById(id); }

    @Override
    public boolean existsByName(String name) { return mapper.existsByName(name); }

}
