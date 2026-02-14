package com.rafetcelik.universal_pet_care.service.role;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.rafetcelik.universal_pet_care.exception.ResourceNotFoundException;
import com.rafetcelik.universal_pet_care.model.Role;
import com.rafetcelik.universal_pet_care.repository.RoleRepository;
import com.rafetcelik.universal_pet_care.utils.FeedBackMessage;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RoleService implements IRoleService{
	
	private final RoleRepository roleRepository;

	@Override
	public List<Role> getAllRoles() {
		return roleRepository.findAll();
	}

	@Override
	public Role getRoleById(Long id) {
		return roleRepository.findById(id).orElse(null);
	}

	@Override
	public Role getRoleByName(String roleName) {
		return roleRepository.findByName(roleName).orElse(null);
	}

	@Override
	public void saveRole(Role role) {
		roleRepository.save(role);
	}

	@Override
	public Set<Role> setUserRole(String userType) {
		Set<Role> userRoles = new HashSet<>();
		roleRepository.findByName("ROLE_" + userType)
			.ifPresentOrElse(userRoles :: add, () -> {
				throw new ResourceNotFoundException(FeedBackMessage.ROLE_NOT_FOUND + userType);
			});
		return userRoles;
	}

		
}
