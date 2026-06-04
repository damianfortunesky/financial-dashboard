package com.financialdashboard.domain.port.out;

import com.financialdashboard.domain.model.Merchant;
import java.util.List;
import java.util.Optional;

public interface MerchantRepositoryPort {
    Merchant save(Merchant entity);
    void update(Merchant entity);
    Optional<Merchant> findById(Long id);
    List<Merchant> findAll();
    void deleteById(Long id);
    boolean existsByName(String name);
}
