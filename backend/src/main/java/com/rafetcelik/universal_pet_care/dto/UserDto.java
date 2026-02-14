package com.rafetcelik.universal_pet_care.dto;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import lombok.Data;

@Data
@JsonPropertyOrder({ "id", "firstName", "lastName", "email", "phoneNumber", "gender", "userType", "enabled", "specialization" })
public class UserDto {
	private Long id;
	
	private String firstName;
	
	private String lastName;
	
	private String gender;
	
	private String phoneNumber;
	
	private String email;
	
	private String userType;
	
	private boolean isEnabled;
	
	private LocalDate createdAt;
	
	private String specialization;
	
	private List<AppointmentDto> appointments;
	
	private List<ReviewDto> reviews;
	
	private Long photoId;
	
	private byte[] photo;
	
	private double averageRating;
	
	private Set<String> roles;
	
	private Long totalReviewers;
	
}
