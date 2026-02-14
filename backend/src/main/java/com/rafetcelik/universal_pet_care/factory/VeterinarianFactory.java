package com.rafetcelik.universal_pet_care.factory;

import org.springframework.stereotype.Service;

import com.rafetcelik.universal_pet_care.model.Veterinarian;
import com.rafetcelik.universal_pet_care.repository.VeterinarianRepository;
import com.rafetcelik.universal_pet_care.request.RegistirationRequest;
import com.rafetcelik.universal_pet_care.service.role.IRoleService;
import com.rafetcelik.universal_pet_care.service.user.UserAttributesMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VeterinarianFactory {
	private final VeterinarianRepository veterinarianRepository;
	
	private final UserAttributesMapper userAttributesMapper;
	
	private final IRoleService roleService;

	public Veterinarian createVeterinarian(RegistirationRequest request) {
		Veterinarian veterinarian = new Veterinarian();
		veterinarian.setRoles(roleService.setUserRole("VET"));
		userAttributesMapper.setCommonAttributes(request, veterinarian);
		veterinarian.setSpecialization(request.getSpecialization());
		return veterinarianRepository.save(veterinarian);
	}

}
