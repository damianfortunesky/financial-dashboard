package com.financialdashboard.domain.port.in;

import com.financialdashboard.application.dto.product.*;
import java.time.LocalDate;
import java.util.List;

public interface ProductUseCase {
    ProductResponse create(CreateProductRequest request);
    ProductResponse update(Long id, UpdateProductRequest request);
    ProductResponse findById(Long id);
    List<ProductResponse> findAll();
    void delete(Long id);
}
