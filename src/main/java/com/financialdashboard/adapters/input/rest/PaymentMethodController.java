package com.financialdashboard.adapters.input.rest;

import com.financialdashboard.application.dto.paymentmethod.*;
import com.financialdashboard.domain.port.in.PaymentMethodUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Tag(name = "PaymentMethods")
public class PaymentMethodController {
    private final PaymentMethodUseCase useCase;

    @GetMapping("/payment-methods")
    @Operation(summary = "List payment-methods")
    public List<PaymentMethodResponse> findAll() { return useCase.findAll(); }

    @GetMapping("/payment-methods/{id}")
    @Operation(summary = "Get PaymentMethod by id")
    public PaymentMethodResponse findById(@PathVariable Long id) { return useCase.findById(id); }

    @PostMapping("/payment-methods")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create PaymentMethod")
    public PaymentMethodResponse create(@Valid @RequestBody CreatePaymentMethodRequest request) { return useCase.create(request); }

    @PutMapping("/payment-methods/{id}")
    @Operation(summary = "Update PaymentMethod")
    public PaymentMethodResponse update(@PathVariable Long id, @Valid @RequestBody UpdatePaymentMethodRequest request) { return useCase.update(id, request); }

    @DeleteMapping("/payment-methods/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete PaymentMethod")
    public void delete(@PathVariable Long id) { useCase.delete(id); }
}
