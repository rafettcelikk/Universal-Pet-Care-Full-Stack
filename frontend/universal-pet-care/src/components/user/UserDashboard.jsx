import React, { useEffect, useState } from "react";
import { Card, Col, Container, Row, Tab, Tabs } from "react-bootstrap";
import UserProfile from "./UserProfile";
import UseMessageAlerts from "../hooks/UseMessageAlerts";
import { getUserById, deleteUser } from "./UserService";
import { deleteUserPhoto } from "../photo/PhotoUploaderService";
import AlertMessage from "../common/AlertMessage";
import Review from "../review/Review";
import UserAppointments from "../appointment/UserAppointments";
import CustomPieChart from "../charts/CustomPieChart";
import { formattedAppointmentStatuses } from "../utils/utilities";
import NoDataAvailable from "../common/NoDataAvailable";
import { useParams } from "react-router-dom";
import { logout } from "../auth/AuthService";

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [appointmentData, setAppointmentData] = useState([]);
  const [activeKey, setActiveKey] = useState(() => {
    const storedActiveKey = localStorage.getItem("activeKey");
    return storedActiveKey ? storedActiveKey : "profile";
  });
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

  const { userId } = useParams();

  const currentUserId = localStorage.getItem("userId");

  const isCurrentUser = userId === currentUserId;

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await getUserById(userId);
        setUser(response.data);
        setAppointments(response.data.appointments);
      } catch (error) {
        setErrorMessage(error.response.data.message);
        setShowErrorAlert(true);
      }
    };
    getUser();
  }, [userId]);

  useEffect(() => {
    if (user && user.appointments) {
      const statusCounts = user.appointments.reduce((acc, appointment) => {
        const formattedStatus = formattedAppointmentStatuses(
          appointment.status,
        );
        if (!acc[formattedStatus]) {
          acc[formattedStatus] = {
            name: formattedStatus,
            value: 1,
          };
        } else {
          acc[formattedStatus].value += 1;
        }
        return acc;
      }, {});
      const transformedData = Object.values(statusCounts);
      setAppointmentData(transformedData);
      setAppointments(user.appointments);
      console.log("Transformed Data:", transformedData);
    }
  }, [user]);

  const handleRemovePhoto = async () => {
    try {
      const response = await deleteUserPhoto(user.photoId, userId);
      setSuccessMessage(response.message);
      window.location.reload();
      setShowSuccessAlert(true);
    } catch (error) {
      setErrorMessage(error.message);
      setShowErrorAlert(true);
    }
  };
  const handleDeleteAccount = async () => {
    try {
      const response = await deleteUser(userId);
      setSuccessMessage(response.data.message);
      setShowSuccessAlert(true);
      setTimeout(() => {
        logout();
      }, 10000);
    } catch (error) {
      setErrorMessage(error.message);
      setShowErrorAlert(true);
      console.error(error.message);
    }
  };

  const handleTabSelect = (key) => {
    setActiveKey(key);
    localStorage.setItem("activeKey", key);
  };
  return (
    <Container className="mt-2 user-dashboard">
      <Tabs
        className="mb-2"
        justify
        activeKey={activeKey}
        onSelect={handleTabSelect}
      >
        {showSuccessAlert && (
          <AlertMessage type={"success"} message={successMessage} />
        )}
        {showErrorAlert && (
          <AlertMessage type={"danger"} message={errorMessage} />
        )}
        <Tab eventKey="profile" title={<h3>Profilim</h3>}>
          {user && (
            <UserProfile
              user={user}
              handleRemovePhoto={handleRemovePhoto}
              handleDeleteAccount={handleDeleteAccount}
            />
          )}
        </Tab>
        <Tab eventKey="status" title={<h3>Randevu Durumları</h3>}>
          <Row>
            <Col>
              {appointmentData && appointmentData.length > 0 ? (
                <CustomPieChart data={appointmentData} />
              ) : (
                <NoDataAvailable dataType="randevu durumu verisi" />
              )}
            </Col>
          </Row>
        </Tab>
        {isCurrentUser && (
          <Tab
            eventKey="appointment-details"
            title={<h3>Randevu Detayları</h3>}
          >
            <Row>
              <Col>
                {user && (
                  <React.Fragment>
                    {appointments && appointments.length > 0 ? (
                      <UserAppointments
                        user={user}
                        appointments={appointments}
                      />
                    ) : (
                      <NoDataAvailable dataType="randevu detayı" />
                    )}
                  </React.Fragment>
                )}
              </Col>
            </Row>
          </Tab>
        )}
        <Tab eventKey="reviews" title={<h3>Yorumlarım</h3>}>
          <Container className="d-flex justify-content-center align-items-center">
            <Card className="mt-5 mb-4 review-card">
              <h4 className="text-center mb-2">Yorumlarım</h4>
              <hr />
              <Row>
                <Col>
                  {user && user.reviews && user.reviews.length > 0 ? (
                    user.reviews.map((review, index) => (
                      <Review
                        key={index}
                        review={review}
                        userType={user.userType}
                      />
                    ))
                  ) : (
                    <NoDataAvailable dataType="yorum" />
                  )}
                </Col>
              </Row>
            </Card>
          </Container>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default UserDashboard;
