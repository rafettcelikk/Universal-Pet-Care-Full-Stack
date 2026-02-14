package com.rafetcelik.universal_pet_care.service.password;

import java.util.Optional;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.rafetcelik.universal_pet_care.event.PasswordResetEvent;
import com.rafetcelik.universal_pet_care.exception.ResourceNotFoundException;
import com.rafetcelik.universal_pet_care.model.User;
import com.rafetcelik.universal_pet_care.model.VerificationToken;
import com.rafetcelik.universal_pet_care.repository.UserRepository;
import com.rafetcelik.universal_pet_care.repository.VerificationTokenRepository;
import com.rafetcelik.universal_pet_care.utils.FeedBackMessage;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PasswordResetService implements IPasswordResetService{

	private final VerificationTokenRepository verificationTokenRepository;
	
	private final UserRepository userRepository;
	
	private final PasswordEncoder passwordEncoder;
	
	private final ApplicationEventPublisher eventPublisher;
	
	@Override
	public Optional<User> findUserByPasswordResetToken(String token) {
		return verificationTokenRepository.findByToken(token)
				.map(VerificationToken :: getUser);
	}

	@Override
	public void requestPasswordReset(String email) {
		userRepository.findByEmail(email).ifPresentOrElse(user -> {
			PasswordResetEvent passwordResetEvent = new PasswordResetEvent(this, user);
			eventPublisher.publishEvent(passwordResetEvent);
		}, () -> {
			throw new ResourceNotFoundException(FeedBackMessage.NO_USER_FOUND + email);
		});
		
	}

	@Override
	public String resetPassword(String password, User user) {
		try {
			user.setPassword(passwordEncoder.encode(password));
			userRepository.save(user);
			return FeedBackMessage.PASSWORD_RESET_SUCCESS;
		} catch (Exception e) {
			throw new IllegalArgumentException(e.getMessage());
		} 
	}

}
