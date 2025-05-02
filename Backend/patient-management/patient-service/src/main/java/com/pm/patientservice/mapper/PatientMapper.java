package com.pm.patientservice.mapper;

// We are creating mapper class to map entity to DTO

import com.pm.patientservice.dto.PatientRequestDTO;
import com.pm.patientservice.dto.PatientResponseDTO;
import com.pm.patientservice.model.Patient;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.UUID;

@Component
public class PatientMapper {

    // Convert Patient entity to PatientResponseDTO (used for response)
    public PatientResponseDTO toDTO(Patient patient) {
        // Checking if the patient object is not null to avoid NullPointerException
        if (patient == null) {
            return null;
        }

        PatientResponseDTO patientResponseDTO = new PatientResponseDTO(
                patient.getId().toString(), // Converting UUID to String
                patient.getName(),
                patient.getEmail(),
                patient.getAddress(),
                patient.getPhone(),
                patient.getGender(),
                patient.getAge(),
                patient.getDateOfBirth(),
                patient.getRegisteredDate()
        );

        return patientResponseDTO;
    }

    // Convert PatientRequestDTO (used for request) to Patient entity
    public Patient toModel(PatientRequestDTO dto) {
        return Patient.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .address(dto.getAddress())
                .phone(dto.getPhone())
                .gender(dto.getGender())
                .age(dto.getAge())
                .dateOfBirth(dto.getDateOfBirth())
                .registeredDate(dto.getRegisteredDate())
                // DO NOT set id or version here
                .build();
    }
}