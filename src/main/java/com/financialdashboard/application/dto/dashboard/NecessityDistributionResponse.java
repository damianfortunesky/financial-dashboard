package com.financialdashboard.application.dto.dashboard;

import java.math.BigDecimal;

public record NecessityDistributionResponse(BigDecimal necessary, BigDecimal notNecessary) {
}
