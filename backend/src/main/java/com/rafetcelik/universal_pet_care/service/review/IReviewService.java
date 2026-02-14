package com.rafetcelik.universal_pet_care.service.review;

import org.springframework.data.domain.Page;

import com.rafetcelik.universal_pet_care.model.Review;
import com.rafetcelik.universal_pet_care.request.ReviewUpdateRequest;

public interface IReviewService {
	Review saveReview(Review review, Long reviewerId, Long veterinarianId);
	
	double getAverageRatingForVeterinarian(Long veterinarianId);
	
	Review updateReview(Long reviewId, ReviewUpdateRequest request);
	
	Page<Review> findAllReviewsByUserId(Long userId, int page, int size);
	
	void deleteReview(Long reviewId);
}
