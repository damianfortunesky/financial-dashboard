package com.financialdashboard.application.usecase;

import com.financialdashboard.application.dto.expense.*;
import com.financialdashboard.domain.model.Expense;
import com.financialdashboard.domain.port.in.ExpenseUseCase;
import com.financialdashboard.domain.port.out.*;
import com.financialdashboard.shared.exception.*;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ExpenseService implements ExpenseUseCase {
    private final ExpenseRepositoryPort repository;
    private final CategoryRepositoryPort categoryRepository;
    private final SubCategoryRepositoryPort subCategoryRepository;
    private final PaymentMethodRepositoryPort paymentMethodRepository;
    private final MerchantRepositoryPort merchantRepository;

    @Override
    public ExpenseResponse create(CreateExpenseRequest request) {
        validateExpenseRefs(request.getCategoryId(), request.getSubcategoryId(), request.getPaymentMethodId(), request.getMerchantId());
        Expense entity = Expense.builder()
                .expenseDate(request.getExpenseDate())
                .amount(request.getAmount())
                .categoryId(request.getCategoryId())
                .subcategoryId(request.getSubcategoryId())
                .paymentMethodId(request.getPaymentMethodId())
                .merchantId(request.getMerchantId())
                .necessary(request.getNecessary())
                .description(request.getDescription())
                .build();
        return toResponse(repository.save(entity));
    }

    @Override
    public ExpenseResponse update(Long id, UpdateExpenseRequest request) {
        Expense current = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Expense not found"));
        Expense entity = Expense.builder()
                .id(id)
                .expenseDate(request.getExpenseDate())
                .amount(request.getAmount())
                .categoryId(request.getCategoryId())
                .subcategoryId(request.getSubcategoryId())
                .paymentMethodId(request.getPaymentMethodId())
                .merchantId(request.getMerchantId())
                .necessary(request.getNecessary())
                .description(request.getDescription())
                .createdAt(current.getCreatedAt())
                .build();
        repository.update(entity);
        return findById(id);
    }

    @Override
    public ExpenseResponse findById(Long id) {
        return repository.findById(id).map(this::toResponse).orElseThrow(() -> new ResourceNotFoundException("Expense not found"));
    }

    @Override
    public List<ExpenseResponse> findAll(LocalDate dateFrom, LocalDate dateTo, Long categoryId, Long subcategoryId, Long paymentMethodId, Long merchantId, Boolean necessary) {
        return repository.findAll(dateFrom, dateTo, categoryId, subcategoryId, paymentMethodId, merchantId, necessary).stream().map(this::toResponse).toList();
    }

    @Override
    public void delete(Long id) {
        repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Expense not found"));
        repository.deleteById(id);
    }

    private ExpenseResponse toResponse(Expense entity) {
        return ExpenseResponse.builder()
                .id(entity.getId())
                .expenseDate(entity.getExpenseDate())
                .amount(entity.getAmount())
                .categoryId(entity.getCategoryId())
                .subcategoryId(entity.getSubcategoryId())
                .paymentMethodId(entity.getPaymentMethodId())
                .merchantId(entity.getMerchantId())
                .necessary(entity.getNecessary())
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

    private void validateExpenseRefs(Long categoryId, Long subcategoryId, Long paymentMethodId, Long merchantId) {
        ensureExists(categoryRepository, categoryId, "Category");
        ensureExists(paymentMethodRepository, paymentMethodId, "Payment Method");
        if (subcategoryId != null) {
            var subcategory = subCategoryRepository.findById(subcategoryId).orElseThrow(() -> new ResourceNotFoundException("SubCategory not found"));
            if (!subcategory.getCategoryId().equals(categoryId)) { throw new BusinessException("SubCategory does not belong to selected category"); }
        }
        if (merchantId != null) { ensureExists(merchantRepository, merchantId, "Merchant"); }
    }

}
