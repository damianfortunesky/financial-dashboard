package com.financialdashboard.application.usecase;

import com.financialdashboard.application.dto.purchase.*;
import com.financialdashboard.domain.model.Purchase;
import com.financialdashboard.domain.port.in.PurchaseUseCase;
import com.financialdashboard.domain.port.out.*;
import com.financialdashboard.shared.exception.*;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PurchaseService implements PurchaseUseCase {
    private final PurchaseRepositoryPort repository;
    private final MerchantRepositoryPort merchantRepository;
    private final PaymentMethodRepositoryPort paymentMethodRepository;

    @Override
    public PurchaseResponse create(CreatePurchaseRequest request) {
        ensureExists(merchantRepository, request.getMerchantId(), "Merchant");
        ensureExists(paymentMethodRepository, request.getPaymentMethodId(), "Payment Method");
        Purchase entity = Purchase.builder()
                .purchaseDate(request.getPurchaseDate())
                .merchantId(request.getMerchantId())
                .paymentMethodId(request.getPaymentMethodId())
                .totalAmount(request.getTotalAmount())
                .notes(request.getNotes())
                .build();
        return toResponse(repository.save(entity));
    }

    @Override
    public PurchaseResponse update(Long id, UpdatePurchaseRequest request) {
        Purchase current = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Purchase not found"));
        Purchase entity = Purchase.builder()
                .id(id)
                .purchaseDate(request.getPurchaseDate())
                .merchantId(request.getMerchantId())
                .paymentMethodId(request.getPaymentMethodId())
                .totalAmount(request.getTotalAmount())
                .notes(request.getNotes())
                .createdAt(current.getCreatedAt())
                .build();
        repository.update(entity);
        return findById(id);
    }

    @Override
    public PurchaseResponse findById(Long id) {
        return repository.findById(id).map(this::toResponse).orElseThrow(() -> new ResourceNotFoundException("Purchase not found"));
    }

    @Override
    public List<PurchaseResponse> findAll(LocalDate dateFrom, LocalDate dateTo) {
        return repository.findAll(dateFrom, dateTo).stream().map(this::toResponse).toList();
    }

    @Override
    public void delete(Long id) {
        repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Purchase not found"));
        repository.deleteById(id);
    }

    private PurchaseResponse toResponse(Purchase entity) {
        return PurchaseResponse.builder()
                .id(entity.getId())
                .purchaseDate(entity.getPurchaseDate())
                .merchantId(entity.getMerchantId())
                .paymentMethodId(entity.getPaymentMethodId())
                .totalAmount(entity.getTotalAmount())
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
