package com.financialdashboard.domain.port.in;

import com.financialdashboard.application.dto.product.*;
import java.util.List;

public interface ProductUseCase {
    ProductResponse create(CreateProductRequest request);
    ProductResponse update(Long id, UpdateProductRequest request);
    ProductResponse findById(Long id);
    List<ProductResponse> findAll(Boolean active);
    void delete(Long id);
}
