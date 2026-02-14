package com.rafetcelik.universal_pet_care.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.rafetcelik.universal_pet_care.model.Review;

public interface ReviewRepository extends JpaRepository<Review, Long>{
	@Query("SELECT r FROM Review r WHERE r.veterinarian.id = :userId OR r.patient.id = :userId")
	Page<Review> findAllByUserId(@Param("userId") Long userId, Pageable pageable);
	
	@Query("SELECT r FROM Review r WHERE r.veterinarian.id = :userId OR r.patient.id = :userId")
	List<Review> findAllByUserId(@Param("userId") Long userId);

	List<Review> findByVeterinarianId(Long veterinarianId);

	Optional<Review> findByVeterinarianIdAndPatientId(Long veterinarianId, Long reviewerId);

	Long countByVeterinarianId(Long id);

}
