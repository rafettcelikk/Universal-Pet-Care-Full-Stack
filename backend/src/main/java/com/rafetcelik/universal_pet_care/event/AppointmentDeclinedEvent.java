package com.rafetcelik.universal_pet_care.event;

import org.springframework.context.ApplicationEvent;

import com.rafetcelik.universal_pet_care.model.Appointment;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AppointmentDeclinedEvent extends ApplicationEvent{
	
	private final Appointment appointment;
	
	public AppointmentDeclinedEvent(Appointment appointment) {
		super(appointment);
		this.appointment = appointment;
	}
}
