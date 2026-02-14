package com.rafetcelik.universal_pet_care.service.user;
import java.sql.SQLException;
import java.time.Month;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import com.rafetcelik.universal_pet_care.dto.AppointmentDto;
import com.rafetcelik.universal_pet_care.dto.EntityConverter;
import com.rafetcelik.universal_pet_care.dto.ReviewDto;
import com.rafetcelik.universal_pet_care.dto.UserDto;
import com.rafetcelik.universal_pet_care.exception.ResourceNotFoundException;
import com.rafetcelik.universal_pet_care.factory.UserFactory;
import com.rafetcelik.universal_pet_care.model.Appointment;
import com.rafetcelik.universal_pet_care.model.Review;
import com.rafetcelik.universal_pet_care.model.User;
import com.rafetcelik.universal_pet_care.repository.AppointmentRepository;
import com.rafetcelik.universal_pet_care.repository.ReviewRepository;
import com.rafetcelik.universal_pet_care.repository.UserRepository;
import com.rafetcelik.universal_pet_care.request.RegistirationRequest;
import com.rafetcelik.universal_pet_care.request.UserUpdateRequest;
import com.rafetcelik.universal_pet_care.service.appointment.AppointmentService;
import com.rafetcelik.universal_pet_care.service.photo.PhotoService;
import com.rafetcelik.universal_pet_care.service.review.ReviewService;
import com.rafetcelik.universal_pet_care.utils.FeedBackMessage;

import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;

@Service
@RequiredArgsConstructor
public class UserService implements IUserService{

    private final PhotoService photoService;
    
	private final UserRepository userRepository;
	
	private final UserFactory userFactory;
	
	private final EntityConverter<User, UserDto> entityConverter;
	
	private final AppointmentService appointmentService;

    private final ReviewService reviewService;
    
    private final ReviewRepository reviewRepository;
    
    private final AppointmentRepository appointmentRepository;
    
    Locale trLocale = new Locale("tr", "TR");
	
	@Override
	public User register(RegistirationRequest request) {
		return userFactory.createUser(request);
	}
	
	@Override
	public User updateUser(Long userId, UserUpdateRequest request) {
		User user = findById(userId);
		user.setFirstName(request.getFirstName());
		user.setLastName(request.getLastName());
		user.setGender(request.getGender());
		user.setPhoneNumber(request.getPhoneNumber());
		user.setSpecialization(request.getSpecialization());
		return userRepository.save(user);
	}
	
	@Override
	public User findById(Long userId) {
		return userRepository.findById(userId)
				.orElseThrow(() -> new ResourceNotFoundException(FeedBackMessage.USER_NOT_FOUND));
	}
	
	@Override
	public void deleteUser(Long userId) {
		userRepository.findById(userId)
			.ifPresentOrElse(userToDelete -> {
				List<Review> reviews = new ArrayList<>(reviewRepository.findAllByUserId(userId));
				reviewRepository.deleteAll(reviews);
				List<Appointment> appointments = new ArrayList<>(appointmentRepository.findAllByUserId(userId));
				appointmentRepository.deleteAll(appointments);
				userRepository.deleteById(userId);
			}, () -> {
				throw new ResourceNotFoundException(FeedBackMessage.USER_NOT_FOUND);
			});
	}
	
	@Override
	public List<UserDto> getAllUsers() {
		List<User> users = userRepository.findAll();
		return users.stream()
				.map(user -> entityConverter.mapEntityToDto(user, UserDto.class))
				.collect(Collectors.toList());
	}
	
	@Override
	public UserDto getUserWithDetails(Long userId) throws SQLException {
		User user = findById(userId);
		UserDto userDto = entityConverter.mapEntityToDto(user, UserDto.class);
		userDto.setTotalReviewers(reviewRepository.countByVeterinarianId(userId));
		setUserAppointment(userDto);
		setUserPhoto(userDto, user);
		setUserReviews(userDto, userId);
		return userDto;
	}
	
	private void setUserAppointment(UserDto userDto) {
		List<AppointmentDto> appointments = appointmentService.getUserAppointments(userDto.getId());
		userDto.setAppointments(appointments);
	}
	
