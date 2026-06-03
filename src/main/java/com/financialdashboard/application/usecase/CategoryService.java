package com.financialdashboard.application.usecase;

import com.financialdashboard.application.dto.category.*;
import com.financialdashboard.domain.model.Category;
import com.financialdashboard.domain.port.in.CategoryUseCase;
import com.financialdashboard.domain.port.out.*;
import com.financialdashboard.shared.exception.*;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CategoryService implements CategoryUseCase {
    private final CategoryRepositoryPort repository;

    @Override
    public CategoryResponse create(CreateCategoryRequest request) {
        if (repository.existsByName(request.getName())) { throw new DuplicateResourceException("Category already exists"); }
        Category entity = Category.builder()
                .name(request.getName())
                .description(request.getDescription())
                .active(true)
                .build();
        return toResponse(repository.save(entity));
    }

    @Override
    public CategoryResponse update(Long id, UpdateCategoryRequest request) {
        Category current = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        Category entity = Category.builder()
                .id(id)
                .name(request.getName())
                .description(request.getDescription())
                .active(request.getActive() != null ? request.getActive() : current.getActive())
                .createdAt(current.getCreatedAt())
                .build();
        repository.update(entity);
        return findById(id);
    }

    @Override
    public CategoryResponse findById(Long id) {
        return repository.findById(id).map(this::toResponse).orElseThrow(() -> new ResourceNotFoundException("Category not found"));
    }

    @Override
    public List<CategoryResponse> findAll() {
        return repository.findAll().stream().map(this::toResponse).toList();
    }

    @Override
    public void delete(Long id) {
        repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        repository.deleteById(id);
    }

    private CategoryResponse toResponse(Category entity) {
        return CategoryResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
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
