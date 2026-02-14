import React from "react";
import { Carousel, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import RatingStars from "../rating/RatingStars";
import placeholderImage from "../../assets/images/placeholder.jpg";

const VeterinarianSlider = ({ veterinarians }) => {
  return (
    <main>
      <Carousel interval={5000} indicators={true} controls={true}>
        {veterinarians &&
          veterinarians.map((vet, index) => (
            <Carousel.Item key={index}>
              <Row className="align-items-center">
                <Col xs={12} md={4} className="text-center">
                  <Card.Img
                    src={
                      vet.photo
                        ? `data:image/png;base64,${vet.photo}`
                        : placeholderImage
                    }
                    alt={"photo"}
                    style={{
                      maxWidth: "400px",
                      maxHeight: "400px",
                      objectFit: "contain",
                    }}
                  />
                </Col>
                <Col xs={12} md={8}>
                  <div>
                    <RatingStars rating={vet.averageRating} />
                  </div>
                  <div>
                    <p className="text-success">
                      Dr. {`${vet.firstName} ${vet.lastName}`}
                    </p>
                  </div>
                  <p>{vet.specialization}</p>
                  <p>
                    <span className="text-info">
                      Dr. {`${vet.firstName} ${vet.lastName}`} uzmanlık dalı:{" "}
                      {vet.specialization}
                      <br />
                    </span>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Maxime mollitia, molestiae quas vel sint commodi repudiandae
                    consequuntur voluptatum laborum numquam blanditiis harum
                    quisquam eius sed odit fugiat iusto fuga praesentium optio,
                    eaque rerum! Provident similique accusantium nemo autem.
                    Veritatis obcaecati tenetur iure corporis!
                  </p>
                  <p>
                    <Link
                      className="me-3 link-2"
                      to={`/veterinarian/${vet.id}/veterinarian`}
                    >
                      İnsanların Dr. {`${vet.firstName} ${vet.lastName}`}{" "}
                      hakkında ne düşündüğünü görmek ister misiniz?
                    </Link>
                    Dr. {`${vet.firstName} ${vet.lastName}`} hakkında daha fazla
                    bilgi almak ister misiniz?
                  </p>
                  <p>
                    <Link className="me-3" to={"/veterinarians"}>
                      Tüm veterinerlerimizi görmek ister misiniz?
                    </Link>
                  </p>
                </Col>
              </Row>
            </Carousel.Item>
          ))}
      </Carousel>
    </main>
  );
};

export default VeterinarianSlider;
