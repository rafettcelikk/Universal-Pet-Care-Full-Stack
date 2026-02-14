package com.rafetcelik.universal_pet_care.request;

import lombok.Data;

@Data
public class RegistirationRequest {
	private Long id;
	
	private String firstName;
	
	private String lastName;
	
	private String gender;
	
	private String phoneNumber;
	
	private String email;
	
	private String password;
	
	private String userType;
	
	private boolean isEnabled;
	
	private String specialization;
}
