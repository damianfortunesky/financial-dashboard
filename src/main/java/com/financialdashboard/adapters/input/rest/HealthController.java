package com.financialdashboard.adapters.input.rest;

import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.Map;
import javax.sql.DataSource;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Tag(name = "Health")
public class HealthController {
    private final DataSource dataSource;

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "UP");
    }

    @GetMapping("/health/db")
    public Map<String, Object> dbHealth() {
        Integer result = new JdbcTemplate(dataSource).queryForObject("SELECT 1", Integer.class);
        return Map.of("status", "UP", "validation", result == null ? 0 : result);
    }
}
