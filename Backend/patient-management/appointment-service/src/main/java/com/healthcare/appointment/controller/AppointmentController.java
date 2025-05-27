package com.healthcare.appointment.controller;

import com.healthcare.appointment.dto.AppointmentRequest;
import com.healthcare.appointment.dto.AppointmentResponse;
import com.healthcare.appointment.entity.AppointmentStatus;
import com.healthcare.appointment.service.AppointmentService;
import com.healthcare.appointment.dto.AppointmentStats;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
@Tag(name = "Appointment", description = "Appointment management APIs")
public class AppointmentController {

    private final AppointmentService appointmentService;

    @PostMapping
    @Operation(summary = "Create a new appointment", description = "Create a new appointment with the provided details")
    public ResponseEntity<AppointmentResponse> createAppointment(
            @Valid @RequestBody AppointmentRequest request) {
        return ResponseEntity.ok(appointmentService.createAppointment(request));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get appointment by ID", description = "Retrieve appointment details by ID")
    public ResponseEntity<AppointmentResponse> getAppointmentById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(appointmentService.getAppointmentById(id));
    }

    @GetMapping("/patient/{patientId}")
    @Operation(summary = "Get appointments by patient ID", description = "Retrieve all appointments for a specific patient")
    public ResponseEntity<List<AppointmentResponse>> getAppointmentsByPatientId(@PathVariable("patientId") Long patientId) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByPatientId(patientId));
    }

    @GetMapping("/doctor/{doctorId}")
    @Operation(summary = "Get appointments by doctor ID", description = "Retrieve all appointments for a specific doctor")
    public ResponseEntity<List<AppointmentResponse>> getAppointmentsByDoctorId(@PathVariable("doctorId") Long doctorId) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByDoctorId(doctorId));
    }

    @GetMapping("/patient/user/{patientUserId}")
    @Operation(summary = "Get appointments by patient user ID", description = "Retrieve all appointments for a specific patient user")
    public ResponseEntity<List<AppointmentResponse>> getAppointmentsByPatientUserId(@PathVariable("patientUserId") String patientUserId) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByPatientUserId(patientUserId));
    }

    @GetMapping("/doctor/user/{doctorUserId}")
    @Operation(summary = "Get appointments by doctor user ID", description = "Retrieve all appointments for a specific doctor user")
    public ResponseEntity<List<AppointmentResponse>> getAppointmentsByDoctorUserId(@PathVariable("doctorUserId") String doctorUserId) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByDoctorUserId(doctorUserId));
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Get appointments by status", description = "Retrieve all appointments with a specific status")
    public ResponseEntity<List<AppointmentResponse>> getAppointmentsByStatus(@PathVariable("status") AppointmentStatus status) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByStatus(status));
    }

    @GetMapping("/doctor/{doctorId}/date-range")
    @Operation(summary = "Get appointments by doctor ID and date range", description = "Retrieve all appointments for a doctor within a date range")
    public ResponseEntity<List<AppointmentResponse>> getAppointmentsByDoctorIdAndDateRange(
            @PathVariable("doctorId") Long doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByDoctorIdAndDateRange(doctorId, start, end));
    }

    @GetMapping("/patient/{patientId}/date-range")
    @Operation(summary = "Get appointments by patient ID and date range", description = "Retrieve all appointments for a patient within a date range")
    public ResponseEntity<List<AppointmentResponse>> getAppointmentsByPatientIdAndDateRange(
            @PathVariable("patientId") Long patientId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByPatientIdAndDateRange(patientId, start, end));
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Update appointment status", description = "Update the status of an appointment")
    public ResponseEntity<AppointmentResponse> updateAppointmentStatus(
            @PathVariable("id") Long id,
            @RequestParam AppointmentStatus status) {
        return ResponseEntity.ok(appointmentService.updateAppointmentStatus(id, status));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update appointment", description = "Update appointment details")
    public ResponseEntity<AppointmentResponse> updateAppointment(
            @PathVariable("id") Long id,
            @Valid @RequestBody AppointmentRequest request) {
        return ResponseEntity.ok(appointmentService.updateAppointment(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete appointment", description = "Delete an appointment by ID")
    public ResponseEntity<Void> deleteAppointment(@PathVariable("id") Long id) {
        appointmentService.deleteAppointment(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/stats")
    public ResponseEntity<AppointmentStats> getAppointmentStats() {
        return ResponseEntity.ok(appointmentService.getAppointmentStats());
    }
    @GetMapping("/patient/{patientId}/stats")
    @Operation(summary = "Get appointment statistics for a patient", description = "Retrieve appointment statistics for a specific patient")
    public ResponseEntity<AppointmentStats> getAppointmentStatsByPatientId(
            @PathVariable("patientId") Long patientId) {
        return ResponseEntity.ok(appointmentService.getAppointmentStatsByPatientId(patientId));
    }

    @GetMapping("/patient/{patientId}/upcoming")
    @Operation(summary = "Get upcoming appointments for a patient", description = "Retrieve all upcoming appointments for a specific patient")
    public ResponseEntity<List<AppointmentResponse>> getUpcomingAppointmentsByPatientId(
            @PathVariable("patientId") Long patientId) {
        return ResponseEntity.ok(appointmentService.getUpcomingAppointmentsByPatientId(patientId));
    }

    @GetMapping("/doctor/{doctorId}/stats")
    @Operation(summary = "Get appointment statistics for a doctor", description = "Retrieve appointment statistics for a specific doctor")
    public ResponseEntity<AppointmentStats> getAppointmentStatsByDoctorId(
            @PathVariable("doctorId") Long doctorId) {
        return ResponseEntity.ok(appointmentService.getAppointmentStatsByDoctorId(doctorId));
    }

    @GetMapping("/doctor/{doctorId}/recent")
    @Operation(summary = "Get recent appointments for a doctor", description = "Retrieve recent appointments for a specific doctor")
    public ResponseEntity<List<AppointmentResponse>> getRecentAppointmentsByDoctorId(
            @PathVariable("doctorId") Long doctorId) {
        return ResponseEntity.ok(appointmentService.getRecentAppointmentsByDoctorId(doctorId));
    }

} 