package com.healthcare.doctor.config;

import com.healthcare.doctor.entity.Specialty;
import com.healthcare.doctor.repository.SpecialtyRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(SpecialtyRepository specialtyRepository) {
        return args -> {
            // Create common medical specialties if they don't exist
            createSpecialtyIfNotExists(specialtyRepository, "Cardiology", 
                "Diagnosis and treatment of heart disorders and diseases");
            
            createSpecialtyIfNotExists(specialtyRepository, "Dermatology", 
                "Diagnosis and treatment of skin disorders and diseases");
            
            createSpecialtyIfNotExists(specialtyRepository, "Neurology", 
                "Diagnosis and treatment of disorders of the nervous system");
            
            createSpecialtyIfNotExists(specialtyRepository, "Orthopedics", 
                "Diagnosis and treatment of musculoskeletal system disorders");
            
            createSpecialtyIfNotExists(specialtyRepository, "Pediatrics", 
                "Medical care of infants, children, and adolescents");
            
            createSpecialtyIfNotExists(specialtyRepository, "Psychiatry", 
                "Diagnosis and treatment of mental, emotional, and behavioral disorders");
            
            createSpecialtyIfNotExists(specialtyRepository, "Gynecology", 
                "Health of the female reproductive system");
            
            createSpecialtyIfNotExists(specialtyRepository, "Ophthalmology", 
                "Diagnosis and treatment of eye disorders and diseases");
            
            createSpecialtyIfNotExists(specialtyRepository, "ENT (Ear, Nose, and Throat)", 
                "Diagnosis and treatment of disorders of the ear, nose, and throat");
            
            createSpecialtyIfNotExists(specialtyRepository, "Dentistry", 
                "Diagnosis and treatment of oral health issues");
        };
    }

    private void createSpecialtyIfNotExists(SpecialtyRepository repository, String name, String description) {
        if (!repository.existsByName(name)) {
            Specialty specialty = new Specialty();
            specialty.setName(name);
            specialty.setDescription(description);
            repository.save(specialty);
        }
    }
} 