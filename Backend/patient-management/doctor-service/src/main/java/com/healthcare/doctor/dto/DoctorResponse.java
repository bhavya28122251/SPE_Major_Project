package com.healthcare.doctor.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DoctorResponse {
    private Long id;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String bio;
    private String licenseNumber;
    private Integer yearsOfExperience;
    private Set<SpecialtyResponse> specialties;
} 