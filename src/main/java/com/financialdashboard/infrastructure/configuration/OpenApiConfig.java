package com.financialdashboard.infrastructure.configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {
    @Bean
    public OpenAPI financialDashboardOpenApi() {
        return new OpenAPI().info(new Info()
                .title("Financial Dashboard API")
                .description("API REST para administrar ingresos, gastos, compras, productos y dashboard financiero.")
                .version("v1")
                .contact(new Contact().name("Financial Dashboard")));
    }
}
