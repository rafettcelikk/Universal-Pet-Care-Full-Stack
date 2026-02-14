import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import UseMessageAlerts from "../hooks/UseMessageAlerts";
import { Card, Col, Container, Row } from "react-bootstrap";
import UserPhoto from "../common/UserPhoto";
import { BsFillArrowLeftCircleFill } from "react-icons/bs";
import RatingStars from "../rating/RatingStars";
import Rating from "../rating/Rating";
import Review from "../review/Review";
import { getUserById } from "../user/UserService";
import AlertMessage from "../common/AlertMessage";
import Paginator from "../common/Paginator";
import LoadSpinner from "../common/LoadSpinner";

const Veterinarian = () => {
  const [veterinarian, setVeterinarian] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { veterinarianId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsPerPage] = useState(2);

  const { errorMessage, setErrorMessage, showErrorAlert, setShowErrorAlert } =
    UseMessageAlerts();

  const getUser = async () => {
    setIsLoading(true);
    try {
      const response = await getUserById(veterinarianId);
      setVeterinarian(response.data);
      setIsLoading(false);
    } catch (error) {
      setErrorMessage(error.response.data.message);
      setShowErrorAlert(true);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, [veterinarianId]);

  const veterinarianReviews = veterinarian?.reviews || [];
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews =
    veterinarianReviews.slice(indexOfFirstReview, indexOfLastReview) || [];
  if (isLoading) {
    return (
      <div>
        <LoadSpinner />
      </div>
    );
  }
  return (
    <Container className="d-flex justify-content-center align-items-center mt-5">
      {showErrorAlert && (
        <AlertMessage type={"danger"} message={errorMessage} />
      )}
      {veterinarian && (
        <Card className="review-card mt-2">
          <Row>
            <Col>
              <UserPhoto
                userId={veterinarian.id}
                userPhoto={veterinarian.photo}
                altText={`${veterinarian.firstName} Fotoğrafı`}
              />
            </Col>
            <Col>
              <Link style={{ textDecoration: "none" }} to={"/veterinarians"}>
                <BsFillArrowLeftCircleFill size={30} className="me-2" /> Geri
                Dön
              </Link>
            </Col>
          </Row>
          <Card.Body>
            <Card.Title>
              Dr. {veterinarian.firstName} {veterinarian.lastName}
            </Card.Title>
            <Card.Text>Uzmanlık: {veterinarian.specialization}</Card.Text>
            {veterinarian.averageRating >= 0 && (
              <Card.Text className="d-flex align-items-center gap-2 rating-stars text-secondary">
                <span className="fw-bold text-dark">
                  {Number(veterinarian.averageRating || 0).toFixed(1)}
                </span>
                <RatingStars rating={veterinarian.averageRating} />
                <span className="small">
                  ({veterinarian.totalReviewers || 0} değerlendirme)
                </span>
              </Card.Text>
            )}
            <Link
              to={`/book-appointment/${veterinarian.id}/new-appointment`}
              className="link"
            >
              Randevu Al
            </Link>
            <hr />
            <p className="about">
              Dr. {veterinarian.firstName} {veterinarian.lastName} Hakkında{" "}
            </p>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo
              asperiores sunt ipsam, tempore quod ab! Vitae, laboriosam
              quisquam! Consectetur, cum dolorem? Vitae magni molestiae odit
              eveniet sequi fugit corporis maxime.
            </p>
            <hr />
            <Rating veterinarianId={veterinarian.id} onReviewSubmit={null} />
            <h4 className="text-center mb-4">Yorumlar</h4>
            <hr />
            {currentReviews && currentReviews.length > 0 ? (
              currentReviews.map((review) => (
                <Review
                  key={review.id}
                  review={review}
                  userType={veterinarian.userType}
                />
              ))
            ) : (
              <p className="text-center">Henüz yorum yapılmamış.</p>
            )}
            <Paginator
              currentPage={currentPage}
              itemsPerPage={reviewsPerPage}
              totalItems={veterinarian.reviews.length}
              paginate={setCurrentPage}
            ></Paginator>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default Veterinarian;
