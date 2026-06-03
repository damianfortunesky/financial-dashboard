package com.financialdashboard.application.dto.dashboard;

import java.math.BigDecimal;

public record TopMerchantResponse(String merchant, BigDecimal amount) {
}
