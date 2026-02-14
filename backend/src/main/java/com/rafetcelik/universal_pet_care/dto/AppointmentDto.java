package com.rafetcelik.universal_pet_care.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.rafetcelik.universal_pet_care.enums.AppointmentStatus;

import lombok.Data;

@Data
public class AppointmentDto {
	private Long id;
	
	private LocalDate appointmentDate;
	
	private LocalTime appointmentTime;
	
	private LocalDate createdAt;
	
	private String reason;
	
	private AppointmentStatus status;
	
	private String appointmentNo;
	
	@JsonIgnoreProperties("appointments")
	private UserDto patient;
	
	@JsonIgnoreProperties("appointments")
	private UserDto veterinarian;
	
	private List<PetDto> pets;
}
