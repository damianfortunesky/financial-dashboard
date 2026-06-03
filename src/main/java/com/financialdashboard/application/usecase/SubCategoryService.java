package com.financialdashboard.application.usecase;

import com.financialdashboard.application.dto.subcategory.*;
import com.financialdashboard.domain.model.SubCategory;
import com.financialdashboard.domain.port.in.SubCategoryUseCase;
import com.financialdashboard.domain.port.out.*;
import com.financialdashboard.shared.exception.*;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SubCategoryService implements SubCategoryUseCase {
    private final SubCategoryRepositoryPort repository;
    private final CategoryRepositoryPort categoryRepository;

    @Override
    public SubCategoryResponse create(CreateSubCategoryRequest request) {
        ensureExists(categoryRepository, request.getCategoryId(), "Category");
        if (repository.existsByNameAndCategoryId(request.getName(), request.getCategoryId())) { throw new DuplicateResourceException("SubCategory already exists for category"); }
        SubCategory entity = SubCategory.builder()
                .categoryId(request.getCategoryId())
                .name(request.getName())
                .description(request.getDescription())
                .active(true)
                .build();
        return toResponse(repository.save(entity));
    }

    @Override
    public SubCategoryResponse update(Long id, UpdateSubCategoryRequest request) {
        SubCategory current = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("SubCategory not found"));
        SubCategory entity = SubCategory.builder()
                .id(id)
                .categoryId(request.getCategoryId())
                .name(request.getName())
                .description(request.getDescription())
                .active(request.getActive() != null ? request.getActive() : current.getActive())
                .createdAt(current.getCreatedAt())
                .build();
        repository.update(entity);
        return findById(id);
    }

    @Override
    public SubCategoryResponse findById(Long id) {
        return repository.findById(id).map(this::toResponse).orElseThrow(() -> new ResourceNotFoundException("SubCategory not found"));
    }

    @Override
    public List<SubCategoryResponse> findAll() {
        return repository.findAll().stream().map(this::toResponse).toList();
    }

    @Override
    public void delete(Long id) {
        repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("SubCategory not found"));
        repository.deleteById(id);
    }

    @Override
    public List<SubCategoryResponse> findByCategoryId(Long categoryId) {
        ensureExists(categoryRepository, categoryId, "Category");
        return repository.findByCategoryId(categoryId).stream().map(this::toResponse).toList();
    }

    private SubCategoryResponse toResponse(SubCategory entity) {
        return SubCategoryResponse.builder()
                .id(entity.getId())
                .categoryId(entity.getCategoryId())
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
