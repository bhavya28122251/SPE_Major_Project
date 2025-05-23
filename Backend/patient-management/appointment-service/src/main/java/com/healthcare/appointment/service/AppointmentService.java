package com.healthcare.appointment.service;

import com.healthcare.appointment.client.DoctorServiceClient;
import com.healthcare.appointment.client.PatientServiceClient;
import com.healthcare.appointment.dto.AppointmentRequest;
import com.healthcare.appointment.dto.AppointmentResponse;
import com.healthcare.appointment.entity.Appointment;
import com.healthcare.appointment.entity.AppointmentStatus;
import com.healthcare.appointment.repository.AppointmentRepository;
import com.healthcare.appointment.util.AvailabilityUtil;
import com.healthcare.appointment.dto.AppointmentStats;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientServiceClient patientServiceClient;
    private final DoctorServiceClient doctorServiceClient;
    private final AvailabilityUtil availabilityUtil;

    @Transactional
    public AppointmentResponse createAppointment(AppointmentRequest request) {
        // Validate patient exists
        ResponseEntity<Boolean> patientExists = patientServiceClient.existsById(request.getPatientId());
        if (patientExists.getBody() == null || !patientExists.getBody()) {
            throw new RuntimeException("Patient not found");
        }

        // Validate doctor exists
        ResponseEntity<Boolean> doctorExists = doctorServiceClient.existsById(request.getDoctorId());
        if (doctorExists.getBody() == null || !doctorExists.getBody()) {
            throw new RuntimeException("Doctor not found");
        }

        // Check doctor availability
        ResponseEntity<Object> availabilityResponse = doctorServiceClient.getDoctorAvailability(request.getDoctorId());
        if (availabilityResponse.getBody() == null) {
            throw new RuntimeException("Could not fetch doctor availability");
        }

        String availabilityJson = availabilityResponse.getBody().toString();
        if (!availabilityUtil.isDoctorAvailable(availabilityJson, request.getAppointmentDateTime())) {
            throw new RuntimeException("Doctor is not available at the requested time");
        }

        // Check if there's already an appointment at this time
        if (appointmentRepository.existsByDoctorIdAndAppointmentDateTime(
                request.getDoctorId(), request.getAppointmentDateTime())) {
            throw new RuntimeException("Doctor already has an appointment at this time");
        }

        Appointment appointment = new Appointment();
        appointment.setPatientId(request.getPatientId());
        appointment.setDoctorId(request.getDoctorId());
        appointment.setAppointmentDateTime(request.getAppointmentDateTime());
        appointment.setReason(request.getReason());
        appointment.setStatus(AppointmentStatus.SCHEDULED);

        return mapToResponse(appointmentRepository.save(appointment));
    }

    @Transactional(readOnly = true)
    public AppointmentResponse getAppointmentById(Long id) {
        return appointmentRepository.findById(id)
                .map(this::mapToResponse)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
    }

    @Transactional(readOnly = true)
    public List<AppointmentResponse> getAppointmentsByPatientId(Long patientId) {
        // Validate patient exists
        ResponseEntity<Boolean> patientExists = patientServiceClient.existsById(patientId);
        if (patientExists.getBody() == null || !patientExists.getBody()) {
            throw new RuntimeException("Patient not found");
        }

        return appointmentRepository.findByPatientId(patientId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AppointmentResponse> getAppointmentsByDoctorId(Long doctorId) {
        // Validate doctor exists
        ResponseEntity<Boolean> doctorExists = doctorServiceClient.existsById(doctorId);
        if (doctorExists.getBody() == null || !doctorExists.getBody()) {
            throw new RuntimeException("Doctor not found");
        }

        return appointmentRepository.findByDoctorId(doctorId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AppointmentResponse> getAppointmentsByPatientUserId(String patientUserId) {
        return appointmentRepository.findByPatientUserId(patientUserId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AppointmentResponse> getAppointmentsByDoctorUserId(String doctorUserId) {
        return appointmentRepository.findByDoctorUserId(doctorUserId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AppointmentResponse> getAppointmentsByStatus(AppointmentStatus status) {
        return appointmentRepository.findByStatus(status).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AppointmentResponse> getAppointmentsByDoctorIdAndDateRange(
            Long doctorId, LocalDateTime start, LocalDateTime end) {
        return appointmentRepository.findByDoctorIdAndAppointmentDateTimeBetween(doctorId, start, end).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AppointmentResponse> getAppointmentsByPatientIdAndDateRange(
            Long patientId, LocalDateTime start, LocalDateTime end) {
        return appointmentRepository.findByPatientIdAndAppointmentDateTimeBetween(patientId, start, end).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public AppointmentResponse updateAppointment(Long id, AppointmentRequest request) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        appointment.setDoctorId(request.getDoctorId());
        appointment.setAppointmentDateTime(request.getAppointmentDateTime());
        appointment.setReason(request.getReason());
        appointment.setNotes(request.getNotes());

        return mapToResponse(appointmentRepository.save(appointment));
    }

    @Transactional
    public void deleteAppointment(Long id) {
        if (!appointmentRepository.existsById(id)) {
            throw new RuntimeException("Appointment not found");
        }
        appointmentRepository.deleteById(id);
    }

    @Transactional
    public AppointmentResponse updateAppointmentStatus(Long id, AppointmentStatus status) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        appointment.setStatus(status);
        return mapToResponse(appointmentRepository.save(appointment));
    }

    public AppointmentStats getAppointmentStats() {
        AppointmentStats stats = new AppointmentStats();
        
        stats.setTotalAppointments(appointmentRepository.count());
        stats.setPendingAppointments(appointmentRepository.countByStatus(AppointmentStatus.PENDING));
        stats.setCompletedAppointments(appointmentRepository.countByStatus(AppointmentStatus.COMPLETED));
        stats.setCancelledAppointments(appointmentRepository.countByStatus(AppointmentStatus.CANCELLED));
        stats.setTodayAppointments(appointmentRepository.countByAppointmentDateTime(LocalDateTime.now()));
        
        return stats;
    }

    private AppointmentResponse mapToResponse(Appointment appointment) {
        return new AppointmentResponse(
                appointment.getId(),
                appointment.getPatientId(),
                appointment.getDoctorId(),
                appointment.getAppointmentDateTime(),
                appointment.getStatus(),
                appointment.getReason(),
                appointment.getNotes() != null ? appointment.getNotes() : "",
                appointment.getPatientUserId() != null ? appointment.getPatientUserId() : "",
                appointment.getDoctorUserId() != null ? appointment.getDoctorUserId() : ""
        );
    }
} 