package com.rafetcelik.universal_pet_care.request;

import lombok.Data;

@Data
public class ReviewUpdateRequest {
	private String feedback;
	
	private int rating;
}
