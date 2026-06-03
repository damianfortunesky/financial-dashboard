package com.financialdashboard.adapters.input.rest;

import com.financialdashboard.application.dto.subcategory.*;
import com.financialdashboard.domain.port.in.SubCategoryUseCase;
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
@Tag(name = "SubCategorys")
public class SubCategoryController {
    private final SubCategoryUseCase useCase;

    @GetMapping("/subcategories")
    @Operation(summary = "List subcategories")
    public List<SubCategoryResponse> findAll() { return useCase.findAll(); }

    @GetMapping("/subcategories/{id}")
    @Operation(summary = "Get SubCategory by id")
    public SubCategoryResponse findById(@PathVariable Long id) { return useCase.findById(id); }

    @GetMapping("/categories/{categoryId}/subcategories")
    public List<SubCategoryResponse> findByCategoryId(@PathVariable Long categoryId) { return useCase.findByCategoryId(categoryId); }

    @PostMapping("/subcategories")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create SubCategory")
    public SubCategoryResponse create(@Valid @RequestBody CreateSubCategoryRequest request) { return useCase.create(request); }

    @PutMapping("/subcategories/{id}")
    @Operation(summary = "Update SubCategory")
    public SubCategoryResponse update(@PathVariable Long id, @Valid @RequestBody UpdateSubCategoryRequest request) { return useCase.update(id, request); }

    @DeleteMapping("/subcategories/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete SubCategory")
    public void delete(@PathVariable Long id) { useCase.delete(id); }
}
