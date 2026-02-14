package com.rafetcelik.universal_pet_care.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.rafetcelik.universal_pet_care.model.Veterinarian;

public interface VeterinarianRepository extends JpaRepository<Veterinarian, Long>{

	List<Veterinarian> findBySpecialization(String specialization);

	boolean existsBySpecialization(String specialization);
	
	@Query("SELECT DISTINCT v.specialization FROM Veterinarian v")
	List<String> findAllSpecializations();

	@Query("SELECT v.specialization as specialization, COUNT(v) as count FROM Veterinarian v GROUP BY v.specialization")
	List<Object[]> countVeterinariansBySpecialization();

}
