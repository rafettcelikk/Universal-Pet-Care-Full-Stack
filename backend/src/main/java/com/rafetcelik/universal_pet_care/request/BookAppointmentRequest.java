package com.rafetcelik.universal_pet_care.request;

import java.util.List;

import com.rafetcelik.universal_pet_care.model.Appointment;
import com.rafetcelik.universal_pet_care.model.Pet;
import lombok.Data;

@Data
public class BookAppointmentRequest {
	private Appointment appointment;
	
	private List<Pet> pets;
}
