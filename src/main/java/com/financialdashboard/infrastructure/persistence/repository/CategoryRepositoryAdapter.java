package com.financialdashboard.infrastructure.persistence.repository;

import com.financialdashboard.domain.model.Category;
import com.financialdashboard.domain.port.out.CategoryRepositoryPort;
import com.financialdashboard.infrastructure.persistence.mapper.CategoryMapper;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class CategoryRepositoryAdapter implements CategoryRepositoryPort {
    private final CategoryMapper mapper;

    @Override
    public Category save(Category entity) { mapper.insert(entity); return entity; }

    @Override
    public void update(Category entity) { mapper.update(entity); }

    @Override
    public Optional<Category> findById(Long id) { return mapper.findById(id); }

    @Override
    public List<Category> findAll() { return mapper.findAll(); }

    @Override
    public void deleteById(Long id) { mapper.softDeleteById(id); }

    @Override
    public boolean existsByName(String name) { return mapper.existsByName(name); }

}
