package com.rafetcelik.universal_pet_care.dto;

import lombok.Data;

@Data
public class ReviewDto {
	private Long id;
	
	private String feedback;
	
	private int rating;
	
	private Long veterinarianId;
	
	private String veterinarianName;
	
	private Long patientId;
	
	private String patientName;
	
	private byte[] patientPhoto;
	
	private byte[] veterinarianPhoto;
}
