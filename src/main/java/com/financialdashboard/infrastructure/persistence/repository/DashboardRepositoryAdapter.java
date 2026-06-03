package com.financialdashboard.infrastructure.persistence.repository;

import com.financialdashboard.application.dto.dashboard.*;
import com.financialdashboard.domain.port.out.DashboardRepositoryPort;
import com.financialdashboard.infrastructure.persistence.mapper.DashboardMapper;
import java.math.BigDecimal;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class DashboardRepositoryAdapter implements DashboardRepositoryPort {
    private final DashboardMapper mapper;
    public BigDecimal monthlyIncome() { return mapper.monthlyIncome(); }
    public BigDecimal monthlyExpense() { return mapper.monthlyExpense(); }
    public List<CategoryExpenseResponse> expensesByCategory() { return mapper.expensesByCategory(); }
    public NecessityDistributionResponse necessityDistribution() { return mapper.necessityDistribution(); }
    public List<MonthlyBalanceResponse> monthlyBalance() { return mapper.monthlyBalance(); }
    public List<TopMerchantResponse> topMerchants() { return mapper.topMerchants(); }
    public List<CategoryExpenseResponse> topCategories() { return mapper.topCategories(); }
    public List<TopProductResponse> topProducts() { return mapper.topProducts(); }
}
