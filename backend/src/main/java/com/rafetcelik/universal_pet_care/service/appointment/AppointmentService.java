package com.rafetcelik.universal_pet_care.service.appointment;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.ResourceAccessException;

import com.rafetcelik.universal_pet_care.dto.AppointmentDto;
import com.rafetcelik.universal_pet_care.dto.EntityConverter;
import com.rafetcelik.universal_pet_care.dto.PetDto;
import com.rafetcelik.universal_pet_care.enums.AppointmentStatus;
import com.rafetcelik.universal_pet_care.exception.ResourceNotFoundException;
import com.rafetcelik.universal_pet_care.model.Appointment;
import com.rafetcelik.universal_pet_care.model.Pet;
import com.rafetcelik.universal_pet_care.model.User;
import com.rafetcelik.universal_pet_care.repository.AppointmentRepository;
import com.rafetcelik.universal_pet_care.repository.UserRepository;
import com.rafetcelik.universal_pet_care.request.AppointmentUpdateRequest;
import com.rafetcelik.universal_pet_care.request.BookAppointmentRequest;
import com.rafetcelik.universal_pet_care.service.pet.PetService;
import com.rafetcelik.universal_pet_care.utils.FeedBackMessage;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AppointmentService implements IAppointmentService{
	private final AppointmentRepository appointmentRepository;
	
	private final UserRepository userRepository;
	
	private final PetService petService;
	
	private final EntityConverter<Appointment, AppointmentDto> entityConverter;
	
	private final EntityConverter<Pet, PetDto> petEntityConverter;
	
	@Transactional
	@Override
	public Appointment createAppointment(BookAppointmentRequest request, Long senderId, Long recipientId) {
		Optional<User> sender = userRepository.findById(senderId);
		Optional<User> recipient = userRepository.findById(recipientId);
		if (sender.isPresent() && recipient.isPresent()) {
			Appointment appointment = request.getAppointment();
			List<Pet> pets = request.getPets();
			pets.forEach(pet -> pet.setAppointment(appointment));
			List<Pet> savedPets = petService.savePetsForAppointment(pets);
			appointment.setPets(savedPets);
			appointment.addPatient(sender.get());
			appointment.addVeterinarian(recipient.get());
			appointment.setAppointmentNo();
			appointment.setStatus(AppointmentStatus.WAITING_FOR_APPROVAL);
			return appointmentRepository.save(appointment);
		}
		throw new ResourceAccessException(FeedBackMessage.SENDER_RECIPIENT_NOT_FOUND);
	}

	@Override
	public List<Appointment> getAllAppointments() {
		return appointmentRepository.findAll();
	}

	@Override
	public Appointment updateAppointment(Long id, AppointmentUpdateRequest request) {
		Appointment existingAppointment = getAppointmentById(id);
		if (!Objects.equals(existingAppointment.getStatus(), AppointmentStatus.WAITING_FOR_APPROVAL)) {
			throw new IllegalStateException(FeedBackMessage.ALREADY_APROVED);
		}
		existingAppointment.setAppointmentDate(LocalDate.parse(request.getAppointmentDate()));
		existingAppointment.setAppointmentTime(LocalTime.parse(request.getAppointmentTime()));
		existingAppointment.setReason(request.getReason());
		return appointmentRepository.save(existingAppointment);
	}

	@Override
	public void deleteAppointment(Long id) {
		appointmentRepository.findById(id)
			.ifPresentOrElse(appointmentRepository :: delete, () -> {
				throw new ResourceAccessException(FeedBackMessage.APPPOINTMENT_NOT_FOUND);
			});
		
	}

	@Override
	public Appointment getAppointmentById(Long id) {
		return appointmentRepository.findById(id)
				.orElseThrow(() -> new ResourceAccessException(FeedBackMessage.APPPOINTMENT_NOT_FOUND));
	}

	@Override
	public Appointment getAppointmentByNo(String appointmentNo) {
		return appointmentRepository.findByAppointmentNo(appointmentNo);
	}
	
	@Override
	public List<AppointmentDto> getUserAppointments(Long userId) {
		List<Appointment> appointments = appointmentRepository.findAllByUserId(userId);
		return appointments.stream()
				.map(appointment -> {
					AppointmentDto appointmentDto = entityConverter.mapEntityToDto(appointment, AppointmentDto.class);
					List<PetDto> petDtos = appointment.getPets().stream()
							.map(pet -> petEntityConverter.mapEntityToDto(pet, PetDto.class))
							.toList();
					appointmentDto.setPets(petDtos);
					return appointmentDto;
				}).toList();
	}
	
	@Override
	public Appointment cancelAppointment(Long appointmentId) {
		return appointmentRepository.findById(appointmentId)
				.filter(appointment -> appointment.getStatus().equals(AppointmentStatus.WAITING_FOR_APPROVAL))
				.map(appointment -> {appointment.setStatus(AppointmentStatus.CANCELLED);
					return appointmentRepository.saveAndFlush(appointment);
				}).orElseThrow(() -> new IllegalStateException(FeedBackMessage.CANNOT_CANCEL_APPOINTMENT));
	}
	
	@Override
	public Appointment approveAppointment(Long appointmentId) {
		return appointmentRepository.findById(appointmentId)
				.filter(appointment -> appointment.getStatus().equals(AppointmentStatus.WAITING_FOR_APPROVAL))
				.map(appointment -> {appointment.setStatus(AppointmentStatus.APPROVED);
					return appointmentRepository.saveAndFlush(appointment);
				}).orElseThrow(() -> new IllegalStateException(FeedBackMessage.APPOINTMENT_ALREADY_APPROVED));
	}
	
	@Override
	public Appointment declineAppointment(Long appointmentId) {
		return appointmentRepository.findById(appointmentId)
				.filter(appointment -> appointment.getStatus().equals(AppointmentStatus.WAITING_FOR_APPROVAL))
				.map(appointment -> {appointment.setStatus(AppointmentStatus.NOT_APPROVED);
					return appointmentRepository.saveAndFlush(appointment);
				}).orElseThrow(() -> new ResourceNotFoundException(FeedBackMessage.APPPOINTMENT_NOT_FOUND));
	}
	
	@Override
	public long countAppointments() {
		return appointmentRepository.count();
	}
	
	@Override
	public List<Map<String, Object>> getAppointmentSummary() {
		return getAllAppointments()
				.stream()
				.collect(Collectors.groupingBy(Appointment :: getStatus, Collectors.counting()))
				.entrySet()
				.stream()
				.filter(entry -> entry.getValue() > 0)
				.map(entry -> createStatusSummaryMap(entry.getKey(), entry.getValue()))
				.collect(Collectors.toList());
	}
	
	private Map<String, Object> createStatusSummaryMap(AppointmentStatus status, Long value) {
		Map<String, Object> summaryMap = new HashMap<>();
		summaryMap.put("name", status.name());
		summaryMap.put("value", value);
		return summaryMap;
	}
	
	@Override
	public List<Long> getAppointmentIds() {
		List<Appointment> appointments = appointmentRepository.findAll();
		return appointments.stream()
				.map(Appointment :: getId)
				.collect(Collectors.toList());
	}
	
	@Override
	public void setAppointmentStatus(Long appointmentId) {
	    Appointment appointment = getAppointmentById(appointmentId);
	    LocalDate currentDate = LocalDate.now();
	    LocalTime currentTime = LocalTime.now();
	    LocalTime appointmentEndTime = appointment.getAppointmentTime().plusMinutes(30);

	    boolean isPast = currentDate.isAfter(appointment.getAppointmentDate()) 
	                  || (currentDate.equals(appointment.getAppointmentDate()) 
	                      && currentTime.isAfter(appointmentEndTime));

	    boolean isCurrent = currentDate.equals(appointment.getAppointmentDate()) 
	                     && (currentTime.isAfter(appointment.getAppointmentTime()) 
	                         && !currentTime.isAfter(appointmentEndTime));

	    if (isPast) {
	        if (appointment.getStatus() != AppointmentStatus.CANCELLED && 
	            appointment.getStatus() != AppointmentStatus.NOT_APPROVED) {
	            appointment.setStatus(AppointmentStatus.COMPLETED);
	        }
	    } else if (isCurrent) {
	        if (appointment.getStatus() == AppointmentStatus.UP_COMING || 
	            appointment.getStatus() == AppointmentStatus.APPROVED) {
	            appointment.setStatus(AppointmentStatus.ON_GOING);
	        }
	    } else {
	        if (appointment.getStatus() == AppointmentStatus.APPROVED) {
	            appointment.setStatus(AppointmentStatus.UP_COMING);
	        }
	    }

	    appointmentRepository.save(appointment);
	}
	
}
