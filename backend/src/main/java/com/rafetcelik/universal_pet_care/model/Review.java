package com.rafetcelik.universal_pet_care.model;

import java.util.Optional;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Review {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private String feedback;
	
	private int rating;
	
	@ManyToOne
	@JoinColumn(name = "veterinarian_id")
	private User veterinarian;
	
	@ManyToOne
	@JoinColumn(name = "reviewer_id")
	private User patient;
	
	public void remoweRelationships() {
		Optional.ofNullable(veterinarian)
			.ifPresent(vet -> vet.getReviews().remove(this));
		Optional.ofNullable(patient)
			.ifPresent(pat -> pat.getReviews().remove(this));
	}
}
