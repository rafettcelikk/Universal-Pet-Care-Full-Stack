package com.rafetcelik.universal_pet_care.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.rafetcelik.universal_pet_care.exception.ResourceNotFoundException;
import com.rafetcelik.universal_pet_care.model.User;
import com.rafetcelik.universal_pet_care.model.VerificationToken;
import com.rafetcelik.universal_pet_care.repository.UserRepository;
import com.rafetcelik.universal_pet_care.request.VerificationTokenRequest;
import com.rafetcelik.universal_pet_care.response.ApiResponse;
import com.rafetcelik.universal_pet_care.service.token.IVerificationTokenService;
import com.rafetcelik.universal_pet_care.utils.FeedBackMessage;
import com.rafetcelik.universal_pet_care.utils.UrlMapping;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(UrlMapping.VERIFICATION_TOKEN)
public class VerificationTokenController {
	
	private final IVerificationTokenService verificationTokenService;
	
	private final UserRepository userRepository;
	
	@GetMapping(UrlMapping.VALIDATE_TOKEN)
	public ResponseEntity<ApiResponse> validateToken(String token) {
		String result = verificationTokenService.validateToken(token);
		ApiResponse response = switch (result) {
			case "Token geçersiz." -> new ApiResponse(FeedBackMessage.TOKEN_INVALID, null);
			case "Token zaten kullanılmış." -> new ApiResponse(FeedBackMessage.TOKEN_ALREADY_USED, null);
			case "Token süresi dolmuş." -> new ApiResponse(FeedBackMessage.TOKEN_EXPIRED, null);
			case "Token geçerli." -> new ApiResponse(FeedBackMessage.TOKEN_VALID, null);
			default -> new ApiResponse(FeedBackMessage.TOKEN_VALIDATION_ERROR, null);
			};
			return ResponseEntity.ok(response);
	}
	
	@GetMapping(UrlMapping.CHECK_TOKEN_EXPIRATION)
	public ResponseEntity<ApiResponse> checkTokenExpiration(String token) {
		boolean isExpired = verificationTokenService.isTokenExpired(token);
		ApiResponse response;
		if (isExpired) {
			response = new ApiResponse(FeedBackMessage.TOKEN_EXPIRED, null);
		} else {
			response = new ApiResponse(FeedBackMessage.TOKEN_VALID, null);
		}
		return ResponseEntity.ok(response);
	}
	
	@PostMapping(UrlMapping.SAVE_VERIFICATION_TOKEN)
	public ResponseEntity<ApiResponse> saveVerificationTokenForUser(@RequestBody VerificationTokenRequest request) {
		User user = userRepository.findById(request.getUser().getId())
				.orElseThrow(() -> new ResourceNotFoundException(FeedBackMessage.USER_FOUND));
		verificationTokenService.saveVerificationTokenForUser(request.getToken(), user);
		return ResponseEntity.ok(new ApiResponse(FeedBackMessage.TOKEN_SAVED_SUCCESS, null));
	}
	
	@PutMapping(UrlMapping.GENERATE_NEW_VERIFICATION_TOKEN)
	public ResponseEntity<ApiResponse> generateNewVerificationToken(@RequestParam String oldToken) {
		VerificationToken newToken = verificationTokenService.generateNewVerificationToken(oldToken);
		return ResponseEntity.ok(new ApiResponse(FeedBackMessage.NEW_VERIFICATION_TOKEN_SENT, newToken));
	}
	
	@DeleteMapping(UrlMapping.DELETE_VERIFICATION_TOKEN)
	public ResponseEntity<ApiResponse> deleteVerificationToken(@RequestParam Long tokenId) {
		verificationTokenService.deleteVerificationToken(tokenId);
		return ResponseEntity.ok(new ApiResponse(FeedBackMessage.TOKEN_DELETE_SUCCESS, null));
	}
}
