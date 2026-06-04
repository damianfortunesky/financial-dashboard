package com.financialdashboard.domain.port.in;

import com.financialdashboard.application.dto.merchant.*;
import java.util.List;

public interface MerchantUseCase {
    MerchantResponse create(CreateMerchantRequest request);
    MerchantResponse update(Long id, UpdateMerchantRequest request);
    MerchantResponse findById(Long id);
    List<MerchantResponse> findAll();
    void delete(Long id);
}
