package com.financialdashboard.adapters.input.rest;

import com.financialdashboard.application.dto.expense.*;
import com.financialdashboard.domain.port.in.ExpenseUseCase;
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
@Tag(name = "Expenses")
public class ExpenseController {
    private final ExpenseUseCase useCase;

    @GetMapping("/expenses")
    @Operation(summary = "List expenses")
    public List<ExpenseResponse> findAll(@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom, @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo, @RequestParam(required = false) Long categoryId, @RequestParam(required = false) Long subcategoryId, @RequestParam(required = false) Long paymentMethodId, @RequestParam(required = false) Long merchantId, @RequestParam(required = false) Boolean necessary) { return useCase.findAll(dateFrom, dateTo, categoryId, subcategoryId, paymentMethodId, merchantId, necessary); }

    @GetMapping("/expenses/{id}")
    @Operation(summary = "Get Expense by id")
    public ExpenseResponse findById(@PathVariable Long id) { return useCase.findById(id); }

    @PostMapping("/expenses")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create Expense")
    public ExpenseResponse create(@Valid @RequestBody CreateExpenseRequest request) { return useCase.create(request); }

    @PutMapping("/expenses/{id}")
    @Operation(summary = "Update Expense")
    public ExpenseResponse update(@PathVariable Long id, @Valid @RequestBody UpdateExpenseRequest request) { return useCase.update(id, request); }

    @DeleteMapping("/expenses/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete Expense")
    public void delete(@PathVariable Long id) { useCase.delete(id); }
}
