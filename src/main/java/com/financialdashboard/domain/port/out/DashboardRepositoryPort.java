package com.financialdashboard.domain.port.out;

import com.financialdashboard.application.dto.dashboard.*;
import java.math.BigDecimal;
import java.util.List;

public interface DashboardRepositoryPort {
    BigDecimal monthlyIncome();
    BigDecimal monthlyExpense();
    List<CategoryExpenseResponse> expensesByCategory();
    NecessityDistributionResponse necessityDistribution();
    List<MonthlyBalanceResponse> monthlyBalance();
    List<TopMerchantResponse> topMerchants();
    List<CategoryExpenseResponse> topCategories();
    List<TopProductResponse> topProducts();
}
