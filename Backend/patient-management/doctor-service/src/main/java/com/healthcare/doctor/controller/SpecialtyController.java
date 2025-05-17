package com.healthcare.doctor.controller;

import com.healthcare.doctor.dto.SpecialtyRequest;
import com.healthcare.doctor.dto.SpecialtyResponse;
import com.healthcare.doctor.service.SpecialtyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/specialties")
@RequiredArgsConstructor
@Tag(name = "Specialty", description = "Specialty management APIs")
public class SpecialtyController {

    private final SpecialtyService specialtyService;

    @PostMapping
    @Operation(summary = "Create a new specialty", description = "Create a new medical specialty")
    public ResponseEntity<SpecialtyResponse> createSpecialty(@Valid @RequestBody SpecialtyRequest request) {
        return ResponseEntity.ok(specialtyService.createSpecialty(request));
    }

    @GetMapping
    @Operation(summary = "Get all specialties", description = "Retrieve all medical specialties")
    public ResponseEntity<List<SpecialtyResponse>> getAllSpecialties() {
        return ResponseEntity.ok(specialtyService.getAllSpecialties());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get specialty by ID", description = "Retrieve a medical specialty by ID")
    public ResponseEntity<SpecialtyResponse> getSpecialtyById(@PathVariable Long id) {
        return ResponseEntity.ok(specialtyService.getSpecialtyById(id));
    }

    @GetMapping("/name/{name}")
    @Operation(summary = "Get specialty by name", description = "Retrieve a medical specialty by name")
    public ResponseEntity<SpecialtyResponse> getSpecialtyByName(@PathVariable String name) {
        return ResponseEntity.ok(specialtyService.getSpecialtyByName(name));
    }
} 