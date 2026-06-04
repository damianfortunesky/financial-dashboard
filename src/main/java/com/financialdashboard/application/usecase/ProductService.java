package com.financialdashboard.application.usecase;

import com.financialdashboard.application.dto.product.*;
import com.financialdashboard.domain.model.Product;
import com.financialdashboard.domain.port.in.ProductUseCase;
import com.financialdashboard.domain.port.out.*;
import com.financialdashboard.shared.exception.*;
import java.util.List;
import java.util.Locale;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProductService implements ProductUseCase {
    private final ProductRepositoryPort repository;
    private final CategoryRepositoryPort categoryRepository;
    private final SubCategoryRepositoryPort subCategoryRepository;

    @Override
    public ProductResponse create(CreateProductRequest request) {
        ensureExists(categoryRepository, request.getCategoryId(), "Category");
        if (request.getSubcategoryId() != null) { ensureExists(subCategoryRepository, request.getSubcategoryId(), "SubCategory"); }
        if (repository.existsByName(request.getName())) { throw new DuplicateResourceException("Product already exists"); }
        Product entity = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .unitOfMeasure(normalizeUnitOfMeasure(request.getUnitOfMeasure()))
                .categoryId(request.getCategoryId())
                .subcategoryId(request.getSubcategoryId())
                .active(true)
                .build();
        return toResponse(repository.save(entity));
    }

    @Override
    public ProductResponse update(Long id, UpdateProductRequest request) {
        Product current = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        Product entity = Product.builder()
                .id(id)
                .name(request.getName())
                .description(request.getDescription())
                .unitOfMeasure(normalizeUnitOfMeasure(request.getUnitOfMeasure()))
                .categoryId(request.getCategoryId())
                .subcategoryId(request.getSubcategoryId())
                .active(request.getActive() != null ? request.getActive() : current.getActive())
                .createdAt(current.getCreatedAt())
                .build();
        repository.update(entity);
        return findById(id);
    }

    @Override
    public ProductResponse findById(Long id) {
        return repository.findById(id).map(this::toResponse).orElseThrow(() -> new ResourceNotFoundException("Product not found"));
    }

    @Override
    public List<ProductResponse> findAll() {
        return repository.findAll().stream().map(this::toResponse).toList();
    }

    @Override
    public void delete(Long id) {
        repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        repository.deleteById(id);
    }

    private String normalizeUnitOfMeasure(String unitOfMeasure) {
        return unitOfMeasure == null ? null : unitOfMeasure.trim().toUpperCase(Locale.ROOT);
    }

    private ProductResponse toResponse(Product entity) {
        return ProductResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .unitOfMeasure(entity.getUnitOfMeasure())
                .categoryId(entity.getCategoryId())
                .subcategoryId(entity.getSubcategoryId())
                .active(entity.getActive())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    private void ensureExists(com.financialdashboard.domain.port.out.CategoryRepositoryPort port, Long id, String label) { if (id != null && port.findById(id).isEmpty()) throw new ResourceNotFoundException(label + " not found"); }
    private void ensureExists(com.financialdashboard.domain.port.out.SubCategoryRepositoryPort port, Long id, String label) { if (id != null && port.findById(id).isEmpty()) throw new ResourceNotFoundException(label + " not found"); }
    private void ensureExists(com.financialdashboard.domain.port.out.PaymentMethodRepositoryPort port, Long id, String label) { if (id != null && port.findById(id).isEmpty()) throw new ResourceNotFoundException(label + " not found"); }
    private void ensureExists(com.financialdashboard.domain.port.out.MerchantRepositoryPort port, Long id, String label) { if (id != null && port.findById(id).isEmpty()) throw new ResourceNotFoundException(label + " not found"); }
    private void ensureExists(com.financialdashboard.domain.port.out.PurchaseRepositoryPort port, Long id, String label) { if (id != null && port.findById(id).isEmpty()) throw new ResourceNotFoundException(label + " not found"); }
    private void ensureExists(com.financialdashboard.domain.port.out.ProductRepositoryPort port, Long id, String label) { if (id != null && port.findById(id).isEmpty()) throw new ResourceNotFoundException(label + " not found"); }

}
