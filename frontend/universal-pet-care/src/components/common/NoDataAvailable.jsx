import React from "react";

const NoDataAvailable = ({ dataType, errorMessage }) => {
  return (
    <div className="text-center mt-5">
      <h4>Oops! Görünüşe göre henüz {dataType} bulunmamaktadır.</h4>
      {errorMessage && <p className="text-danger">{errorMessage}</p>}
    </div>
  );
};

export default NoDataAvailable;
