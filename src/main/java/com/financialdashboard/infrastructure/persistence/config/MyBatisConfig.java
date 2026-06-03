package com.financialdashboard.infrastructure.persistence.config;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@MapperScan("com.financialdashboard.infrastructure.persistence.mapper")
public class MyBatisConfig {
}
