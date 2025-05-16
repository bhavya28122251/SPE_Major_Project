package com.healthcare.patient.repository;

import com.healthcare.patient.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PatientRepository extends JpaRepository<Patient, Long> {
    Optional<Patient> findByEmail(String email);
    Optional<Patient> findByUserId(String userId);
    boolean existsByEmail(String email);
} 