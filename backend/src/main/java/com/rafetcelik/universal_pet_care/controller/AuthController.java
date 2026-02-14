package com.rafetcelik.universal_pet_care.controller;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

import java.util.Map;
import java.util.Optional;

import com.rafetcelik.universal_pet_care.event.RegistrationCompleteEvent;
import com.rafetcelik.universal_pet_care.exception.ResourceNotFoundException;
import com.rafetcelik.universal_pet_care.model.User;
import com.rafetcelik.universal_pet_care.model.VerificationToken;
import com.rafetcelik.universal_pet_care.request.LoginRequest;
import com.rafetcelik.universal_pet_care.request.PasswordResetRequest;
import com.rafetcelik.universal_pet_care.response.ApiResponse;
import com.rafetcelik.universal_pet_care.response.JwtResponse;
import com.rafetcelik.universal_pet_care.security.jwt.JwtUtils;
import com.rafetcelik.universal_pet_care.security.user.UPCUserDetails;
import com.rafetcelik.universal_pet_care.service.password.IPasswordResetService;
import com.rafetcelik.universal_pet_care.service.token.IVerificationTokenService;
import com.rafetcelik.universal_pet_care.utils.FeedBackMessage;
import com.rafetcelik.universal_pet_care.utils.UrlMapping;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(UrlMapping.AUTH)
public class AuthController {
	
	private final AuthenticationManager authenticationManager;
	
	private final JwtUtils jwtUtils;
	
	private final IVerificationTokenService verificationTokenService;
	
	private final IPasswordResetService passwordResetService;
	
	private final ApplicationEventPublisher publisher;
	
	@PostMapping(UrlMapping.LOGIN)
	public ResponseEntity<ApiResponse> login(@Valid @RequestBody LoginRequest request) {
		try {
			Authentication authentication = authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
			SecurityContextHolder.getContext().setAuthentication(authentication);
			String jwt = jwtUtils.generateJwtTokenForUser(authentication);
			UPCUserDetails userDetails = (UPCUserDetails) authentication.getPrincipal();
			JwtResponse jwtResponse = new JwtResponse(userDetails.getId(), jwt);
			return ResponseEntity.ok(new ApiResponse(FeedBackMessage.AUTHENTICATION_SUCCESS, jwtResponse));
		} catch (DisabledException e) {
			return ResponseEntity.status(UNAUTHORIZED).body(new ApiResponse(FeedBackMessage.ACCOUNT_DISABLED, null));
		} catch (AuthenticationException e) {
			return ResponseEntity.status(UNAUTHORIZED).body(new ApiResponse(e.getMessage(), FeedBackMessage.INVALID_PASSWORD));
		}
	}
	
	@GetMapping(UrlMapping.VERIFY_EMAIL)
	public ResponseEntity<ApiResponse> verifyEmail(@RequestParam("token") String token) {
		String result = verificationTokenService.validateToken(token);
		return switch (result) {
			case "TOKEN_VALID" -> ResponseEntity.ok(new ApiResponse(FeedBackMessage.TOKEN_VALID, null));
			case "TOKEN_ALREADY_USED" -> ResponseEntity.badRequest().body(new ApiResponse(FeedBackMessage.TOKEN_ALREADY_USED, null));
			case "TOKEN_EXPIRED" -> ResponseEntity.badRequest().body(new ApiResponse(FeedBackMessage.TOKEN_EXPIRED, null));
			case "TOKEN_INVALID" -> ResponseEntity.badRequest().body(new ApiResponse(FeedBackMessage.TOKEN_INVALID, null));
			default -> ResponseEntity.internalServerError().body(new ApiResponse(FeedBackMessage.SERVER_ERROR, null));
		};
	}
	
	@PostMapping(UrlMapping.REQUEST_PASSWORD_RESET)
	public ResponseEntity<ApiResponse> requestPasswordReset(@RequestBody Map<String, String> requestBody) {
		String email = requestBody.get("email");
		if (email == null || email.trim().isEmpty()) {
			return ResponseEntity.badRequest().body(new ApiResponse(FeedBackMessage.INVALID_EMAIL, null));
		}
		try {
			passwordResetService.requestPasswordReset(email);
			return ResponseEntity.ok(new ApiResponse(FeedBackMessage.PASSWORD_RESET_EMAIL_SENT, null));
		} catch (ResourceNotFoundException e) {
			return ResponseEntity.badRequest().body(new ApiResponse(e.getMessage(), null));
		} catch (Exception e) {
			return ResponseEntity.internalServerError().body(new ApiResponse(e.getMessage(), null));
		}
	}
	
	@PostMapping(UrlMapping.RESET_PASSWORD)
	public ResponseEntity<ApiResponse> resetPassword(@RequestBody PasswordResetRequest request) {
		String token = request.getToken();
		String newPassword = request.getNewPassword();
		if (token == null || token.trim().isEmpty() || newPassword == null || newPassword.trim().isEmpty()) {
			return ResponseEntity.badRequest().body(new ApiResponse(FeedBackMessage.MISSING_PASSWORD, null));
		}
		Optional<User> userOpt = passwordResetService.findUserByPasswordResetToken(token);
		if (userOpt.isEmpty()) {
			return ResponseEntity.badRequest().body(new ApiResponse(FeedBackMessage.INVALID_RESET_TOKEN, null));
		}
		User user = userOpt.get();
		String message = passwordResetService.resetPassword(newPassword, user);
		return ResponseEntity.ok(new ApiResponse(message, null));
	}
	
	@PutMapping(UrlMapping.RESEND_VERIFICATION_TOKEN)
	public ResponseEntity<ApiResponse> resendVerificationToken(@RequestParam("token") String oldToken) {
		try {
			VerificationToken verificationToken = verificationTokenService.generateNewVerificationToken(oldToken);
			User user = verificationToken.getUser();
			publisher.publishEvent(new RegistrationCompleteEvent(user));
			return ResponseEntity.ok(new ApiResponse(FeedBackMessage.NEW_VERIFICATION_TOKEN_SENT, null));
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(new ApiResponse(e.getMessage(), null));
		}
	} 
}
