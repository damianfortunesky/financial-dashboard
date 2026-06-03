package com.financialdashboard.adapters.input.rest;

import com.financialdashboard.application.dto.merchant.*;
import com.financialdashboard.domain.port.in.MerchantUseCase;
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
@Tag(name = "Merchants")
public class MerchantController {
    private final MerchantUseCase useCase;

    @GetMapping("/merchants")
    @Operation(summary = "List merchants")
    public List<MerchantResponse> findAll() { return useCase.findAll(); }

    @GetMapping("/merchants/{id}")
    @Operation(summary = "Get Merchant by id")
    public MerchantResponse findById(@PathVariable Long id) { return useCase.findById(id); }

    @PostMapping("/merchants")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create Merchant")
    public MerchantResponse create(@Valid @RequestBody CreateMerchantRequest request) { return useCase.create(request); }

    @PutMapping("/merchants/{id}")
    @Operation(summary = "Update Merchant")
    public MerchantResponse update(@PathVariable Long id, @Valid @RequestBody UpdateMerchantRequest request) { return useCase.update(id, request); }

    @DeleteMapping("/merchants/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete Merchant")
    public void delete(@PathVariable Long id) { useCase.delete(id); }
}
