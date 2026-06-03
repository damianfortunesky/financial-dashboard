package com.financialdashboard.infrastructure.persistence.config;

import com.zaxxer.hikari.HikariDataSource;
import javax.sql.DataSource;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DatasourceConfig {
    @Bean
    @ConfigurationProperties("spring.datasource")
    public DataSource dataSource() {
        return new HikariDataSource();
    }
}
