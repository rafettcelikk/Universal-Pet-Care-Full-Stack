package com.rafetcelik.universal_pet_care.factory;

import org.springframework.stereotype.Service;

import com.rafetcelik.universal_pet_care.model.Admin;
import com.rafetcelik.universal_pet_care.repository.AdminRepository;
import com.rafetcelik.universal_pet_care.request.RegistirationRequest;
import com.rafetcelik.universal_pet_care.service.role.IRoleService;
import com.rafetcelik.universal_pet_care.service.user.UserAttributesMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminFactory {
	private final AdminRepository adminRepository;
	
	private final UserAttributesMapper userAttributesMapper;
	
	private final IRoleService roleService;

	public Admin createAdmin(RegistirationRequest request) {
		Admin admin = new Admin();
		admin.setRoles(roleService.setUserRole("ADMIN"));
		userAttributesMapper.setCommonAttributes(request, admin);
		return adminRepository.save(admin);
	}

}
