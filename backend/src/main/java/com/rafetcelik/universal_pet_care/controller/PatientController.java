package com.rafetcelik.universal_pet_care.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;

import com.rafetcelik.universal_pet_care.dto.UserDto;
import com.rafetcelik.universal_pet_care.response.ApiResponse;
import com.rafetcelik.universal_pet_care.service.patient.IPatientService;
import com.rafetcelik.universal_pet_care.utils.FeedBackMessage;
import com.rafetcelik.universal_pet_care.utils.UrlMapping;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RequestMapping(UrlMapping.PATIENTS)
@RestController
public class PatientController {
	
	private final IPatientService patientService;
	
	@GetMapping(UrlMapping.GET_ALL_PATIENTS)
	public ResponseEntity<ApiResponse> getAllPatients() {
		try {
			List<UserDto> patientts = patientService.getAllPatients();
			return ResponseEntity.ok(new ApiResponse(FeedBackMessage.RESOURCE_FOUND, patientts));
		} catch (Exception e) {
			return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse(e.getMessage(), null));
		}
	}
}
