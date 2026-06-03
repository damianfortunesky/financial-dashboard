package com.financialdashboard.adapters.input.rest;

import com.financialdashboard.application.dto.category.*;
import com.financialdashboard.domain.port.in.CategoryUseCase;
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
@Tag(name = "Categorys")
public class CategoryController {
    private final CategoryUseCase useCase;

    @GetMapping("/categories")
    @Operation(summary = "List categories")
    public List<CategoryResponse> findAll() { return useCase.findAll(); }

    @GetMapping("/categories/{id}")
    @Operation(summary = "Get Category by id")
    public CategoryResponse findById(@PathVariable Long id) { return useCase.findById(id); }

    @PostMapping("/categories")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create Category")
    public CategoryResponse create(@Valid @RequestBody CreateCategoryRequest request) { return useCase.create(request); }

    @PutMapping("/categories/{id}")
    @Operation(summary = "Update Category")
    public CategoryResponse update(@PathVariable Long id, @Valid @RequestBody UpdateCategoryRequest request) { return useCase.update(id, request); }

    @DeleteMapping("/categories/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete Category")
    public void delete(@PathVariable Long id) { useCase.delete(id); }
}
