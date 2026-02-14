package com.rafetcelik.universal_pet_care.service.patient;

import java.util.List;

import org.springframework.stereotype.Service;

import com.rafetcelik.universal_pet_care.dto.EntityConverter;
import com.rafetcelik.universal_pet_care.dto.UserDto;
import com.rafetcelik.universal_pet_care.model.Patient;
import com.rafetcelik.universal_pet_care.repository.PatientRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PatientService implements IPatientService {
    
    private final PatientRepository patientRepository;
    
    private final EntityConverter<Patient, UserDto> entityConverter;

    @Override
    public List<UserDto> getAllPatients() {
        List<Patient> patients = patientRepository.findAll();
        return patients.stream()
                .map(this::mapPatientToUserDto)
                .toList();
    }

    private UserDto mapPatientToUserDto(Patient patient) {
        UserDto userDto = entityConverter.mapEntityToDto(patient, UserDto.class);
        userDto.setFirstName(patient.getFirstName());
        userDto.setLastName(patient.getLastName());
        userDto.setEmail(patient.getEmail());
        userDto.setPhoneNumber(patient.getPhoneNumber());
        userDto.setGender(patient.getGender());
        userDto.setCreatedAt(patient.getCreatedAt());
        
        return userDto;
    }
}
