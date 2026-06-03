package com.financialdashboard.adapters.input.rest;

import com.financialdashboard.application.dto.purchaseitem.*;
import com.financialdashboard.domain.port.in.PurchaseItemUseCase;
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
@Tag(name = "PurchaseItems")
public class PurchaseItemController {
    private final PurchaseItemUseCase useCase;

    @GetMapping("/purchase-items")
    @Operation(summary = "List purchase-items")
    public List<PurchaseItemResponse> findAll() { return useCase.findAll(); }

    @GetMapping("/purchase-items/{id}")
    @Operation(summary = "Get PurchaseItem by id")
    public PurchaseItemResponse findById(@PathVariable Long id) { return useCase.findById(id); }

    @GetMapping("/purchases/{purchaseId}/items")
    public List<PurchaseItemResponse> findByPurchaseId(@PathVariable Long purchaseId) { return useCase.findByPurchaseId(purchaseId); }

    @PostMapping("/purchase-items")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create PurchaseItem")
    public PurchaseItemResponse create(@Valid @RequestBody CreatePurchaseItemRequest request) { return useCase.create(request); }

    @PutMapping("/purchase-items/{id}")
    @Operation(summary = "Update PurchaseItem")
    public PurchaseItemResponse update(@PathVariable Long id, @Valid @RequestBody UpdatePurchaseItemRequest request) { return useCase.update(id, request); }

    @DeleteMapping("/purchase-items/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete PurchaseItem")
    public void delete(@PathVariable Long id) { useCase.delete(id); }
}
