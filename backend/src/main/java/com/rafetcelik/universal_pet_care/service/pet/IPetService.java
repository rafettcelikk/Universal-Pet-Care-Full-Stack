package com.rafetcelik.universal_pet_care.service.pet;

import java.util.List;

import com.rafetcelik.universal_pet_care.model.Pet;

public interface IPetService {
	List<Pet> savePetsForAppointment(List<Pet> pets);
	
	List<Pet> savePetsForAppointment(Long appointmentId, List<Pet> pets);
	
	Pet updatePet(Long id, Pet pet);
	
	void deletePet(Long id);
	
	Pet getPetById(Long id);

	List<String> getPetTypes();

	List<String> getPetColors();

	List<String> getPetBreeds(String petType);

	Pet savePet(Long appointmentId, Pet pet);
}
