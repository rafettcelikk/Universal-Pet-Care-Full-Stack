import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, ListGroup, Row } from "react-bootstrap";
import { getVeterinarians } from "../veterinarian/VeterinarianService";
import VeterinarianSlider from "../veterinarian/VeterinarianSlider";
import NoDataAvailable from "../common/NoDataAvailable";
import d5 from "../../assets/images/d5.jpg";
import vett from "../../assets/images/vett.jpg";
import { useNavigate } from "react-router-dom";
import VeterinarianListing from "../veterinarian/VeterinarianListing";

export const Home = () => {
  const [veterinarians, setVeterinarians] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showListing, setShowListing] = useState(false);
  const navigate = useNavigate();

  const isLoggedIn = localStorage.getItem("authToken");

  const handleAppointmentClick = () => {
    if (isLoggedIn) {
      setShowListing(true);
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    getVeterinarians()
      .then((response) => {
        setVeterinarians(response.data);
      })
      .catch((error) => {
        setErrorMessage(
          error.response?.data?.message ||
            "Veterinerler yüklenirken bir hata oluştu",
        );
      });
  }, []);

  return (
    <Container className="home-container mt-5">
      {showListing ? (
        <VeterinarianListing />
      ) : (
        <>
          <Row>
            <Col md={6} className="mb-3">
              <Card>
                <Card.Img
                  variant="top"
                  src={d5}
                  alt="Hakkımızda"
                  className="hero-image"
                />
                <Card.Body>
                  <h2 className="text-info">Biz Kimiz</h2>
                  <Card.Title>Evcil Hayvanlarınız İçin En İyi Bakım</Card.Title>
                  <Card.Text>
                    Evrensel Evcil Hayvan Bakımı, olarak evcil hayvanlarınızın
                    sağlığı ve mutluluğu için kapsamlı hizmetler sunar.
                    Veteriner bakımı, beslenme danışmanlığı ve acil durum
                    hizmetleri ile yanınızdayız. Bu amaçla tüylü dostlarınıza en
                    iyi bakımı sağlamak için buradayız.
                  </Card.Text>
                  <Card.Text>
                    Misyonumuz, evcil hayvan sahiplerine güvenilir ve kaliteli
                    bakım sağlamaktır. Deneyimli veterinerlerimiz ve dost
                    canlısı personelimizle, evcil hayvanlarınızın ihtiyaçlarını
                    karşılamak için buradayız. Bu doğrultuda onlara sevgi dolu
                    bir ortam sunmayı bakımları sağlıkları için öncelikli
                    kılıyoruz.
                  </Card.Text>
                  <Button
                    variant="outline-info"
                    onClick={handleAppointmentClick}
                  >
                    Veterinerlerimizle Tanışın
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} className="mb-3">
              <Card>
                <Card.Img
                  variant="top"
                  src={vett}
                  alt="Veteriner"
                  className="hero-image"
                />
                <Card.Body>
                  <h2 className="text-info">Hizmetlerimiz</h2>
                  <Card.Title>Uzman Veteriner Hizmetleri</Card.Title>
                  <ListGroup className="services-list">
                    <ListGroup.Item>
                      Aşılar ve Sağlık Kontrolleri
                    </ListGroup.Item>
                    <ListGroup.Item>
                      Beslenme ve Diyet Danışmanlığı
                    </ListGroup.Item>
                    <ListGroup.Item>
                      Acil Durum ve Cerrahi Müdahaleler
                    </ListGroup.Item>
                    <ListGroup.Item>
                      Parazit Kontrolü ve Tedavisi
                    </ListGroup.Item>
                    <ListGroup.Item>Davranışsal Danışmanlık</ListGroup.Item>
                    <ListGroup.Item>Yaşlı Evcil Hayvan Bakımı</ListGroup.Item>
                  </ListGroup>
                  <Card.Text className="mt-3">
                    Evcil hayvanlarınızın sağlığı bizim önceliğimizdir. Uzman
                    veterinerlerimiz, en son teknolojiler ve tedavi yöntemleri
                    ile hizmetinizdedir.
                  </Card.Text>
                  <Button
                    variant="outline-info"
                    onClick={handleAppointmentClick}
                  >
                    Randevu Almak İçin Veterinerleri Gör
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <div className="card mb-5">
            <h4>
              Müşterilerimiz bizle alakalı ne söylüyor{" "}
              <span className="text-info">Evrensel Evcil Hayvan Bakımı</span>{" "}
              Veterinerleri
            </h4>
            <hr />
            <p className="text-center">
              Evrensel Evcil Hayvan Bakımı'na güveniyorum çünkü veterinerler son
              derece bilgili ve evcil hayvanlarımın ihtiyaçlarını anlıyorlar.
              Onların profesyonelliği ve şefkati beni her zaman etkiliyor.
            </p>
            {veterinarians.length > 0 ? (
              <VeterinarianSlider veterinarians={veterinarians} />
            ) : (
              <NoDataAvailable
                dataType="veteriner"
                errorMessage={errorMessage}
              />
            )}
          </div>
        </>
      )}
    </Container>
  );
};

export default Home;
