package com.healthcare.appointment.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "DOCTOR-SERVICE", path = "/api/doctors")
public interface DoctorServiceClient {
    
    @GetMapping("/{id}")
    ResponseEntity<Object> getDoctorById(@PathVariable("id") Long id);

    @GetMapping("/user/{userId}")
    ResponseEntity<Object> getDoctorByUserId(@PathVariable("userId") String userId);

    @GetMapping("/exists/{id}")
    ResponseEntity<Boolean> existsById(@PathVariable("id") Long id);

    @GetMapping("/{id}/availability")
    ResponseEntity<Object> getDoctorAvailability(@PathVariable("id") Long id);
} 