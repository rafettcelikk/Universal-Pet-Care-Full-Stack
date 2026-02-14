import React, { Fragment } from "react";
import placeholder from "../../assets/images/placeholder.jpg";
import { Card } from "react-bootstrap";

const UserPhoto = ({ userId, userPhoto, altText = "Kullanıcı Fotoğrafı" }) => {
  return (
    <Fragment>
      {userPhoto ? (
        <Card.Img
          src={`data:image/png;base64, ${userPhoto}`}
          className="user-image"
          alt={altText}
        />
      ) : (
        <Card.Img src={placeholder} className="user-image" alt={altText} />
      )}
    </Fragment>
  );
};

export default UserPhoto;
