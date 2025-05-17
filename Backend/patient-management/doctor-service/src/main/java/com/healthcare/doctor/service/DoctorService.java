package com.healthcare.doctor.service;

import com.healthcare.doctor.dto.DoctorRequest;
import com.healthcare.doctor.dto.DoctorResponse;
import com.healthcare.doctor.dto.SpecialtyResponse;
import com.healthcare.doctor.entity.Doctor;
import com.healthcare.doctor.entity.Specialty;
import com.healthcare.doctor.repository.DoctorRepository;
import com.healthcare.doctor.repository.SpecialtyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final SpecialtyRepository specialtyRepository;

    @Transactional
    public DoctorResponse createDoctor(DoctorRequest request) {
        if (doctorRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already in use!");
        }

        Doctor doctor = new Doctor();
        updateDoctorFromRequest(doctor, request);
        doctor.setUserId(request.getUserId());

        return mapToResponse(doctorRepository.save(doctor));
    }

    @Transactional(readOnly = true)
    public DoctorResponse getDoctorById(Long id) {
        return doctorRepository.findById(id)
                .map(this::mapToResponse)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
    }

    @Transactional(readOnly = true)
    public DoctorResponse getDoctorByUserId(String userId) {
        return doctorRepository.findByUserId(userId)
                .map(this::mapToResponse)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
    }

    @Transactional(readOnly = true)
    public boolean existsById(Long id) {
        return doctorRepository.existsById(id);
    }

    @Transactional(readOnly = true)
    public List<DoctorResponse> getAllDoctors() {
        return doctorRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<DoctorResponse> getDoctorsBySpecialty(Long specialtyId) {
        // First verify that the specialty exists
        Specialty specialty = specialtyRepository.findById(specialtyId)
                .orElseThrow(() -> new RuntimeException("Specialty not found with id: " + specialtyId));

        // Get all doctors with this specialty
        List<Doctor> doctors = doctorRepository.findBySpecialtyId(specialtyId);
        
        if (doctors.isEmpty()) {
            throw new RuntimeException("No doctors found with specialty: " + specialty.getName());
        }

        return doctors.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public DoctorResponse updateDoctor(Long id, DoctorRequest request) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        updateDoctorFromRequest(doctor, request);
        return mapToResponse(doctorRepository.save(doctor));
    }

    @Transactional
    public void deleteDoctor(Long id) {
        if (!doctorRepository.existsById(id)) {
            throw new RuntimeException("Doctor not found");
        }
        doctorRepository.deleteById(id);
    }

    private void updateDoctorFromRequest(Doctor doctor, DoctorRequest request) {
        doctor.setFullName(request.getFullName());
        doctor.setEmail(request.getEmail());
        doctor.setPhoneNumber(request.getPhoneNumber());
        doctor.setBio(request.getBio());
        doctor.setLicenseNumber(request.getLicenseNumber());
        doctor.setYearsOfExperience(request.getYearsOfExperience());

        // Update specialties
        Set<Specialty> specialties = request.getSpecialtyIds().stream()
                .map(specialtyId -> specialtyRepository.findById(specialtyId)
                        .orElseThrow(() -> new RuntimeException("Specialty not found with id: " + specialtyId)))
                .collect(Collectors.toSet());
        doctor.setSpecialties(specialties);
    }

    private DoctorResponse mapToResponse(Doctor doctor) {
        return new DoctorResponse(
                doctor.getId(),
                doctor.getFullName(),
                doctor.getEmail(),
                doctor.getPhoneNumber(),
                doctor.getBio(),
                doctor.getLicenseNumber(),
                doctor.getYearsOfExperience(),
                doctor.getSpecialties().stream()
                        .map(specialty -> new SpecialtyResponse(
                                specialty.getId(),
                                specialty.getName(),
                                specialty.getDescription()))
                        .collect(Collectors.toSet())
        );
    }
}
 