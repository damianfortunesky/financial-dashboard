package com.financialdashboard.adapters.input.rest;

import com.financialdashboard.application.dto.income.*;
import com.financialdashboard.domain.port.in.IncomeUseCase;
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
@Tag(name = "Incomes")
public class IncomeController {
    private final IncomeUseCase useCase;

    @GetMapping("/incomes")
    @Operation(summary = "List incomes")
    public List<IncomeResponse> findAll(@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom, @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo) { return useCase.findAll(dateFrom, dateTo); }

    @GetMapping("/incomes/{id}")
    @Operation(summary = "Get Income by id")
    public IncomeResponse findById(@PathVariable Long id) { return useCase.findById(id); }

    @PostMapping("/incomes")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create Income")
    public IncomeResponse create(@Valid @RequestBody CreateIncomeRequest request) { return useCase.create(request); }

    @PutMapping("/incomes/{id}")
    @Operation(summary = "Update Income")
    public IncomeResponse update(@PathVariable Long id, @Valid @RequestBody UpdateIncomeRequest request) { return useCase.update(id, request); }

    @DeleteMapping("/incomes/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete Income")
    public void delete(@PathVariable Long id) { useCase.delete(id); }
}
