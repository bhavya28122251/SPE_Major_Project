package com.healthcare.doctor.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.util.Set;

@Data
public class DoctorRequest {
    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Phone number is required")
    private String phoneNumber;

    @NotBlank(message = "User ID is required")
    private String userId;

    @NotBlank(message = "Bio is required")
    private String bio;

    @NotBlank(message = "License number is required")
    private String licenseNumber;

    @NotNull(message = "Years of experience is required")
    @Positive(message = "Years of experience must be positive")
    private Integer yearsOfExperience;

    @NotNull(message = "At least one specialty is required")
    private Set<Long> specialtyIds;

    @NotBlank(message = "Specialization is required")
    private String specialization;

    @NotNull(message = "Specialties are required")
    private Set<String> specialties;

    @NotBlank(message = "Qualification is required")
    private String qualification;

    @NotNull(message = "Experience is required")
    @Min(value = 0, message = "Experience must be a positive number")
    private Integer experience;

    @NotBlank(message = "Availability is required")
    private String availability;
} 