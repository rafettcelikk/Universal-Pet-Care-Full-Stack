package com.rafetcelik.universal_pet_care.controller;

import java.util.List;
import java.util.Map;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import static org.springframework.http.HttpStatus.FOUND;
import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;
import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.HttpStatus.NOT_ACCEPTABLE;

import com.rafetcelik.universal_pet_care.event.AppointmentApprovedEvent;
import com.rafetcelik.universal_pet_care.event.AppointmentBookedEvent;
import com.rafetcelik.universal_pet_care.event.AppointmentDeclinedEvent;
import com.rafetcelik.universal_pet_care.exception.ResourceNotFoundException;
import com.rafetcelik.universal_pet_care.model.Appointment;
import com.rafetcelik.universal_pet_care.request.AppointmentUpdateRequest;
import com.rafetcelik.universal_pet_care.request.BookAppointmentRequest;
import com.rafetcelik.universal_pet_care.response.ApiResponse;
import com.rafetcelik.universal_pet_care.service.appointment.IAppointmentService;
import com.rafetcelik.universal_pet_care.utils.FeedBackMessage;
import com.rafetcelik.universal_pet_care.utils.UrlMapping;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(UrlMapping.APPOİNTMENTS)
public class AppointmentController {
	private final IAppointmentService appointmentService;
	
	private final ApplicationEventPublisher publisher;
	
