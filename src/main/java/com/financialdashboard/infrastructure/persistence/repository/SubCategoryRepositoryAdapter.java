package com.financialdashboard.infrastructure.persistence.repository;

import com.financialdashboard.domain.model.SubCategory;
import com.financialdashboard.domain.port.out.SubCategoryRepositoryPort;
import com.financialdashboard.infrastructure.persistence.mapper.SubCategoryMapper;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class SubCategoryRepositoryAdapter implements SubCategoryRepositoryPort {
    private final SubCategoryMapper mapper;

    @Override
    public SubCategory save(SubCategory entity) { mapper.insert(entity); return entity; }

    @Override
    public void update(SubCategory entity) { mapper.update(entity); }

    @Override
    public Optional<SubCategory> findById(Long id) { return mapper.findById(id); }

    @Override
    public List<SubCategory> findAll() { return mapper.findAll(); }

    @Override
    public void deleteById(Long id) { mapper.softDeleteById(id); }

    @Override
    public boolean existsByNameAndCategoryId(String name, Long categoryId) { return mapper.existsByNameAndCategoryId(name, categoryId); }

    @Override
    public List<SubCategory> findByCategoryId(Long categoryId) { return mapper.findByCategoryId(categoryId); }

}
