package com.financialdashboard.adapters.input.rest;

import com.financialdashboard.application.dto.product.*;
import com.financialdashboard.domain.port.in.ProductUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Tag(name = "Products")
public class ProductController {
    private final ProductUseCase useCase;

    @GetMapping("/products")
    @Operation(summary = "List products")
    public List<ProductResponse> findAll(@RequestParam(required = false) Boolean active) { return useCase.findAll(active); }

    @GetMapping("/products/{id}")
    @Operation(summary = "Get Product by id")
    public ProductResponse findById(@PathVariable Long id) { return useCase.findById(id); }

    @PostMapping("/products")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create Product")
    public ProductResponse create(@Valid @RequestBody CreateProductRequest request) { return useCase.create(request); }

    @PutMapping("/products/{id}")
    @Operation(summary = "Update Product")
    public ProductResponse update(@PathVariable Long id, @Valid @RequestBody UpdateProductRequest request) { return useCase.update(id, request); }

    @DeleteMapping("/products/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete Product")
    public void delete(@PathVariable Long id) { useCase.delete(id); }
}
