package com.healthcare.doctor.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SpecialtyRequest {
    @NotBlank(message = "Specialty name is required")
    private String name;
    private String description;
} 