package com.rafetcelik.universal_pet_care.service.pet;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.rafetcelik.universal_pet_care.exception.ResourceNotFoundException;
import com.rafetcelik.universal_pet_care.model.Appointment;
import com.rafetcelik.universal_pet_care.model.Pet;
import com.rafetcelik.universal_pet_care.repository.AppointmentRepository;
import com.rafetcelik.universal_pet_care.repository.PetRepository;
import com.rafetcelik.universal_pet_care.utils.FeedBackMessage;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PetService implements IPetService{
	private final PetRepository petRepository;
	
	private final AppointmentRepository appointmentRepository;
	
	@Override
	public List<Pet> savePetsForAppointment(List<Pet> pets) {
        return petRepository.saveAll(pets);
    }
	
	@Override
	public List<Pet> savePetsForAppointment(Long appointmentId, List<Pet> pets) {
        Appointment appointment = appointmentRepository.findById(appointmentId).orElseThrow(null);
        return pets.stream()
                .peek(pet -> pet.setAppointment(appointment))
                .map(petRepository::save)
                .collect(Collectors.toList());
    }

	@Override
	public Pet updatePet(Long id, Pet pet) {
		Pet existingPet = getPetById(id);
		existingPet.setName(pet.getName());
		existingPet.setAge(pet.getAge());
		existingPet.setType(pet.getType());
		existingPet.setColor(pet.getColor());
		existingPet.setBreed(pet.getBreed());
		existingPet.setAge(pet.getAge());
		return petRepository.save(existingPet);
	}

	@Override
	public void deletePet(Long id) {
		petRepository.findById(id)
			.ifPresentOrElse(petRepository :: delete,
					() -> {
						throw new ResourceNotFoundException(FeedBackMessage.RESOURCE_NOT_FOUND);
						});
		
	}

	@Override
	public Pet getPetById(Long id) {
		return petRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException(FeedBackMessage.RESOURCE_NOT_FOUND));
	}
	
	@Override
	public List<String> getPetTypes() {
		return petRepository.getDistinctPetTypes();
	}
	
	@Override
	public List<String> getPetColors() {
		return petRepository.getDistinctPetColors();
	}
	
	@Override
	public List<String> getPetBreeds(String petType) {
		return petRepository.getDistinctPetBreedsByPetType(petType);
	}

	@Override
	public Pet savePet(Long appointmentId, Pet pet) {
		// TODO Auto-generated method stub
		return null;
	}
}
