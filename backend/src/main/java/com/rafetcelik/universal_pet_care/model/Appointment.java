package com.rafetcelik.universal_pet_care.model;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import org.hibernate.annotations.CreationTimestamp;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.rafetcelik.universal_pet_care.enums.AppointmentStatus;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties({"patient", "veterinarian"})
public class Appointment {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private String reason;
	
	@JsonFormat(pattern = "dd-MM-yyyy")
	private LocalDate appointmentDate;
	
	@JsonFormat(pattern = "HH:mm")
	private LocalTime appointmentTime;
	
	private String appointmentNo;
	
	@CreationTimestamp
	@JsonFormat(pattern = "dd-MM-yyyy")
	private LocalDate createdAt;
	
	@Enumerated(EnumType.STRING)
	private AppointmentStatus status;
	
	@JoinColumn(name = "sender")
	@ManyToOne(fetch = FetchType.LAZY)
	private User patient;
	
	@JoinColumn(name = "recipient")
	@ManyToOne(fetch = FetchType.LAZY)
	private User veterinarian;
	
	@OneToMany(mappedBy = "appointment", cascade = CascadeType.ALL)
	List<Pet> pets = new ArrayList<>();
	
	public void addPatient(User sender) {
		this.setPatient(sender);
		if (sender.getAppointments() == null) {
			sender.setAppointments(new ArrayList<>());
		}
		sender.getAppointments().add(this);
	}
	
	public void addVeterinarian(User recipient) {
		this.setVeterinarian(recipient);
		if (recipient.getAppointments() == null) {
			recipient.setAppointments(new ArrayList<>());
		}
		recipient.getAppointments().add(this);
	}
	
	public void setAppointmentNo() {
		this.appointmentNo = String.valueOf(new Random().nextLong()).substring(1, 11);
	}
}
