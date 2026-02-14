package com.rafetcelik.universal_pet_care.service.veterinarian;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

import com.rafetcelik.universal_pet_care.dto.UserDto;
import com.rafetcelik.universal_pet_care.model.Veterinarian;

public interface IVeterinarianService {

	List<UserDto> getAllVeterinariansWithDetails();

	List<UserDto> findAvailableVeterinariansForAppointment(String specialization, LocalDate date, LocalTime time);

	List<Veterinarian> getVeterinariansBySpecialization(String specialization);

	List<String> getAllSpecializations();

	List<Map<String, Object>> aggregateVeterinarianBySpecialization();

}
