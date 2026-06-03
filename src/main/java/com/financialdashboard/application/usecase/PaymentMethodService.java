package com.financialdashboard.application.usecase;

import com.financialdashboard.application.dto.paymentmethod.*;
import com.financialdashboard.domain.model.PaymentMethod;
import com.financialdashboard.domain.port.in.PaymentMethodUseCase;
import com.financialdashboard.domain.port.out.*;
import com.financialdashboard.shared.exception.*;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PaymentMethodService implements PaymentMethodUseCase {
    private final PaymentMethodRepositoryPort repository;

    @Override
    public PaymentMethodResponse create(CreatePaymentMethodRequest request) {
        if (repository.existsByName(request.getName())) { throw new DuplicateResourceException("PaymentMethod already exists"); }
        PaymentMethod entity = PaymentMethod.builder()
                .name(request.getName())
                .description(request.getDescription())
                .active(true)
                .build();
        return toResponse(repository.save(entity));
    }

    @Override
    public PaymentMethodResponse update(Long id, UpdatePaymentMethodRequest request) {
        PaymentMethod current = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("PaymentMethod not found"));
        PaymentMethod entity = PaymentMethod.builder()
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
    public PaymentMethodResponse findById(Long id) {
        return repository.findById(id).map(this::toResponse).orElseThrow(() -> new ResourceNotFoundException("PaymentMethod not found"));
    }

    @Override
    public List<PaymentMethodResponse> findAll() {
        return repository.findAll().stream().map(this::toResponse).toList();
    }

    @Override
    public void delete(Long id) {
        repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("PaymentMethod not found"));
        repository.deleteById(id);
    }

    private PaymentMethodResponse toResponse(PaymentMethod entity) {
        return PaymentMethodResponse.builder()
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
