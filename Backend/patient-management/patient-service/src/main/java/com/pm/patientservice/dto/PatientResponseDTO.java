package com.pm.patientservice.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatientResponseDTO {

    private String id;
    private String name;
    private String email;
    private String address;
    private String phone;
    private String gender;
    private int age;
    private LocalDate dateOfBirth;
    private LocalDate registeredDate;

}
