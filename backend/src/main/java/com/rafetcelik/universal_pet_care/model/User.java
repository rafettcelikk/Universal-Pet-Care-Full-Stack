package com.rafetcelik.universal_pet_care.model;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Transient;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Inheritance(strategy = InheritanceType.JOINED)
public class User {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private String firstName;
	
	private String lastName;
	
	private String gender;
	
	@Column(name = "mobile")
	private String phoneNumber;
	
	private String email;
	
	private String password;
	
	private String userType;
	
	private boolean isEnabled;
	
	@CreationTimestamp
	@JsonFormat(pattern = "dd-MM-yyyy")
	private LocalDate createdAt;
	
	@Transient
	private String specialization;
	
	@Transient
	private List<Appointment> appointments = new ArrayList<>();
	
	@Transient
	private List<Review> reviews = new ArrayList<>();
	
	@OneToOne(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
	private Photo photo;
	
	@ManyToMany(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH, CascadeType.MERGE,
													CascadeType.PERSIST, CascadeType.REFRESH})
	@JoinTable(name = "user_roles", 
				joinColumns = @JoinColumn(name = "user_id", referencedColumnName = "id"),
				inverseJoinColumns = @JoinColumn(name = "role_id", referencedColumnName = "id"))
	private Collection<Role> roles = new HashSet<>();
	
	@OneToMany(mappedBy = "user", cascade = CascadeType.REMOVE)
	private List<VerificationToken> verificationTokens = new ArrayList<>();
	
	public void removeUserPhoto(){
        if(this.getPhoto() != null){
            this.setPhoto(null);
        }
    }
}
