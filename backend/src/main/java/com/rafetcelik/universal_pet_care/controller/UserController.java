package com.rafetcelik.universal_pet_care.controller;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import static org.springframework.http.HttpStatus.CONFLICT;
import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;
import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.HttpStatus.FOUND;

import java.util.List;
import java.util.Map;

import com.rafetcelik.universal_pet_care.dto.EntityConverter;
import com.rafetcelik.universal_pet_care.dto.UserDto;
import com.rafetcelik.universal_pet_care.event.RegistrationCompleteEvent;
import com.rafetcelik.universal_pet_care.exception.ResourceNotFoundException;
import com.rafetcelik.universal_pet_care.exception.AlreadyExistsException;
import com.rafetcelik.universal_pet_care.model.User;
import com.rafetcelik.universal_pet_care.request.ChangePasswordRequest;
import com.rafetcelik.universal_pet_care.request.RegistirationRequest;
import com.rafetcelik.universal_pet_care.request.UserUpdateRequest;
import com.rafetcelik.universal_pet_care.response.ApiResponse;
import com.rafetcelik.universal_pet_care.service.password.IChangePasswordService;
import com.rafetcelik.universal_pet_care.service.user.IUserService;
import com.rafetcelik.universal_pet_care.utils.FeedBackMessage;
import com.rafetcelik.universal_pet_care.utils.UrlMapping;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RequestMapping(UrlMapping.USERS)
@RestController
public class UserController {
	private final IUserService userService;
	
	private final EntityConverter<User, UserDto> entityConverter;
	
	private final IChangePasswordService changePasswordService;
	
	private final ApplicationEventPublisher publisher;
	
	@PostMapping(UrlMapping.REGISTER_USER)
	public ResponseEntity<ApiResponse> register(@RequestBody RegistirationRequest request) {
		try {
			User user = userService.register(request);
			publisher.publishEvent(new RegistrationCompleteEvent(user));
			UserDto registeredUser = entityConverter.mapEntityToDto(user, UserDto.class);
			return ResponseEntity.ok(new ApiResponse(FeedBackMessage.CREATE_USER_SUCCESS, registeredUser));
		} catch (AlreadyExistsException e) {
			return ResponseEntity.status(CONFLICT).body(new ApiResponse(e.getMessage(), null));
		} catch (Exception e) {
			return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse("Kullanıcı eklenirken bir hata oluştu.", null));	
		}
	}
	
	@PutMapping(UrlMapping.UPDATE_USER)
	public ResponseEntity<ApiResponse> updateUser(@PathVariable Long userId, @RequestBody UserUpdateRequest request) {
		try {
			User user = userService.updateUser(userId, request);
			UserDto updatedUser = entityConverter.mapEntityToDto(user, UserDto.class);
			return ResponseEntity.ok(new ApiResponse(FeedBackMessage.USER_UPDATE_SUCCESS, updatedUser));
		} catch (ResourceNotFoundException e) {
			return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
		} catch (Exception e) {
			return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse(e.getMessage(), null));
		}
	}
	
	@GetMapping(UrlMapping.GET_USER_BY_ID)
	public ResponseEntity<ApiResponse> findById(@PathVariable Long userId) {
		try {
			UserDto userDto = userService.getUserWithDetails(userId);
			return ResponseEntity.ok(new ApiResponse(FeedBackMessage.USER_FOUND, userDto));
		} catch (ResourceNotFoundException e) {
			return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
		} catch (Exception e) {
			return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse(e.getMessage(), null));
		}
	}
	
	@DeleteMapping(UrlMapping.DELETE_USER_BY_ID)
	public ResponseEntity<ApiResponse> deleteUserById(@PathVariable Long userId) {
		try {
			userService.deleteUser(userId);
			return ResponseEntity.ok(new ApiResponse(FeedBackMessage.DELETE_USER_SUCCESS, null));
		} catch (ResourceNotFoundException e) {
			return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
		} catch (Exception e) {
			return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse(e.getMessage(), null));
		}
	}
	
	@GetMapping(UrlMapping.GET_ALL_USERS)
	public ResponseEntity<ApiResponse> getAllUsers() {
		try {
			List<UserDto> users = userService.getAllUsers();
			return ResponseEntity.status(FOUND).body(new ApiResponse(FeedBackMessage.USER_FOUND, users));
		} catch (ResourceNotFoundException e) {
			return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
		} catch (Exception e) {
			return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse(e.getMessage(), null));
		}
	}
	
	@PutMapping(UrlMapping.CHANGE_PASSWORD)
	public ResponseEntity<ApiResponse> changePassword(@PathVariable Long userId,
													  @RequestBody ChangePasswordRequest request) {
		try {
			changePasswordService.changePassword(userId, request);
			return ResponseEntity.ok(new ApiResponse(FeedBackMessage.CHANGE_PASSWORD_SUCCESS, request));
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(new ApiResponse(e.getMessage(), null));
		} catch (ResourceNotFoundException e) {
			return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
		} catch (Exception e) {
			return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse(e.getMessage(), null));
		}
	}
	
	@GetMapping(UrlMapping.COUNT_VETERINARIANS)
	public long countVeterinarians() {
		return userService.countVeterinarians();
	}
	
	@GetMapping(UrlMapping.COUNT_PATIENTS)
	public long countPatients() {
		return userService.countPatients();
	}
	
	@GetMapping(UrlMapping.COUNT_ALL_USERS)
	public long countAllUsers() {
		return userService.countAllUsers();
	}
	
	@GetMapping(UrlMapping.AGGREGATE_USERS_BY_MONTH_AND_TYPE)
	public ResponseEntity<ApiResponse> aggregeteUsersByMonthAndType() {
		try {
			Map<String, Map<String, Long>> aggregatedResult = userService.aggregateUsersByMonthAbdType();
			return ResponseEntity.ok(new ApiResponse(FeedBackMessage.RESOURCE_FOUND, aggregatedResult));
		} catch (Exception e) {
			return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse(e.getMessage(), null));
		}
	}
	
	@GetMapping(UrlMapping.AGGREGATE_USERS_BY_ENABLED_STATUS)
	public ResponseEntity<ApiResponse> aggregeteUsersByEnabledStatus() {
		try {
			Map<String, Map<String, Long>> aggregatedResult = userService.aggregateUsersByEnabledStatus();
			return ResponseEntity.ok(new ApiResponse(FeedBackMessage.RESOURCE_FOUND, aggregatedResult));
		} catch (Exception e) {
			return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse(e.getMessage(), null));
		}
	}
	
	@PutMapping(UrlMapping.LOCK_USER_ACCOUNT)
	public ResponseEntity<ApiResponse> lockUserAccount(@PathVariable Long userId) {
		try {
			userService.lockUserAccount(userId);
			return ResponseEntity.ok(new ApiResponse(FeedBackMessage.ACCOUNT_LOCKED, null));
		} catch (Exception e) {
			return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse(e.getMessage(), null));
		}
	}
	
	@PutMapping(UrlMapping.UNLOCK_USER_ACCOUNT)
	public ResponseEntity<ApiResponse> unlockUserAccount(@PathVariable Long userId) {
		try {
			userService.unlockUserAccount(userId);
			return ResponseEntity.ok(new ApiResponse(FeedBackMessage.ACCOUNT_UNLOCKED, null));
		} catch (Exception e) {
			return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse(e.getMessage(), null));
		}
	}
}
