package com.rafetcelik.universal_pet_care.request;

import java.util.Date;

import com.rafetcelik.universal_pet_care.model.User;

import lombok.Data;

@Data
public class VerificationTokenRequest {
	
	private String token;

	private Date expirationDate;
	
	private User user;
}
