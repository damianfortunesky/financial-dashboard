package com.financialdashboard.domain.port.in;

import com.financialdashboard.application.dto.subcategory.*;
import java.util.List;

public interface SubCategoryUseCase {
    SubCategoryResponse create(CreateSubCategoryRequest request);
    SubCategoryResponse update(Long id, UpdateSubCategoryRequest request);
    SubCategoryResponse findById(Long id);
    List<SubCategoryResponse> findAll();
    void delete(Long id);
    List<SubCategoryResponse> findByCategoryId(Long categoryId);
}
