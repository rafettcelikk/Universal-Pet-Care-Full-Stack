import React from "react";
import { Accordion, Card, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import UserPhoto from "../common/UserPhoto";
import RatingStars from "../rating/RatingStars";

const VeterinarianCard = ({ veterinarian }) => {
  return (
    <Col key={veterinarian.id} className="mb-4" xs={12}>
      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <div className="d-flex align-items-center me-5">
              <Link
                to={`/veterinarian-reviews/${veterinarian.id}/veterinarian`}
                className="link-2"
              >
                <UserPhoto
                  userId={veterinarian.id}
                  userPhoto={veterinarian.photo}
                />
              </Link>
            </div>
            <div>
              <Card.Title className="title">
                Dr. {veterinarian.firstName} {veterinarian.lastName}
              </Card.Title>
              <Card.Title>
                <h6>{veterinarian.specialization}</h6>
              </Card.Title>
              <Card.Text className="review rating-stars">
                Yorumlar: <RatingStars rating={veterinarian.averageRating} /> (
                {veterinarian.totalReviewers})
              </Card.Text>
              <Link
                to={`/book-appointment/${veterinarian.id}/new-appointment`}
                className="link"
              >
                Randevu Al
              </Link>
            </div>
          </Accordion.Header>
          <Accordion.Body>
            <div>
              <Link
                to={`/veterinarian-reviews/${veterinarian.id}/veterinarian`}
                className="link-2"
              >
                Bakın insanlar ne diyor
              </Link>{" "}
              <span className="margin-left-space">
                Dr. {veterinarian.firstName} {veterinarian.lastName}
              </span>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Col>
  );
};

export default VeterinarianCard;
