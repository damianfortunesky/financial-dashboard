package com.financialdashboard.application.usecase;

import com.financialdashboard.application.dto.purchaseitem.*;
import com.financialdashboard.domain.model.PurchaseItem;
import com.financialdashboard.domain.port.in.PurchaseItemUseCase;
import com.financialdashboard.domain.port.out.*;
import com.financialdashboard.shared.exception.*;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PurchaseItemService implements PurchaseItemUseCase {
    private final PurchaseItemRepositoryPort repository;
    private final PurchaseRepositoryPort purchaseRepository;
    private final ProductRepositoryPort productRepository;

    @Override
    public PurchaseItemResponse create(CreatePurchaseItemRequest request) {
        ensureExists(purchaseRepository, request.getPurchaseId(), "Purchase");
        validateActiveProduct(request.getProductId());
        PurchaseItem entity = PurchaseItem.builder()
                .purchaseId(request.getPurchaseId())
                .productId(request.getProductId())
                .quantity(request.getQuantity())
                .unitPrice(request.getUnitPrice())
                .subtotal(request.getQuantity().multiply(request.getUnitPrice()))
                .notes(request.getNotes())
                .build();
        return toResponse(repository.save(entity));
    }

    @Override
    public PurchaseItemResponse update(Long id, UpdatePurchaseItemRequest request) {
        PurchaseItem current = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("PurchaseItem not found"));
        validateActiveProduct(request.getProductId());
        PurchaseItem entity = PurchaseItem.builder()
                .id(id)
                .purchaseId(current.getPurchaseId())
                .productId(request.getProductId())
                .quantity(request.getQuantity())
                .unitPrice(request.getUnitPrice())
                .subtotal(request.getQuantity().multiply(request.getUnitPrice()))
                .notes(request.getNotes())
                .createdAt(current.getCreatedAt())
                .build();
        repository.update(entity);
        return findById(id);
    }

    @Override
    public PurchaseItemResponse findById(Long id) {
        return repository.findById(id).map(this::toResponse).orElseThrow(() -> new ResourceNotFoundException("PurchaseItem not found"));
    }

    @Override
    public List<PurchaseItemResponse> findAll() {
        return repository.findAll().stream().map(this::toResponse).toList();
    }

    @Override
    public void delete(Long id) {
        repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("PurchaseItem not found"));
        repository.deleteById(id);
    }

    @Override
    public List<PurchaseItemResponse> findByPurchaseId(Long purchaseId) {
        ensureExists(purchaseRepository, purchaseId, "Purchase");
        return repository.findByPurchaseId(purchaseId).stream().map(this::toResponse).toList();
    }

    private void validateActiveProduct(Long productId) {
        var product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        if (!Boolean.TRUE.equals(product.getActive())) {
            throw new BusinessException("Product is inactive");
        }
    }

    private PurchaseItemResponse toResponse(PurchaseItem entity) {
        return PurchaseItemResponse.builder()
                .id(entity.getId())
                .purchaseId(entity.getPurchaseId())
                .productId(entity.getProductId())
                .quantity(entity.getQuantity())
                .unitPrice(entity.getUnitPrice())
                .subtotal(entity.getSubtotal())
                .notes(entity.getNotes())
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
