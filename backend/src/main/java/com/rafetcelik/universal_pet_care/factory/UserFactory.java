package com.rafetcelik.universal_pet_care.factory;

import com.rafetcelik.universal_pet_care.model.User;
import com.rafetcelik.universal_pet_care.request.RegistirationRequest;

public interface UserFactory {
	public User createUser(RegistirationRequest request);
}
