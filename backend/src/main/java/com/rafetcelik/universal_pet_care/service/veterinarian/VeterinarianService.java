package com.rafetcelik.universal_pet_care.service.veterinarian;

import java.sql.SQLException;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.rafetcelik.universal_pet_care.dto.EntityConverter;
import com.rafetcelik.universal_pet_care.dto.UserDto;
import com.rafetcelik.universal_pet_care.exception.ResourceNotFoundException;
import com.rafetcelik.universal_pet_care.model.Appointment;
import com.rafetcelik.universal_pet_care.model.Veterinarian;
import com.rafetcelik.universal_pet_care.repository.AppointmentRepository;
import com.rafetcelik.universal_pet_care.repository.ReviewRepository;
import com.rafetcelik.universal_pet_care.repository.VeterinarianRepository;
import com.rafetcelik.universal_pet_care.service.photo.PhotoService;
import com.rafetcelik.universal_pet_care.service.review.ReviewService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VeterinarianService implements IVeterinarianService{
	private final VeterinarianRepository veterinarianRepository;
	
	private final EntityConverter<Veterinarian, UserDto> entityConverter;
	
	private final ReviewService reviewService;
	
	private final ReviewRepository reviewRepository;
	
	private final PhotoService photoService;
	
	private final AppointmentRepository appointmentRepository;
	
	@Override
	public List<UserDto> getAllVeterinariansWithDetails() {
		List<Veterinarian> veterinarians = veterinarianRepository.findAll();
		return veterinarians.stream()
				.map(this :: mapVeterinarianToUserDto)
				.toList();
	}
	
	@Override
	public List<UserDto> findAvailableVeterinariansForAppointment(String specialization, LocalDate date, LocalTime time) {
		List<Veterinarian> filteredVeterinarians = getAvailableVeterinarians(specialization, date, time);
		return filteredVeterinarians.stream()
				.map(this :: mapVeterinarianToUserDto)
				.toList();
	}
	
	@Override
	public List<Veterinarian> getVeterinariansBySpecialization(String specialization) {
		if (!veterinarianRepository.existsBySpecialization(specialization)) {
			throw new ResourceNotFoundException(specialization + " uzmanlığına sahip veteriner bulunamadı.");
		}
		return veterinarianRepository.findBySpecialization(specialization);
	}
	
	@Override
	public List<String> getAllSpecializations() {
		return veterinarianRepository.findAllSpecializations()
				.stream()
				.distinct()
				.toList();
	}
	
	@Override
	public List<Map<String, Object>> aggregateVeterinarianBySpecialization() {
		List<Object[]> results = veterinarianRepository.countVeterinariansBySpecialization();
		return results.stream()
				.map(result -> Map.of("specialization", result[0], "count", result[1]))
				.collect(Collectors.toList());
	}
	
	private UserDto mapVeterinarianToUserDto(Veterinarian veterinarian) {
		UserDto userDto = entityConverter.mapEntityToDto(veterinarian, UserDto.class);
		double averageRating = reviewService.getAverageRatingForVeterinarian(veterinarian.getId());
		Long totalReviewer = reviewRepository.countByVeterinarianId(veterinarian.getId());
		userDto.setAverageRating(averageRating);
		userDto.setTotalReviewers(totalReviewer);
		if (veterinarian.getPhoto() != null) {
			try {
				byte[] photoBytes = photoService.getPhotoData(veterinarian.getPhoto().getId());
				userDto.setPhoto(photoBytes);
			} catch (SQLException e) {
				throw new RuntimeException(e.getMessage());
			}
		}
		return userDto;
	}
	
	private List<Veterinarian> getAvailableVeterinarians(String specialization, LocalDate date, LocalTime time) {
		List<Veterinarian> veterinarians = getVeterinariansBySpecialization(specialization);
		return veterinarians.stream()
				.filter(veterinarian -> isVetAvailable(veterinarian, date, time)).toList();
	}
	
	private boolean isVetAvailable(Veterinarian veterinarian, LocalDate requestedDate, LocalTime requestedTime) {
		if (requestedDate != null && requestedTime != null) {
			LocalTime requestedEndTime = requestedTime.plusHours(2);
			return appointmentRepository.findByVeterinarianAndAppointmentDate(veterinarian, requestedDate)
					.stream()
					.noneMatch(existingAppointment -> doesAppointmentOverLap(existingAppointment, requestedTime, requestedEndTime));
		}
		return true;
	}
	
	private boolean doesAppointmentOverLap(Appointment existingAppointment, LocalTime requestedStartTime, LocalTime requestedEndTime) {
		LocalTime existingStartTime = existingAppointment.getAppointmentTime();
		LocalTime existingEndTime = existingStartTime.plusHours(2);
		LocalTime unavailableStartTime = existingStartTime.minusHours(1);
		LocalTime unavailableEndTime = existingEndTime.plusMinutes(170);
		return !requestedStartTime.isBefore(unavailableStartTime) && !requestedEndTime.isAfter(unavailableEndTime);
	}
}
