package com.healthcare.doctor.repository;

import com.healthcare.doctor.entity.Doctor;
import com.healthcare.doctor.entity.Specialty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    Optional<Doctor> findByEmail(String email);
    Optional<Doctor> findByUserId(String userId);
    boolean existsByEmail(String email);
    
    @Query("SELECT DISTINCT d FROM Doctor d " +
           "JOIN FETCH d.specialties s " +
           "WHERE s.id = :specialtyId")
    List<Doctor> findBySpecialtyId(@Param("specialtyId") Long specialtyId);
} 