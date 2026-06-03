package com.financialdashboard.domain.port.out;

import com.financialdashboard.domain.model.SubCategory;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface SubCategoryRepositoryPort {
    SubCategory save(SubCategory entity);
    void update(SubCategory entity);
    Optional<SubCategory> findById(Long id);
    List<SubCategory> findAll();
    void deleteById(Long id);
    boolean existsByNameAndCategoryId(String name, Long categoryId);
    List<SubCategory> findByCategoryId(Long categoryId);
}
