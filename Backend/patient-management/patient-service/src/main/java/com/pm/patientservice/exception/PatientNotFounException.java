package com.pm.patientservice.exception;

public class PatientNotFounException extends RuntimeException {
    public PatientNotFounException(String message) {
        super(message);
    }
}
