package com.financialdashboard.infrastructure.persistence.repository;

import com.financialdashboard.domain.model.Expense;
import com.financialdashboard.domain.port.out.ExpenseRepositoryPort;
import com.financialdashboard.infrastructure.persistence.mapper.ExpenseMapper;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class ExpenseRepositoryAdapter implements ExpenseRepositoryPort {
    private final ExpenseMapper mapper;

    @Override
    public Expense save(Expense entity) { mapper.insert(entity); return entity; }

    @Override
    public void update(Expense entity) { mapper.update(entity); }

    @Override
    public Optional<Expense> findById(Long id) { return mapper.findById(id); }

    @Override
    public List<Expense> findAll(LocalDate dateFrom, LocalDate dateTo, Long categoryId, Long subcategoryId, Long paymentMethodId, Long merchantId, Boolean necessary) {
        return mapper.findAllFiltered(dateFrom, dateTo, categoryId, subcategoryId, paymentMethodId, merchantId, necessary);
    }

    @Override
    public void deleteById(Long id) { mapper.deleteById(id); }

}
