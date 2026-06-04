package com.financialdashboard.domain.port.out;

import com.financialdashboard.domain.model.Product;
import java.util.List;
import java.util.Optional;

public interface ProductRepositoryPort {
    Product save(Product entity);
    void update(Product entity);
    Optional<Product> findById(Long id);
    List<Product> findAll();
    void deleteById(Long id);
    boolean existsByName(String name);
}
