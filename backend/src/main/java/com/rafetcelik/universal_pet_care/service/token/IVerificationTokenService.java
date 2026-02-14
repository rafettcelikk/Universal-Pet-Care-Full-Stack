package com.rafetcelik.universal_pet_care.service.token;

import java.util.Optional;

import com.rafetcelik.universal_pet_care.model.User;
import com.rafetcelik.universal_pet_care.model.VerificationToken;

public interface IVerificationTokenService {
	
	String validateToken(String token);
	
	void saveVerificationTokenForUser(String token, User user);
	
	VerificationToken generateNewVerificationToken(String oldToken);
	
	Optional<VerificationToken> findByToken(String token);
	
	void deleteVerificationToken(Long tokenId);
	
	boolean isTokenExpired(String token);
}
