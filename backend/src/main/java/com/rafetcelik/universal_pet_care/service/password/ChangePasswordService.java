package com.rafetcelik.universal_pet_care.service.password;

import java.util.Objects;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.rafetcelik.universal_pet_care.exception.ResourceNotFoundException;
import com.rafetcelik.universal_pet_care.model.User;
import com.rafetcelik.universal_pet_care.repository.UserRepository;
import com.rafetcelik.universal_pet_care.request.ChangePasswordRequest;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChangePasswordService implements IChangePasswordService{
	private final UserRepository userRepository;
	
	private final PasswordEncoder passwordEncoder;
	
	@Override
	public void changePassword(Long userId, ChangePasswordRequest request) {
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new ResourceNotFoundException("Kullanıcı bulunamadı"));
		if (Objects.equals(request.getCurrentPassword(), "")
				|| Objects.equals(request.getNewPassword(), "")) {
			throw new IllegalArgumentException("Şifre alanları boş bırakılamaz!");
		}
		if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
			throw new IllegalArgumentException("Mevcut şifre yanlış!");
		}
		if (!request.getNewPassword().equals(request.getConfirmNewPassword())) {
			throw new IllegalArgumentException("Yeni şifre ve onay şifresi eşleşmiyor!");
		}
		user.setPassword(passwordEncoder.encode(request.getNewPassword()));
		userRepository.save(user);
	}
}
