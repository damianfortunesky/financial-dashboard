package com.financialdashboard.domain.port.in;

import com.financialdashboard.application.dto.category.*;
import java.util.List;

public interface CategoryUseCase {
    CategoryResponse create(CreateCategoryRequest request);
    CategoryResponse update(Long id, UpdateCategoryRequest request);
    CategoryResponse findById(Long id);
    List<CategoryResponse> findAll();
    void delete(Long id);
}
