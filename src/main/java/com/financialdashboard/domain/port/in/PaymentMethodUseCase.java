package com.financialdashboard.domain.port.in;

import com.financialdashboard.application.dto.paymentmethod.*;
import java.util.List;

public interface PaymentMethodUseCase {
    PaymentMethodResponse create(CreatePaymentMethodRequest request);
    PaymentMethodResponse update(Long id, UpdatePaymentMethodRequest request);
    PaymentMethodResponse findById(Long id);
    List<PaymentMethodResponse> findAll();
    void delete(Long id);
}
