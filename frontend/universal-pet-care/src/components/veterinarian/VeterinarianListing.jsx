import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import VeterinarianCard from "./VeterinarianCard";
import { getVeterinarians } from "./VeterinarianService";
import VeterinarianSearch from "./VeterinarianSearch";
import UseMessageAlerts from "../hooks/UseMessageAlerts";
import Paginator from "../common/Paginator";

const VeterinarianListing = () => {
  const [veterinarians, setVeterinarians] = useState([]);
  const [allVeterinarians, setAllVeterinarians] = useState([]);
  const { errorMessage, setErrorMessage, showErrorAlert, setShowErrorAlert } =
    UseMessageAlerts();
  const [currentPage, setCurrentPage] = useState(1);
  const [vetsPerPage] = useState(7);

  const indexOfLastVet = currentPage * vetsPerPage;
  const indexOfFirstVet = indexOfLastVet - vetsPerPage;
  const currentVets = veterinarians.slice(indexOfFirstVet, indexOfLastVet);

  useEffect(() => {
    getVeterinarians()
      .then((data) => {
        setVeterinarians(data.data);
        setAllVeterinarians(data.data);
      })
      .catch((error) => {
        setErrorMessage(error.response.data.message);
        setShowErrorAlert(true);
      });
  }, []);

  if (veterinarians.length === 0) {
    return <p>Veterinerler bulunamadı.</p>;
  }

  const handleSearchResults = (veterinarians) => {
    if (veterinarians === null) {
      setVeterinarians(allVeterinarians);
      setShowErrorAlert(false);
    } else if (Array.isArray(veterinarians) && veterinarians.length > 0) {
      setVeterinarians(veterinarians);
    } else {
      setVeterinarians([]);
    }
  };
  return (
    <Container>
      <Row className="justify-content-center">
        <h2 className="text-center mb-4 mt-4">Veterinerlerimizle Tanışın</h2>
      </Row>
      <Row className="justify-content-center">
        <Col md={4}>
          <VeterinarianSearch onSearchResults={handleSearchResults} />
        </Col>
        <Col md={7}>
          {currentVets.map((veterinarian, index) => (
            <VeterinarianCard key={index} veterinarian={veterinarian} />
          ))}
        </Col>
      </Row>
      <Paginator
        totalItems={veterinarians.length}
        itemsPerPage={vetsPerPage}
        currentPage={currentPage}
        paginate={setCurrentPage}
      />
    </Container>
  );
};

export default VeterinarianListing;
