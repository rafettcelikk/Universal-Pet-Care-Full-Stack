package com.rafetcelik.universal_pet_care.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;
import static org.springframework.http.HttpStatus.NOT_FOUND;

import com.rafetcelik.universal_pet_care.exception.ResourceNotFoundException;
import com.rafetcelik.universal_pet_care.model.Pet;
import com.rafetcelik.universal_pet_care.response.ApiResponse;
import com.rafetcelik.universal_pet_care.service.pet.IPetService;
import com.rafetcelik.universal_pet_care.utils.FeedBackMessage;
import com.rafetcelik.universal_pet_care.utils.UrlMapping;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(UrlMapping.PETS)
public class PetController {
	private final IPetService petService;
	
	@PostMapping(UrlMapping.SAVE_PETS_FOR_APPOINTMENT)
	public ResponseEntity<ApiResponse> savePets(
	    @PathVariable Long appointmentId,
	    @RequestBody List<Pet> pets) {
	    
	    try {
	        List<Pet> savedPets = petService.savePetsForAppointment(appointmentId, pets);
	        return ResponseEntity.ok(new ApiResponse(FeedBackMessage.PET_ADDED_SUCCESS, savedPets));
	    } catch (RuntimeException e) {
	        return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse(e.getMessage(), null));
	    }
	}
	
	@PostMapping(UrlMapping.SAVE_PET_FOR_APPOINTMENT_WITHOUT_ID)
	public ResponseEntity<ApiResponse> savePets(List<Pet> pets) {
		try {
			List<Pet> savedPets = petService.savePetsForAppointment(pets);
			return ResponseEntity.ok(new ApiResponse(FeedBackMessage.PET_ADDED_SUCCESS, savedPets));
		} catch (RuntimeException e) {
			return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse(e.getMessage(), null));
		}
	}
	
	@GetMapping(UrlMapping.GET_PET_BY_ID)
	public ResponseEntity<ApiResponse> getPetById(@PathVariable Long id) {
		try {
			Pet pet = petService.getPetById(id);
			return ResponseEntity.ok(new ApiResponse(FeedBackMessage.PET_FOUND, pet));
		} catch (ResourceNotFoundException e) {
			return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
		} 
		catch (Exception e) {
			return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse(e.getMessage(), null));
		}
	}
	
	@DeleteMapping(UrlMapping.DELETE_PET_BY_ID)
	public ResponseEntity<ApiResponse> deletePetById(@PathVariable Long id) {
		try {
			petService.deletePet(id);
			return ResponseEntity.ok(new ApiResponse(FeedBackMessage.PET_DELETE_SUCCESS, null));
		} catch (ResourceNotFoundException e) {
			return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
		} 
		catch (Exception e) {
			return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse(e.getMessage(), null));
		}
	}
	
	@PutMapping(UrlMapping.UPDATE_PET)
	public ResponseEntity<ApiResponse> updatePet(@PathVariable Long id, @RequestBody Pet pet) {
		try {
			Pet updatedPet = petService.updatePet(id, pet);
			return ResponseEntity.ok(new ApiResponse(FeedBackMessage.PET_UPDATE_SUCCESS, updatedPet));
		} catch (ResourceNotFoundException e) {
			return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
		} 
		catch (Exception e) {
			return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse(e.getMessage(), null));
		}
	}
	
	@GetMapping(UrlMapping.GET_PET_TYPES)
	public ResponseEntity<ApiResponse> getAllPetTypes() {
		return ResponseEntity.ok(new ApiResponse(FeedBackMessage.RESOURCE_FOUND, petService.getPetTypes()));
	}
	
	@GetMapping(UrlMapping.GET_PET_COLORS)
	public ResponseEntity<ApiResponse> getAllPetColors() {
		return ResponseEntity.ok(new ApiResponse(FeedBackMessage.RESOURCE_FOUND, petService.getPetColors()));
	}
	
	@GetMapping(UrlMapping.GET_PET_BREEDS)
	public ResponseEntity<ApiResponse> getAllPetBreeds(@RequestParam String petType) {
		return ResponseEntity.ok(new ApiResponse(FeedBackMessage.RESOURCE_FOUND, petService.getPetBreeds(petType)));
	}
	
}
