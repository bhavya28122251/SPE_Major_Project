package com.healthcare.appointment.repository;

import com.healthcare.appointment.entity.Appointment;
import com.healthcare.appointment.entity.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatientId(Long patientId);
    List<Appointment> findByDoctorId(Long doctorId);
    List<Appointment> findByPatientUserId(String patientUserId);
    List<Appointment> findByDoctorUserId(String doctorUserId);
    List<Appointment> findByStatus(AppointmentStatus status);
    List<Appointment> findByDoctorIdAndAppointmentDateTimeBetween(
        Long doctorId, LocalDateTime start, LocalDateTime end);
    List<Appointment> findByPatientIdAndAppointmentDateTimeBetween(
        Long patientId, LocalDateTime start, LocalDateTime end);
    boolean existsByDoctorIdAndAppointmentDateTime(Long doctorId, LocalDateTime appointmentDateTime);
    long countByStatus(AppointmentStatus status);
    long countByAppointmentDateTime(LocalDateTime date);

    long countByPatientId(Long patientId);
    long countByPatientIdAndStatusAndAppointmentDateTimeAfter(Long patientId, AppointmentStatus status, LocalDateTime dateTime);
    long countByPatientIdAndStatus(Long patientId, AppointmentStatus status);
    List<Appointment> findByPatientIdAndAppointmentDateTimeAfterOrderByAppointmentDateTime(Long patientId, LocalDateTime dateTime);
    long countByDoctorId(Long doctorId);
    long countByDoctorIdAndStatus(Long doctorId, AppointmentStatus status);
    long countByDoctorIdAndAppointmentDateTimeBetween(Long doctorId, LocalDateTime start, LocalDateTime end);
    long countByDoctorIdAndStatusAndAppointmentDateTimeAfter(Long doctorId, AppointmentStatus status, LocalDateTime dateTime);
    List<Appointment> findTop5ByDoctorIdOrderByAppointmentDateTimeDesc(Long doctorId);
}