package com.healthcare.doctor.service;

import com.healthcare.doctor.dto.SpecialtyRequest;
import com.healthcare.doctor.dto.SpecialtyResponse;
import com.healthcare.doctor.entity.Specialty;
import com.healthcare.doctor.repository.SpecialtyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SpecialtyService {

    private final SpecialtyRepository specialtyRepository;

    @Transactional
    public SpecialtyResponse createSpecialty(SpecialtyRequest request) {
        if (specialtyRepository.existsByName(request.getName())) {
            throw new RuntimeException("Specialty with this name already exists");
        }

        Specialty specialty = new Specialty();
        specialty.setName(request.getName());
        specialty.setDescription(request.getDescription());

        return mapToResponse(specialtyRepository.save(specialty));
    }

    @Transactional(readOnly = true)
    public List<SpecialtyResponse> getAllSpecialties() {
        return specialtyRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public SpecialtyResponse getSpecialtyById(Long id) {
        return specialtyRepository.findById(id)
                .map(this::mapToResponse)
                .orElseThrow(() -> new RuntimeException("Specialty not found"));
    }

    @Transactional(readOnly = true)
    public SpecialtyResponse getSpecialtyByName(String name) {
        return specialtyRepository.findByName(name)
                .map(this::mapToResponse)
                .orElseThrow(() -> new RuntimeException("Specialty not found"));
    }

    private SpecialtyResponse mapToResponse(Specialty specialty) {
        return new SpecialtyResponse(
                specialty.getId(),
                specialty.getName(),
                specialty.getDescription()
        );
    }
} 