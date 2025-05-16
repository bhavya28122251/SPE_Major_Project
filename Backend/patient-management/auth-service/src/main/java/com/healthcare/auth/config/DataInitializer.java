package com.healthcare.auth.config;

import com.healthcare.auth.entity.Role;
import com.healthcare.auth.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(RoleRepository roleRepository) {
        return args -> {
            // Create admin role if it doesn't exist
            if (!roleRepository.existsByName("ADMIN")) {
                Role adminRole = new Role();
                adminRole.setName("ADMIN");
                adminRole.setDescription("Administrator with full access");
                roleRepository.save(adminRole);
            }

            // Create doctor role if it doesn't exist
            if (!roleRepository.existsByName("DOCTOR")) {
                Role doctorRole = new Role();
                doctorRole.setName("DOCTOR");
                doctorRole.setDescription("Doctor with access to patient records and appointments");
                roleRepository.save(doctorRole);
            }

            // Create patient role if it doesn't exist
            if (!roleRepository.existsByName("PATIENT")) {
                Role patientRole = new Role();
                patientRole.setName("PATIENT");
                patientRole.setDescription("Patient with access to their own records and appointments");
                roleRepository.save(patientRole);
            }
        };
    }
} 