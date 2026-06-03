package com.financialdashboard.adapters.input.rest;

import com.financialdashboard.application.dto.dashboard.*;
import com.financialdashboard.domain.port.in.DashboardUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard")
public class DashboardController {
    private final DashboardUseCase useCase;

    @GetMapping("/summary")
    @Operation(summary = "Financial dashboard summary")
    public SummaryResponse summary() { return useCase.summary(); }

    @GetMapping("/expenses-by-category")
    public List<CategoryExpenseResponse> expensesByCategory() { return useCase.expensesByCategory(); }

    @GetMapping("/necessity-distribution")
    public NecessityDistributionResponse necessityDistribution() { return useCase.necessityDistribution(); }

    @GetMapping("/monthly-balance")
    public List<MonthlyBalanceResponse> monthlyBalance() { return useCase.monthlyBalance(); }

    @GetMapping("/top-merchants")
    public List<TopMerchantResponse> topMerchants() { return useCase.topMerchants(); }

    @GetMapping("/top-categories")
    public List<CategoryExpenseResponse> topCategories() { return useCase.topCategories(); }

    @GetMapping("/top-products")
    public List<TopProductResponse> topProducts() { return useCase.topProducts(); }
}
