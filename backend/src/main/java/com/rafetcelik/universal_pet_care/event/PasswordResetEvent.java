package com.rafetcelik.universal_pet_care.event;

import org.springframework.context.ApplicationEvent;

import com.rafetcelik.universal_pet_care.model.User;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PasswordResetEvent extends ApplicationEvent {
	
	private final User user;
	
	public PasswordResetEvent(Object source, User user) {
		super(source);
		this.user = user;
	}
}
