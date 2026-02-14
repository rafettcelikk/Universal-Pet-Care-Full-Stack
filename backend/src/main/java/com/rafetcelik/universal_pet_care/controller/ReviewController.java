package com.rafetcelik.universal_pet_care.controller;

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
import static org.springframework.http.HttpStatus.NOT_ACCEPTABLE;
import static org.springframework.http.HttpStatus.CONFLICT;
import static org.springframework.http.HttpStatus.NOT_FOUND;

import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;

import com.rafetcelik.universal_pet_care.dto.ReviewDto;
import com.rafetcelik.universal_pet_care.exception.AlreadyExistsException;
import com.rafetcelik.universal_pet_care.exception.ResourceNotFoundException;
import com.rafetcelik.universal_pet_care.model.Review;
import com.rafetcelik.universal_pet_care.request.ReviewUpdateRequest;
import com.rafetcelik.universal_pet_care.response.ApiResponse;
import com.rafetcelik.universal_pet_care.service.review.IReviewService;
import com.rafetcelik.universal_pet_care.utils.FeedBackMessage;
import com.rafetcelik.universal_pet_care.utils.UrlMapping;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(UrlMapping.REVIEWS)
public class ReviewController {
	private final IReviewService reviewService;
	
	private final ModelMapper modelMapper;
	
	@PostMapping(UrlMapping.SUBMIT_REVIEW)
	public ResponseEntity<ApiResponse> saveReview(@RequestBody Review review,
				                                  @RequestParam Long reviewerId,
				                                  @RequestParam Long veterinarianId) {
		try {
			Review savedReview = reviewService.saveReview(review, reviewerId, veterinarianId);
			return ResponseEntity.ok(new ApiResponse(FeedBackMessage.REVIEW_SUBMIT_SUCCESS, savedReview.getId()));
		} catch (IllegalArgumentException | IllegalStateException e) {
			return ResponseEntity.status(NOT_ACCEPTABLE).body(new ApiResponse(e.getMessage(), null));
		} catch (AlreadyExistsException e) {
		    return ResponseEntity.status(CONFLICT).body(new ApiResponse(e.getMessage(), null));
		} catch (ResourceNotFoundException e) {
			return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
		}
	}
	
	@GetMapping(UrlMapping.GET_REVIEW_BY_USER_ID)
	public ResponseEntity<ApiResponse> getReviewsByUserId(@PathVariable Long userId,
			                                             @RequestParam(defaultValue = "0") int page,
			                                             @RequestParam(defaultValue = "5") int size) {
		Page<Review> reviewsPage = reviewService.findAllReviewsByUserId(userId, page, size);
		Page<ReviewDto> reviewsPageDto = reviewsPage.map(review -> modelMapper.map(review, ReviewDto.class));
		return ResponseEntity.ok(new ApiResponse(FeedBackMessage.REVIEW_FOUND, reviewsPageDto));
	}
	
	@PutMapping(UrlMapping.UPDATE_REVIEW)
	public ResponseEntity<ApiResponse> updateReview(@RequestBody ReviewUpdateRequest request,
												  	@PathVariable Long reviewId) {
		try {
			Review updatedReview = reviewService.updateReview(reviewId, request);
			return ResponseEntity.ok(new ApiResponse(FeedBackMessage.REVIEW_UPDATE_SUCCESS, updatedReview.getId()));
		} catch (ResourceNotFoundException e) {
			return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
		}
	}
	
	@DeleteMapping(UrlMapping.DELETE_REVIEW)
	public ResponseEntity<ApiResponse> deleteReview(@PathVariable Long reviewId) {
		try {
			reviewService.deleteReview(reviewId);
			return ResponseEntity.ok(new ApiResponse(FeedBackMessage.REVIEW_DELETE_SUCCESS, null));
		} catch (ResourceNotFoundException e) {
			return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
		}
	}
	
	@GetMapping(UrlMapping.GET_AVERAGE_RATING_FOR_VET)
	public ResponseEntity<ApiResponse> getAverageRatingForVet(@PathVariable Long veterinarianId) {
		double averageRating = reviewService.getAverageRatingForVeterinarian(veterinarianId);
		return ResponseEntity.ok(new ApiResponse(FeedBackMessage.REVIEW_FOUND, averageRating));
	}
}
