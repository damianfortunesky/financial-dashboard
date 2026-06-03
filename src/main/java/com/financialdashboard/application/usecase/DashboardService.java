package com.financialdashboard.application.usecase;

import com.financialdashboard.application.dto.dashboard.*;
import com.financialdashboard.domain.port.in.DashboardUseCase;
import com.financialdashboard.domain.port.out.DashboardRepositoryPort;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardService implements DashboardUseCase {
    private final DashboardRepositoryPort repository;

    public SummaryResponse summary() {
        BigDecimal income = zero(repository.monthlyIncome());
        BigDecimal expense = zero(repository.monthlyExpense());
        BigDecimal balance = income.subtract(expense);
        BigDecimal savingRate = income.signum() == 0 ? BigDecimal.ZERO : balance.multiply(BigDecimal.valueOf(100)).divide(income, 2, RoundingMode.HALF_UP);
        BigDecimal expenseRatio = income.signum() == 0 ? BigDecimal.ZERO : expense.multiply(BigDecimal.valueOf(100)).divide(income, 2, RoundingMode.HALF_UP);
        return new SummaryResponse(income, expense, balance, savingRate, expenseRatio);
    }

    public List<CategoryExpenseResponse> expensesByCategory() { return repository.expensesByCategory(); }
    public NecessityDistributionResponse necessityDistribution() { return repository.necessityDistribution(); }
    public List<MonthlyBalanceResponse> monthlyBalance() { return repository.monthlyBalance(); }
    public List<TopMerchantResponse> topMerchants() { return repository.topMerchants(); }
    public List<CategoryExpenseResponse> topCategories() { return repository.topCategories(); }
    public List<TopProductResponse> topProducts() { return repository.topProducts(); }

    private BigDecimal zero(BigDecimal value) { return value == null ? BigDecimal.ZERO : value; }
}
