package com.pm.patientservice.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatientRequestDTO {

    @NotNull(message = "Name is required")
    @NotBlank(message = "Name cannot be empty")
    private String name;

    @NotNull(message = "Email is required")
    @Email(message = "Please provide a valid email address")
    private String email;

    @NotNull(message = "Address is required")
    @NotBlank(message = "Address cannot be empty")
    private String address;

    @NotNull(message = "Phone number is required")
    @Pattern(regexp = "^(\\+\\d{1,3}[- ]?)?\\d{10}$", message = "Please provide a valid phone number")
    private String phone;

    @NotNull(message = "Gender is required")
    @NotBlank(message = "Gender cannot be empty")
    private String gender;

    @NotNull(message = "Age is required")
    private int age;

    @NotNull(message = "Date of Birth is required")
    private LocalDate dateOfBirth;

    @NotNull(message = "Registered Date is required")
    private LocalDate registeredDate;

}
