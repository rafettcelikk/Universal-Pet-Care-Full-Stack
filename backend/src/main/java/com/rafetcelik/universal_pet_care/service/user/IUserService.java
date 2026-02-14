package com.rafetcelik.universal_pet_care.service.user;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

import com.rafetcelik.universal_pet_care.dto.UserDto;
import com.rafetcelik.universal_pet_care.model.User;
import com.rafetcelik.universal_pet_care.request.RegistirationRequest;
import com.rafetcelik.universal_pet_care.request.UserUpdateRequest;

public interface IUserService {
	User register(RegistirationRequest request);

	User updateUser(Long userId, UserUpdateRequest request);

	User findById(Long userId);

	void deleteUser(Long userId);

	List<UserDto> getAllUsers();

	UserDto getUserWithDetails(Long userId) throws SQLException;

	long countVeterinarians();

	long countPatients();

	long countAllUsers();

	Map<String, Map<String, Long>> aggregateUsersByMonthAbdType();

	Map<String, Map<String, Long>> aggregateUsersByEnabledStatus();

	void lockUserAccount(Long userId);

	void unlockUserAccount(Long userId);
}