	@GetMapping(UrlMapping.GET_ALL_APPOINTMENTS)
	public ResponseEntity<ApiResponse> getAllAppointments() {
		try {
			List<Appointment> appointments = appointmentService.getAllAppointments();
			return ResponseEntity.status(FOUND).body(new ApiResponse(FeedBackMessage.APPOINTMENT_FOUND, appointments));
		} catch (Exception e) {
			return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse(e.getMessage(), null));
		}
	}
	
	@PostMapping(UrlMapping.BOOK_APPOINTMENT)
	public ResponseEntity<ApiResponse> bookAppointment(
			@RequestBody BookAppointmentRequest request,
			@RequestParam Long senderId,
			@RequestParam Long recipientId) {
		try {
			Appointment createdAppointment = appointmentService.createAppointment(request, senderId, recipientId);
			publisher.publishEvent(new AppointmentBookedEvent(createdAppointment));
			return ResponseEntity.ok(new ApiResponse(FeedBackMessage.APPOINTMENT_BOOKED_SUCCESS, createdAppointment));
		} catch (ResourceNotFoundException e) {
			return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
		} catch (Exception e) {
			return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse(e.getMessage(), null));
		}
	}
	
	@GetMapping(UrlMapping.GET_APPOINTMENT_BY_ID)
	public ResponseEntity<ApiResponse> getAppointmentById(@PathVariable Long id) {
		try {
			Appointment appointment = appointmentService.getAppointmentById(id);
			return ResponseEntity.ok(new ApiResponse(FeedBackMessage.APPOINTMENT_FOUND, appointment));
		} catch (ResourceNotFoundException e) {
			return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
		} catch (Exception e) {
			return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse(e.getMessage(), null));
		}
	}
	
	@DeleteMapping(UrlMapping.DELETE_APPOINTMENT_BY_ID)
	public ResponseEntity<ApiResponse> deleteAppointment(@PathVariable Long id) {
		try {
			appointmentService.deleteAppointment(id);
			return ResponseEntity.ok(new ApiResponse(FeedBackMessage.APPOINTMENT_DELETE_SUCCESS, null));
		} catch (ResourceNotFoundException e) {
			return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
		} catch (Exception e) {
			return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse(e.getMessage(), null));
		}
	}
	
	@GetMapping(UrlMapping.GET_APPOINTMENT_BY_NO)
	public ResponseEntity<ApiResponse> getAppointmentByNo(@PathVariable String appointmentNo) {
		try {
			Appointment appointment = appointmentService.getAppointmentByNo(appointmentNo);
			return ResponseEntity.ok(new ApiResponse(FeedBackMessage.APPOINTMENT_FOUND, appointment));
		} catch (ResourceNotFoundException e) {
			return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
		} catch (Exception e) {
			return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse(e.getMessage(), null));
		}
	}
	
	@PutMapping(UrlMapping.UPDATE_APPOINTMENT_BY_ID)
	public ResponseEntity<ApiResponse> updateAppointment(
			@PathVariable Long id,
			@RequestBody AppointmentUpdateRequest request) {
		try {
			Appointment updatedAppointment = appointmentService.updateAppointment(id, request);
			return ResponseEntity.ok(new ApiResponse(FeedBackMessage.APPOINTMENT_UPDATE_SUCCESS, updatedAppointment));
		} catch (IllegalStateException e) {
			return ResponseEntity.status(NOT_ACCEPTABLE).body(new ApiResponse(e.getMessage(), null));
		} catch (Exception e) {
			return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse(e.getMessage(), null));
		}
	}
	
	@PutMapping(UrlMapping.CANCEL_APPOINTMENT)
	public ResponseEntity<ApiResponse> cancelAppointment(@PathVariable Long appointmentId) {
		try {
			Appointment cancelledAppointment = appointmentService.cancelAppointment(appointmentId);
			return ResponseEntity.ok(new ApiResponse(FeedBackMessage.APPOINTMENT_CANCELLED_SUCCESS, cancelledAppointment));
		} catch (IllegalStateException e) {
			return ResponseEntity.status(NOT_ACCEPTABLE).body(new ApiResponse(e.getMessage(), null));
		} catch (Exception e) {
			return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse(e.getMessage(), null));
		}
	}
	
	@PutMapping(UrlMapping.APPROVE_APPOINTMENT)
	public ResponseEntity<ApiResponse> approveAppointment(@PathVariable Long appointmentId) {
		try {
			Appointment approvedAppointment = appointmentService.approveAppointment(appointmentId);
			publisher.publishEvent(new AppointmentApprovedEvent(approvedAppointment));
			return ResponseEntity.ok(new ApiResponse(FeedBackMessage.APPOINTMENT_APPROVED_SUCCESS, approvedAppointment));
		} catch (IllegalStateException e) {
			return ResponseEntity.status(NOT_ACCEPTABLE).body(new ApiResponse(e.getMessage(), null));
		} catch (Exception e) {
			return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse(e.getMessage(), null));
		}
	}
	
	@PutMapping(UrlMapping.DECLINE_APPOINTMENT)
	public ResponseEntity<ApiResponse> declineAppointment(@PathVariable Long appointmentId) {
		try {
			Appointment declinedAppointment = appointmentService.declineAppointment(appointmentId);
			publisher.publishEvent(new AppointmentDeclinedEvent(declinedAppointment));
			return ResponseEntity.ok(new ApiResponse(FeedBackMessage.APPOINTMENT_DECLINED_SUCCESS, declinedAppointment));
		} catch (ResourceNotFoundException e) {
			return ResponseEntity.status(NOT_ACCEPTABLE).body(new ApiResponse(e.getMessage(), null));
		} catch (Exception e) {
			return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse(e.getMessage(), null));
		}
	}
	
	@GetMapping(UrlMapping.COUNT_APPOINTMENTS)
	public long countAppointments() {
		return appointmentService.countAppointments();
	}
	
	@GetMapping(UrlMapping.GET_APPOINTMENT_SUMMARY)
	public ResponseEntity<ApiResponse> getAppointmentSummary() {
		try {
			List<Map<String, Object>> summary = appointmentService.getAppointmentSummary();
			return ResponseEntity.ok(new ApiResponse(FeedBackMessage.RESOURCE_FOUND, summary));
		} catch (Exception e) {
			return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse(e.getMessage(), null));
		}
	}
}
