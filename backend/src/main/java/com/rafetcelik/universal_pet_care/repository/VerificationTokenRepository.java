package com.rafetcelik.universal_pet_care.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rafetcelik.universal_pet_care.model.VerificationToken;

public interface VerificationTokenRepository extends JpaRepository<VerificationToken, Long>{

	Optional<VerificationToken> findByToken(String token);

}
