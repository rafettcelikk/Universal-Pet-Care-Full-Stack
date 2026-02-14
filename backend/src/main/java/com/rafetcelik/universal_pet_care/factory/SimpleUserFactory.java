package com.rafetcelik.universal_pet_care.factory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.rafetcelik.universal_pet_care.exception.AlreadyExistsException;
import com.rafetcelik.universal_pet_care.model.User;
import com.rafetcelik.universal_pet_care.repository.UserRepository;
import com.rafetcelik.universal_pet_care.request.RegistirationRequest;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Component
public class SimpleUserFactory implements UserFactory{

    private final PasswordEncoder passwordEncoder;
    
	private final UserRepository userRepository;
	
	private final PatientFactory patientFactory;
	
	private final VeterinarianFactory veterinarianFactory;
	
	private final AdminFactory adminFactory;
	


	@Override
	public User createUser(RegistirationRequest request) {
		if(userRepository.existsByEmail(request.getEmail())) {
			throw new AlreadyExistsException("Hay aksi! " + request.getEmail() + " adresiyle kayıtlı bir kullanıcı zaten mevcut.");
		}
		request.setPassword(passwordEncoder.encode(request.getPassword()));
		switch(request.getUserType()) {
			case "VET" -> {return veterinarianFactory.createVeterinarian(request);
			}
			case "PATIENT" -> {return patientFactory.createPatient(request);
			}
			case "ADMIN" -> {return adminFactory.createAdmin(request);
			}
			default -> {return null;
			}
		}
	}

}
