package com.financialdashboard.infrastructure.persistence.repository;

import com.financialdashboard.domain.model.Product;
import com.financialdashboard.domain.port.out.ProductRepositoryPort;
import com.financialdashboard.infrastructure.persistence.mapper.ProductMapper;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class ProductRepositoryAdapter implements ProductRepositoryPort {
    private final ProductMapper mapper;

    @Override
    public Product save(Product entity) { mapper.insert(entity); return entity; }

    @Override
    public void update(Product entity) { mapper.update(entity); }

    @Override
    public Optional<Product> findById(Long id) { return mapper.findById(id); }

    @Override
    public List<Product> findAll() { return mapper.findAll(); }

    @Override
    public void deleteById(Long id) { mapper.softDeleteById(id); }

    @Override
    public boolean existsByName(String name) { return mapper.existsByName(name); }

}
