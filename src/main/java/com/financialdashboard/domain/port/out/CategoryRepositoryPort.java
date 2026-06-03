package com.financialdashboard.domain.port.out;

import com.financialdashboard.domain.model.Category;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface CategoryRepositoryPort {
    Category save(Category entity);
    void update(Category entity);
    Optional<Category> findById(Long id);
    List<Category> findAll();
    void deleteById(Long id);
    boolean existsByName(String name);
}
