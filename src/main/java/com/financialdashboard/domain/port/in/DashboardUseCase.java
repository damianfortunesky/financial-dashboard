package com.financialdashboard.domain.port.in;

import com.financialdashboard.application.dto.dashboard.*;
import java.util.List;

public interface DashboardUseCase {
    SummaryResponse summary();
    List<CategoryExpenseResponse> expensesByCategory();
    NecessityDistributionResponse necessityDistribution();
    List<MonthlyBalanceResponse> monthlyBalance();
    List<TopMerchantResponse> topMerchants();
    List<CategoryExpenseResponse> topCategories();
    List<TopProductResponse> topProducts();
}
