package com.rafetcelik.universal_pet_care.service.user;

import org.springframework.stereotype.Component;

import com.rafetcelik.universal_pet_care.model.User;
import com.rafetcelik.universal_pet_care.request.RegistirationRequest;

@Component
public class UserAttributesMapper {
	public void setCommonAttributes(RegistirationRequest source, User target) {
		target.setFirstName(source.getFirstName());
		target.setLastName(source.getLastName());
		target.setGender(source.getGender());
		target.setPhoneNumber(source.getPhoneNumber());
		target.setEmail(source.getEmail());
		target.setPassword(source.getPassword());
		target.setEnabled(source.isEnabled());
		target.setUserType(source.getUserType());
	}
}
