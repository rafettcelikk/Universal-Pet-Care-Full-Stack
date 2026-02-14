package com.rafetcelik.universal_pet_care.service.appointment;

import java.util.List;
import java.util.Map;

import com.rafetcelik.universal_pet_care.dto.AppointmentDto;
import com.rafetcelik.universal_pet_care.model.Appointment;
import com.rafetcelik.universal_pet_care.request.AppointmentUpdateRequest;
import com.rafetcelik.universal_pet_care.request.BookAppointmentRequest;

public interface IAppointmentService {
	Appointment createAppointment(BookAppointmentRequest request, Long senderId, Long recipientId);
	
	List<Appointment> getAllAppointments();
	
	Appointment updateAppointment(Long id, AppointmentUpdateRequest request);
	
	void deleteAppointment(Long id);
	
	Appointment getAppointmentById(Long id);
	
	Appointment getAppointmentByNo(String appointmentNo);

	List<AppointmentDto> getUserAppointments(Long userId);

	Appointment cancelAppointment(Long appointmentId);

	Appointment approveAppointment(Long appointmentId);

	Appointment declineAppointment(Long appointmentId);

	long countAppointments();

	List<Map<String, Object>> getAppointmentSummary();

	List<Long> getAppointmentIds();

	void setAppointmentStatus(Long appointmentId);
}
