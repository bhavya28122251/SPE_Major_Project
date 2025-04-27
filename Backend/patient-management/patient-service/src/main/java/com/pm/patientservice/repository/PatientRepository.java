package com.pm.patientservice.repository;

import com.pm.patientservice.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface PatientRepository extends JpaRepository<Patient, UUID> {
    boolean existsByEmail(String email);

    // here we are mking this functionas everytime when we want to update something
    // other than email, then it says email already exists...but we want to change
    //in that field only. So here it will try to find email but will igore the
    // email of the id of the current patient whose info we want to change.
    boolean existsByEmailAndIdNot(String email,UUID id);
}
