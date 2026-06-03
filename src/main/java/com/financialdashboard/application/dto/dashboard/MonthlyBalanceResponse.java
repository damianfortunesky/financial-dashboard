package com.financialdashboard.application.dto.dashboard;

import java.math.BigDecimal;

public record MonthlyBalanceResponse(Integer year, Integer month, BigDecimal income, BigDecimal expense, BigDecimal balance) {
}
