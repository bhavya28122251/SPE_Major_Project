package com.healthcare.patient.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "patients")
public class Patient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String phoneNumber;

    @Column(nullable = false)
    private LocalDate dateOfBirth;

    @Column(nullable = false)
    private String gender;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private String medicalHistory;

    @Column(nullable = false)
    private String allergies;

    @Column(nullable = false)
    private String bloodGroup;

    @Column(nullable = false)
    private String emergencyContactName;

    @Column(nullable = false)
    private String emergencyContactPhone;

    @Column(nullable = false)
    private String userId; // Reference to the user in auth service
} 
 