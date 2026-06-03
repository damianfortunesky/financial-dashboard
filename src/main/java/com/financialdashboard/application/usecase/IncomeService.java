package com.financialdashboard.application.usecase;

import com.financialdashboard.application.dto.income.*;
import com.financialdashboard.domain.model.Income;
import com.financialdashboard.domain.port.in.IncomeUseCase;
import com.financialdashboard.domain.port.out.*;
import com.financialdashboard.shared.exception.*;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class IncomeService implements IncomeUseCase {
    private final IncomeRepositoryPort repository;

    @Override
    public IncomeResponse create(CreateIncomeRequest request) {
        Income entity = Income.builder()
                .incomeDate(request.getIncomeDate())
                .amount(request.getAmount())
                .description(request.getDescription())
                .build();
        return toResponse(repository.save(entity));
    }

    @Override
    public IncomeResponse update(Long id, UpdateIncomeRequest request) {
        Income current = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Income not found"));
        Income entity = Income.builder()
                .id(id)
                .incomeDate(request.getIncomeDate())
                .amount(request.getAmount())
                .description(request.getDescription())
                .createdAt(current.getCreatedAt())
                .build();
        repository.update(entity);
        return findById(id);
    }

    @Override
    public IncomeResponse findById(Long id) {
        return repository.findById(id).map(this::toResponse).orElseThrow(() -> new ResourceNotFoundException("Income not found"));
    }

    @Override
    public List<IncomeResponse> findAll(LocalDate dateFrom, LocalDate dateTo) {
        return repository.findAll(dateFrom, dateTo).stream().map(this::toResponse).toList();
    }

    @Override
    public void delete(Long id) {
        repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Income not found"));
        repository.deleteById(id);
    }

    private IncomeResponse toResponse(Income entity) {
        return IncomeResponse.builder()
                .id(entity.getId())
                .incomeDate(entity.getIncomeDate())
                .amount(entity.getAmount())
                .description(entity.getDescription())
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
