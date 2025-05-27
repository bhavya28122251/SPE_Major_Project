package com.healthcare.appointment.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "patient-service", url = "http://localhost:8082", path = "/api/patients")
public interface PatientServiceClient {
    
    @GetMapping("/{id}")
    ResponseEntity<Object> getPatientById(@PathVariable("id") Long id);

    @GetMapping("/user/{userId}")
    ResponseEntity<Object> getPatientByUserId(@PathVariable("userId") String userId);

    @GetMapping("/exists/{id}")
    ResponseEntity<Boolean> existsById(@PathVariable("id") Long id);
} 