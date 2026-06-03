package com.financialdashboard.adapters.input.rest;

import com.financialdashboard.application.dto.purchase.*;
import com.financialdashboard.domain.port.in.PurchaseUseCase;
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
@Tag(name = "Purchases")
public class PurchaseController {
    private final PurchaseUseCase useCase;

    @GetMapping("/purchases")
    @Operation(summary = "List purchases")
    public List<PurchaseResponse> findAll(@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom, @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo) { return useCase.findAll(dateFrom, dateTo); }

    @GetMapping("/purchases/{id}")
    @Operation(summary = "Get Purchase by id")
    public PurchaseResponse findById(@PathVariable Long id) { return useCase.findById(id); }

    @PostMapping("/purchases")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create Purchase")
    public PurchaseResponse create(@Valid @RequestBody CreatePurchaseRequest request) { return useCase.create(request); }

    @PutMapping("/purchases/{id}")
    @Operation(summary = "Update Purchase")
    public PurchaseResponse update(@PathVariable Long id, @Valid @RequestBody UpdatePurchaseRequest request) { return useCase.update(id, request); }

    @DeleteMapping("/purchases/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete Purchase")
    public void delete(@PathVariable Long id) { useCase.delete(id); }
}
