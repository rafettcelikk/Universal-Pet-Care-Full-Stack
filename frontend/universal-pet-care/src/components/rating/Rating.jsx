import React, { useState } from "react";
import UseMessageAlerts from "../hooks/UseMessageAlerts";
import { Button, Form } from "react-bootstrap";
import { FaStar } from "react-icons/fa";
import AlertMessage from "../common/AlertMessage";
import { addReview } from "../review/ReviewService";

const Rating = ({ veterinarianId, onReviewSubmit }) => {
  const [hover, setHover] = useState(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  const {
    successMessage,
    setSuccessMessage,
    errorMessage,
    setErrorMessage,
    showSuccessAlert,
    setShowSuccessAlert,
    showErrorAlert,
    setShowErrorAlert,
  } = UseMessageAlerts();

  const reviewerId = localStorage.getItem("userId");

  const handleRatingChange = (value) => {
    setRating(value);
  };

  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setErrorMessage("Lütfen bir puan seçiniz.");
      setShowErrorAlert(true);
      return;
    }

    const reviewInfo = {
      rating: rating,
      feedback: feedback,
    };

    try {
      const response = await addReview(veterinarianId, reviewerId, reviewInfo);
      const msg = response.message || "İşlem başarılı!";

      setSuccessMessage(msg);
      setShowSuccessAlert(true);
      setShowErrorAlert(false);
      setRating(0);
      setFeedback("");
      setHover(null);

      if (onReviewSubmit) {
        onReviewSubmit();
      }
    } catch (error) {
      console.error("Yorum gönderme hatası:", error);
      setShowSuccessAlert(false);
      const errorMsg =
        error.response?.data?.message || error.message || "Bir hata oluştu.";
      setErrorMessage(errorMsg);
      setShowErrorAlert(true);
    }
  };
  return (
    <React.Fragment>
      {showErrorAlert && (
        <AlertMessage type={"danger"} message={errorMessage} />
      )}
      {showSuccessAlert && (
        <AlertMessage type={"success"} message={successMessage} />
      )}
      <Form onSubmit={handleSubmit}>
        <h3>Veteriner Puanı</h3>
        <div className="mb-2">
          {[...Array(5)].map((_, index) => {
            const ratingValue = index + 1;
            return (
              <Form.Label key={index} className="me-2">
                <Form.Check
                  type="radio"
                  name="rating"
                  value={ratingValue}
                  onChange={() => handleRatingChange(ratingValue)}
                  checked={rating === ratingValue}
                  inline
                />
                <FaStar
                  size={20}
                  className="star"
                  color={
                    ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"
                  }
                  onMouseEnter={() => setHover(ratingValue)}
                  onMouseLeave={() => setHover(null)}
                />
              </Form.Label>
            );
          })}
        </div>
        <div>
          <Form.Control
            as="textarea"
            rows={4}
            value={feedback}
            required
            onChange={handleFeedbackChange}
            placeholder="Lütfen yorumunuzu buraya yazınız..."
          />
        </div>
        <div className="mt-3">
          <Button type="submit" variant="primary">
            Gönder
          </Button>
        </div>
        <p className="mt-3">
          Bu veteriner doktora verdiğiniz puan:{" "}
          {rating > 0 ? ` ${rating} yıldız` : ""}
          <span style={{ color: "orange" }}>{rating} yıldız</span>
        </p>
      </Form>
    </React.Fragment>
  );
};

export default Rating;
