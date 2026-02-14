package com.rafetcelik.universal_pet_care.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ApiResponse {
	private String message;
	
	private Object data;
}
