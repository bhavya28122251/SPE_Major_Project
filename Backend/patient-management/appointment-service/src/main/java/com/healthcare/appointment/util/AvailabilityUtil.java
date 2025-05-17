package com.healthcare.appointment.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Map;

@Slf4j
@Component
public class AvailabilityUtil {
    private final ObjectMapper objectMapper;

    public AvailabilityUtil(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public boolean isDoctorAvailable(String availabilityJson, LocalDateTime appointmentDateTime) {
        try {
            Map<DayOfWeek, Map<String, String>> availability = objectMapper.readValue(
                    availabilityJson,
                    new TypeReference<Map<DayOfWeek, Map<String, String>>>() {}
            );

            DayOfWeek dayOfWeek = appointmentDateTime.getDayOfWeek();
            LocalTime appointmentTime = appointmentDateTime.toLocalTime();

            if (!availability.containsKey(dayOfWeek)) {
                return false;
            }

            Map<String, String> daySchedule = availability.get(dayOfWeek);
            String startTimeStr = daySchedule.get("startTime");
            String endTimeStr = daySchedule.get("endTime");

            if (startTimeStr == null || endTimeStr == null) {
                return false;
            }

            LocalTime startTime = LocalTime.parse(startTimeStr);
            LocalTime endTime = LocalTime.parse(endTimeStr);

            return !appointmentTime.isBefore(startTime) && !appointmentTime.isAfter(endTime);
        } catch (JsonProcessingException e) {
            log.error("Error parsing doctor availability: {}", e.getMessage());
            return false;
        }
    }
} 