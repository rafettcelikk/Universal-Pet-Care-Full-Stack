package com.rafetcelik.universal_pet_care.model;

import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@PrimaryKeyJoinColumn(name = "veterinarian_id")
public class Veterinarian extends User{
	private Long id;
	
	private String specialization; // Bu alan şu işlevi görür: Veterinerin uzmanlık alanını belirtir (örneğin, cerrahi, dermatoloji, dahiliye vb.).
}
