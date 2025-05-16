package com.healthcare.patient.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.validation.constraints.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PatientRequest {
    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String phoneNumber;

    @NotNull
    private LocalDate dateOfBirth;

    @NotBlank
    private String gender;

    @NotBlank
    private String address;

    @NotBlank
    private String medicalHistory;

    @NotBlank
    private String allergies;

    @NotBlank
    private String bloodGroup;

    @NotBlank
    private String emergencyContactName;

    @NotBlank
    private String emergencyContactPhone;
} 