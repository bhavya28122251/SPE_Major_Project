package com.healthcare.doctor.config;

import com.healthcare.doctor.entity.Specialty;
import com.healthcare.doctor.repository.SpecialtyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer {

    @Autowired
    private SpecialtyRepository specialtyRepository;
    
    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void initData() {
        // Define all specialties at once
        List<Specialty> specialties = Arrays.asList(
            createSpecialty("Cardiology", "Diagnosis and treatment of heart disorders and diseases"),
            createSpecialty("Dermatology", "Diagnosis and treatment of skin disorders and diseases"),
            createSpecialty("Neurology", "Diagnosis and treatment of disorders of the nervous system"),
            createSpecialty("Orthopedics", "Diagnosis and treatment of musculoskeletal system disorders"),
            createSpecialty("Pediatrics", "Medical care of infants, children, and adolescents"),
            createSpecialty("Psychiatry", "Diagnosis and treatment of mental, emotional, and behavioral disorders"),
            createSpecialty("Gynecology", "Health of the female reproductive system"),
            createSpecialty("Ophthalmology", "Diagnosis and treatment of eye disorders and diseases"),
            createSpecialty("ENT (Ear, Nose, and Throat)", "Diagnosis and treatment of disorders of the ear, nose, and throat"),
            createSpecialty("Dentistry", "Diagnosis and treatment of oral health issues")
        );
        
        // Bulk check and save
        for (Specialty specialty : specialties) {
            if (!specialtyRepository.existsByName(specialty.getName())) {
                specialtyRepository.save(specialty);
            }
        }
    }
    
    private Specialty createSpecialty(String name, String description) {
        Specialty specialty = new Specialty();
        specialty.setName(name);
        specialty.setDescription(description);
        return specialty;
    }
}