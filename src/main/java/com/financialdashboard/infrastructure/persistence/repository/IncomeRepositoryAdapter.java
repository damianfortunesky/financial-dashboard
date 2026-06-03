package com.financialdashboard.infrastructure.persistence.repository;

import com.financialdashboard.domain.model.Income;
import com.financialdashboard.domain.port.out.IncomeRepositoryPort;
import com.financialdashboard.infrastructure.persistence.mapper.IncomeMapper;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class IncomeRepositoryAdapter implements IncomeRepositoryPort {
    private final IncomeMapper mapper;

    @Override
    public Income save(Income entity) { mapper.insert(entity); return entity; }

    @Override
    public void update(Income entity) { mapper.update(entity); }

    @Override
    public Optional<Income> findById(Long id) { return mapper.findById(id); }

    @Override
    public List<Income> findAll(LocalDate dateFrom, LocalDate dateTo) { return mapper.findAllFiltered(dateFrom, dateTo); }

    @Override
    public void deleteById(Long id) { mapper.deleteById(id); }

}
