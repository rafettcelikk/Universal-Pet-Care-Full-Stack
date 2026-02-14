package com.rafetcelik.universal_pet_care.controller;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;

import com.rafetcelik.universal_pet_care.dto.UserDto;
import com.rafetcelik.universal_pet_care.exception.ResourceNotFoundException;
import com.rafetcelik.universal_pet_care.response.ApiResponse;
import com.rafetcelik.universal_pet_care.service.veterinarian.IVeterinarianService;
import com.rafetcelik.universal_pet_care.utils.FeedBackMessage;
import com.rafetcelik.universal_pet_care.utils.UrlMapping;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(UrlMapping.VETERINARIANS)
public class VeterinarianController {
	private final IVeterinarianService veterinarianService;
	
	@GetMapping(UrlMapping.GET_ALL_VETERINARIANS)
	public ResponseEntity<ApiResponse> getAllVeterinarians() {
		List<UserDto> allVeterinarians = veterinarianService.getAllVeterinariansWithDetails();
		return ResponseEntity.ok(new ApiResponse(FeedBackMessage.RESOURCE_FOUND, allVeterinarians));
	}
	
	@GetMapping(UrlMapping.SEARCH_VETERINARIAN_FOR_APPOINTMENT)
	public ResponseEntity<ApiResponse> searchVeterinariansForAppointment(
			@RequestParam(required = false) LocalDate date,
			@RequestParam(required = false) LocalTime time,
			@RequestParam String specialization) {
		try {
			List<UserDto> availableVeterinarians = veterinarianService.findAvailableVeterinariansForAppointment(specialization, date, time);
			if (availableVeterinarians.isEmpty()) {
				return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(FeedBackMessage.NOT_VETS_AVAILABLE, null));
			}
			return ResponseEntity.ok(new ApiResponse(FeedBackMessage.RESOURCE_FOUND, availableVeterinarians));
		} catch (ResourceNotFoundException e) {
			return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
		}
	}
	
	@GetMapping(UrlMapping.GET_ALL_SPECIALIZATIONS)
	public ResponseEntity<ApiResponse> getAllSpecializations() {
		try {
			List<String> specializations = veterinarianService.getAllSpecializations();
			return ResponseEntity.ok(new ApiResponse(FeedBackMessage.RESOURCE_FOUND, specializations));
		} catch (Exception e) {
			return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse(e.getMessage(), null));
		}
	}
	
	@GetMapping(UrlMapping.AGGREGATE_VETS_BY_SPECIALIZATION)
	public ResponseEntity<List<Map<String, Object>>> aggregateVeterinariansBySpecialization() {
		List<Map<String, Object>> aggregationResult = veterinarianService.aggregateVeterinarianBySpecialization();
		return ResponseEntity.ok(aggregationResult);
	}
}
