package com.healthcare.appointment.dto;

import lombok.Data;

@Data
public class AppointmentStats {
    private long totalAppointments;
    private long pendingAppointments;
    private long completedAppointments;
    private long cancelledAppointments;
    private long todayAppointments;
} 