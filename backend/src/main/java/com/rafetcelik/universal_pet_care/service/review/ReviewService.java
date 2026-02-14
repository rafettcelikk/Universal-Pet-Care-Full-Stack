package com.rafetcelik.universal_pet_care.service.review;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.rafetcelik.universal_pet_care.exception.ResourceNotFoundException;
import com.rafetcelik.universal_pet_care.exception.AlreadyExistsException;
import com.rafetcelik.universal_pet_care.model.Review;
import com.rafetcelik.universal_pet_care.model.User;
import com.rafetcelik.universal_pet_care.repository.ReviewRepository;
import com.rafetcelik.universal_pet_care.repository.UserRepository;
import com.rafetcelik.universal_pet_care.request.ReviewUpdateRequest;
import com.rafetcelik.universal_pet_care.utils.FeedBackMessage;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReviewService implements IReviewService{
	private final ReviewRepository reviewRepository;
	
	private final UserRepository userRepository;

	@Override
	public Review saveReview(Review review, Long reviewerId, Long veterinarianId) {
		if (veterinarianId.equals(reviewerId)) {
			throw new IllegalArgumentException(FeedBackMessage.CANNOT_REVIEW_SELF);
		}
		
		Optional<Review> existingReview = reviewRepository.findByVeterinarianIdAndPatientId(veterinarianId, reviewerId);
		if (existingReview.isPresent()) {
			throw new AlreadyExistsException(FeedBackMessage.REVIEW_ALREADY_EXISTS);
		}
		
		/*boolean hadCompletedAppointment = appointmentRepository
				.existsByVeterinarianIdAndPatientIdAndStatus(veterinarianId, reviewerId, AppointmentStatus.COMPLETED);
		if (!hadCompletedAppointment) {
			throw new IllegalStateException(FeedBackMessage.NOT_ALLOWED_TO_REVIEW);
		}*/
		
		User veterinarian = userRepository.findById(veterinarianId)
				.orElseThrow(() -> new ResourceNotFoundException(FeedBackMessage.VET_OR_PATIENT_NOT_FOUND));
		User patient = userRepository.findById(reviewerId)
				.orElseThrow(() -> new ResourceNotFoundException(FeedBackMessage.VET_OR_PATIENT_NOT_FOUND));
		
		review.setVeterinarian(veterinarian);
		review.setPatient(patient);
		return reviewRepository.save(review);
	}
	
	@Transactional
	@Override
	public double getAverageRatingForVeterinarian(Long veterinarianId) {
		List<Review> reviews = reviewRepository.findByVeterinarianId(veterinarianId);
		return reviews.isEmpty() ? 0 : reviews.stream()
				.mapToInt(Review :: getRating)
				.average()
				.orElse(0.0);
	}

	@Override
	public Review updateReview(Long reviewId, ReviewUpdateRequest request) {
		return reviewRepository.findById(reviewId)
			.map(existingReview -> {
				existingReview.setFeedback(request.getFeedback());
				existingReview.setRating(request.getRating());
				return reviewRepository.save(existingReview);
				}).orElseThrow(() -> new ResourceNotFoundException(FeedBackMessage.RESOURCE_NOT_FOUND));
	}

	@Override
	public Page<Review> findAllReviewsByUserId(Long userId, int page, int size) {
		PageRequest pageRequest = PageRequest.of(page, size);
		return reviewRepository.findAllByUserId(userId, pageRequest);
	}

	@Override
	public void deleteReview(Long reviewId) {
		reviewRepository.findById(reviewId)
			.ifPresentOrElse(Review :: remoweRelationships, () -> {
				throw new ResourceNotFoundException(FeedBackMessage.RESOURCE_NOT_FOUND);
			});
		reviewRepository.deleteById(reviewId);
	}


}