	private void setUserPhoto(UserDto userDto, User user) throws SQLException {
		if (user.getPhoto() != null) {
			userDto.setPhotoId(user.getPhoto().getId());
			userDto.setPhoto(photoService.getPhotoData(user.getPhoto().getId()));
		}
	}
	
	private void setUserReviews(UserDto userDto, Long userId) {
		Page<Review> reviewPage = reviewService.findAllReviewsByUserId(userId, 0, Integer.MAX_VALUE);
		List<ReviewDto> reviewDtos = reviewPage.getContent().stream()
				.map(this :: mapReviewToDto).toList();
		if (!reviewDtos.isEmpty()) {
			double averageRating = reviewService.getAverageRatingForVeterinarian(userId);
			userDto.setAverageRating(averageRating);
		}
		userDto.setReviews(reviewDtos);
	}
	
	@SneakyThrows
	private ReviewDto mapReviewToDto(Review review) {
		ReviewDto reviewDto = new ReviewDto();
		reviewDto.setId(review.getId());
		reviewDto.setFeedback(review.getFeedback());
		reviewDto.setRating(review.getRating());
		mapVeterinarianInfo(reviewDto, review);
		mapPatientInfo(reviewDto, review);
		return reviewDto;
	}
	
	private void mapVeterinarianInfo(ReviewDto reviewDto, Review review) throws SQLException {
		if (review.getVeterinarian() != null) {
			reviewDto.setVeterinarianId(review.getVeterinarian().getId());
			reviewDto.setVeterinarianName(review.getVeterinarian().getFirstName() + " " + review.getVeterinarian().getLastName());
			setVeterinarianPhoto(reviewDto, review);
		}
	}
	
	private void mapPatientInfo(ReviewDto reviewDto, Review review) throws SQLException {
		if (review.getPatient() != null) {
			reviewDto.setPatientId(review.getPatient().getId());
			reviewDto.setPatientName(review.getPatient().getFirstName() + " " + review.getPatient().getLastName());
			setReviewerPhoto(reviewDto, review);
		}
	}
	
	private void setReviewerPhoto(ReviewDto reviewDto, Review review) {
		if (review.getPatient().getPhoto() != null) {
			try {
				reviewDto.setPatientPhoto(photoService.getPhotoData(review.getPatient().getPhoto().getId()));
			} catch (SQLException e) {
				throw new RuntimeException(e.getMessage());
			}
		} else {
			reviewDto.setPatientPhoto(null);
		}
	}
	
	private void setVeterinarianPhoto(ReviewDto reviewDto, Review review) {
		if (review.getVeterinarian().getPhoto() != null) {
			try {
				reviewDto.setVeterinarianPhoto(photoService.getPhotoData(review.getVeterinarian().getPhoto().getId()));
			} catch (SQLException e) {
				throw new RuntimeException(e.getMessage());
			}
		} else {
			reviewDto.setVeterinarianPhoto(null);
		}
	}
	
	@Override
	public long countVeterinarians() {
		return userRepository.countByUserType("VET");
	}
	
	@Override
	public long countPatients() {
		return userRepository.countByUserType("PATIENT");
	}
	
	@Override
	public long countAllUsers() {
		return userRepository.count();
	}
	
	@Override
	public Map<String, Map<String, Long>> aggregateUsersByMonthAbdType() {
		List<User> users = userRepository.findAll();
		return users.stream()
				.filter(user -> user.getCreatedAt() != null)
				.collect(Collectors.groupingBy(user -> Month.of(user.getCreatedAt().getMonthValue())
						.getDisplayName(TextStyle.FULL, trLocale),
						Collectors.groupingBy(User :: getUserType, Collectors.counting())
		));
	}
	
	@Override
	public Map<String, Map<String, Long>> aggregateUsersByEnabledStatus() {
		List<User> users = userRepository.findAll();
		return users.stream()
				.collect(Collectors.groupingBy(user -> user.isEnabled() ? "Enabled" : "Disabled", 
						Collectors.groupingBy(User :: getUserType, Collectors.counting())));
	}
	
	@Override
	public void lockUserAccount(Long userId) {
		userRepository.updateUserEnabledStatus(userId, false);
	}
	
	@Override
	public void unlockUserAccount(Long userId) {
		userRepository.updateUserEnabledStatus(userId, true);
	}
}
