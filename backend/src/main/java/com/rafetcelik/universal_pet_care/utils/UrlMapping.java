package com.rafetcelik.universal_pet_care.utils;

public class UrlMapping {
	public static final String API = "/api/v1";
	public static final String USERS = API + "/users";
	public static final String REGISTER_USER = "/register";
	public static final String UPDATE_USER = "/user/{userId}/update";
	public static final String GET_USER_BY_ID = "/user/{userId}";
	public static final String DELETE_USER_BY_ID = "/user/{userId}/delete";
	public static final String GET_ALL_USERS = "/all-users";
	public static final String COUNT_VETERINARIANS = "/count/veterinarians";
	public static final String COUNT_PATIENTS = "/count/patients";
	public static final String COUNT_ALL_USERS = "/count/all-users";
	public static final String AGGREGATE_USERS_BY_MONTH_AND_TYPE = "/aggregated-users";
	public static final String AGGREGATE_USERS_BY_ENABLED_STATUS = "/account/aggregated-by-status";
	public static final String LOCK_USER_ACCOUNT = "/user/{userId}/lock-account";
	public static final String UNLOCK_USER_ACCOUNT = "/user/{userId}/unlock-account";
	
	
	/* Appointment URLs Start */
	public static final String APPOİNTMENTS = API + "/appointments";
	public static final String GET_ALL_APPOINTMENTS = "/all";
	public static final String BOOK_APPOINTMENT = "/book-appointment";
	public static final String GET_APPOINTMENT_BY_ID = "/appointment/{id}/get";
	public static final String DELETE_APPOINTMENT_BY_ID = "/appointment/{id}/delete";
	public static final String GET_APPOINTMENT_BY_NO = "/appointment/{appointmentNo}/appointment";
	public static final String UPDATE_APPOINTMENT_BY_ID = "/appointment/{id}/update";
	public static final String CANCEL_APPOINTMENT = "/appointment/{appointmentId}/cancel";
	public static final String APPROVE_APPOINTMENT = "/appointment/{appointmentId}/approve";
	public static final String DECLINE_APPOINTMENT = "/appointment/{appointmentId}/decline";
	public static final String COUNT_APPOINTMENTS = "/count/appointments";
	public static final String GET_APPOINTMENT_SUMMARY = "/summary/appointments-summary";
	/* Appointment URLs End */
	
	/* Pet URLs Start */
	public static final String PETS = API + "/pets";
	public static final String SAVE_PETS_FOR_APPOINTMENT = "/pet/{appointmentId}/save-pet";
	public static final String SAVE_PET_FOR_APPOINTMENT_WITHOUT_ID = "/save-pet";
	public static final String GET_PET_BY_ID = "/pet/{id}/get";
	public static final String DELETE_PET_BY_ID = "/pet/{id}/delete";
	public static final String UPDATE_PET = "/pet/{id}/update";
	public static final String GET_PET_TYPES = "/get-pet-types";
	public static final String GET_PET_COLORS = "/get-pet-colors";
	public static final String GET_PET_BREEDS = "/get-pet-breeds";
	
	/* Pet URLs End */
	
	/* Photo URLs Start */
	public static final String PHOTOS = API + "/photos";
	public static final String UPLOAD_PHOTO = "/photo/upload";
	public static final String UPDATE_PHOTO = "/photo/{photoId}/update";
	public static final String DELETE_PHOTO = "/photo/{photoId}/user/{userId}/delete";
	public static final String GET_PHOTO_BY_ID = "/photo/{photoId}/get";
	/* Photo URLs End */
	
	/* Review URLs Start */
	public static final String REVIEWS = API + "/reviews";
	public static final String SUBMIT_REVIEW = "/submit-review";
	public static final String GET_REVIEW_BY_USER_ID = "/user/{userId}/reviews";
	public static final String UPDATE_REVIEW = "/review/{reviewId}/update";
	public static final String DELETE_REVIEW = "/review/{reviewId}/delete";
	public static final String GET_AVERAGE_RATING_FOR_VET = "/veterinarian/{veterinarianId}/get-average-rating";
	/* Review URLs End */
	
	/* Veterinarian URLs Start */
	public static final String VETERINARIANS = API + "/veterinarians";
	public static final String GET_ALL_VETERINARIANS = "/get-all-veterinarians";
	public static final String SEARCH_VETERINARIAN_FOR_APPOINTMENT = "/search-veterinarian";
	public static final String GET_ALL_SPECIALIZATIONS = "/get-all-specializations";
	public static final String AGGREGATE_VETS_BY_SPECIALIZATION = "/aggregated-by-specialization";
	/* Veterinarian URLs End */
	
	/* Patient URLs Start */
	public static final String PATIENTS = API + "/patients";
	public static final String GET_ALL_PATIENTS = "/get-all-patients";
	/* Patient URLs End */
	
	/* Password URLs Start */
	public static final String CHANGE_PASSWORD = "/user/{userId}/change-password";
	public static final String REQUEST_PASSWORD_RESET = "/request-password-reset";
	public static final String RESET_PASSWORD = "/reset-password";
	/* Password URLs End */
	
	/* Auth URLs Start */
	public static final String AUTH = API + "/auth";
	public static final String LOGIN = "/login";
	/* Auth URLs End */
	
	/* Verification Token URLs Start */
	public static final String VERIFICATION_TOKEN = API + "/verification";
	public static final String VALIDATE_TOKEN = "/validate";
	public static final String CHECK_TOKEN_EXPIRATION = "/check-token-expiration";
	public static final String SAVE_VERIFICATION_TOKEN = "/save-token";
	public static final String GENERATE_NEW_VERIFICATION_TOKEN = "/generate-new-token";
	public static final String DELETE_VERIFICATION_TOKEN = "/delete-token";
	public static final String VERIFY_EMAIL = "/verify-your-email";
	public static final String RESEND_VERIFICATION_TOKEN = "/resend-verification-token";
	/* Verification Token URLs End */
	
	/* Role URLs Start */
	public static final String ROLES = API + "/roles";
	public static final String GET_ALL_ROLES = "/get-all-roles";
	public static final String GET_ROLE_BY_ID = "/get-role-by-id";
	public static final String GET_ROLE_BY_NAME = "/get-role-by-name";
	public static final String SAVE_ROLE = "/save-role";
	public static final String SET_USER_ROLES = "/set-user-roles";
	/* Role URLs End */
	
	
	
	
	
}
