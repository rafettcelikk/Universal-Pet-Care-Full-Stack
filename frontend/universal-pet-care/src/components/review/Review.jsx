import { UserType } from "../utils/utilities/";
import UserPhoto from "../common/UserPhoto";
import RatingStars from "../rating/RatingStars";

const Review = ({ review, userType }) => {
  const displayName =
    userType === UserType.PATIENT ? (
      `Dr. ${review.veterinarianName} Değerlendirmen`
    ) : (
      <span className="highlighted-name">
        Hasta <strong>{review.patientName}</strong> tarafından yapılan
        değerlendirme
      </span>
    );

  return (
    <div className="mb-4">
      <div className="d-flex align-items-center me-5">
        {userType === UserType.VET ? (
          <UserPhoto
            userId={review.patientId}
            userPhoto={review.patientPhoto}
          />
        ) : (
          <UserPhoto
            userId={review.veterinarianId}
            userPhoto={review.veterinarianPhoto}
          />
        )}
        <div className="ms-4">
          <div>
            <h5 className="title ms-3">
              <RatingStars rating={review.rating} />
            </h5>
          </div>
          <div className="mt-4">
            <p className="review-text ms-4">{review.feedback}</p>
          </div>
          <div>
            <p className="ms-4">{displayName}</p>
          </div>
        </div>
      </div>
      <hr />
    </div>
  );
};

export default Review;
