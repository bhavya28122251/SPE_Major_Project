package com.healthcare.patient.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PatientResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private LocalDate dateOfBirth;
    private String gender;
    private String address;
    private String medicalHistory;
    private String allergies;
    private String bloodGroup;
    private String emergencyContactName;
    private String emergencyContactPhone;
    private String userId;
} 