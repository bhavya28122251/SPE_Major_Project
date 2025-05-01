package com.pm.patientservice.service;

import com.pm.patientservice.dto.PatientRequestDTO;
import com.pm.patientservice.dto.PatientResponseDTO;
import com.pm.patientservice.exception.EmailAlreadyExistsException;
import com.pm.patientservice.exception.PatientNotFounException;
import com.pm.patientservice.grpc.BillingServiceGrpcClient;
import com.pm.patientservice.mapper.PatientMapper;
import com.pm.patientservice.model.Patient;
import com.pm.patientservice.repository.PatientRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface PatientService {

    PatientResponseDTO createPatient(PatientRequestDTO dto);

    PatientResponseDTO getPatientById(UUID id);

    List<PatientResponseDTO> getAllPatients();

    PatientResponseDTO updatePatient(UUID id, PatientRequestDTO dto);

    void deletePatient(UUID id);
}