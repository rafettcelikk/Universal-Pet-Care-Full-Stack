package com.rafetcelik.universal_pet_care.factory;

import org.springframework.stereotype.Service;

import com.rafetcelik.universal_pet_care.model.Patient;
import com.rafetcelik.universal_pet_care.repository.PatientRepository;
import com.rafetcelik.universal_pet_care.request.RegistirationRequest;
import com.rafetcelik.universal_pet_care.service.role.IRoleService;
import com.rafetcelik.universal_pet_care.service.user.UserAttributesMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PatientFactory {
	private final PatientRepository patientRepository;
	
	private final UserAttributesMapper userAttributesMapper;
	
	private final IRoleService roleService;

	public Patient createPatient(RegistirationRequest request) {
		Patient patient = new Patient();
		patient.setRoles(roleService.setUserRole("PATIENT"));	
		userAttributesMapper.setCommonAttributes(request, patient);
		return patientRepository.save(patient);
	}

}
