package com.rafetcelik.universal_pet_care.service.token;

import java.util.Calendar;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.rafetcelik.universal_pet_care.model.User;
import com.rafetcelik.universal_pet_care.model.VerificationToken;
import com.rafetcelik.universal_pet_care.repository.UserRepository;
import com.rafetcelik.universal_pet_care.repository.VerificationTokenRepository;
import com.rafetcelik.universal_pet_care.utils.FeedBackMessage;
import com.rafetcelik.universal_pet_care.utils.SystemUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VerificationTokenService implements IVerificationTokenService{
	
	private final UserRepository userRepository;
	
	private final VerificationTokenRepository verificationTokenRepository;

	@Override
	public String validateToken(String token) {
		Optional<VerificationToken> optToken = findByToken(token);
		if (optToken.isEmpty()) {
			return FeedBackMessage.TOKEN_INVALID;
		}
		
		User user = optToken.get().getUser();
		if (user.isEnabled()) {
			return FeedBackMessage.TOKEN_ALREADY_USED;
		}
		
		if (isTokenExpired(token)) {
			return FeedBackMessage.TOKEN_EXPIRED;
		}
		
		user.setEnabled(true);
		userRepository.save(user);
		return FeedBackMessage.TOKEN_VALID;
	}

	@Override
	public void saveVerificationTokenForUser(String token, User user) {
		var verificationToken = new VerificationToken(token, user);
		verificationTokenRepository.save(verificationToken);
	}

	@Override
	public VerificationToken generateNewVerificationToken(String oldToken) {
		Optional<VerificationToken> optToken = findByToken(oldToken);
		if (optToken.isPresent()) {
			var verificationToken = optToken.get();
			verificationToken.setToken(UUID.randomUUID().toString());
			verificationToken.setExpirationDate(SystemUtils.getExpirationTime());
			return verificationTokenRepository.save(verificationToken);
		} else {
			throw new IllegalArgumentException(FeedBackMessage.TOKEN_INVALID + oldToken);
		}
		
	}

	@Override
	public Optional<VerificationToken> findByToken(String token) {
		return verificationTokenRepository.findByToken(token);
	}

	@Override
	public void deleteVerificationToken(Long tokenId) {
		verificationTokenRepository.deleteById(tokenId);
	}

	@Override
	public boolean isTokenExpired(String token) {
		Optional<VerificationToken> optToken = findByToken(token);
		if (optToken.isEmpty()) {
			return true;
		}
		
		VerificationToken verificationToken = optToken.get();
		return verificationToken.getExpirationDate().getTime() < Calendar.getInstance().getTime().getTime();
	}

}
