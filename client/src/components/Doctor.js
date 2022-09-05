import React from 'react';
import { useNavigate } from 'react-router-dom';

const Doctor = ({ doctor }) => {
  const navigate = useNavigate();

  return (
    <div
      className="card p-2 cursor-pointer"
      onClick={() => navigate(`/book-appointment/${doctor.user}`)}
    >
      <h1 className="card-title">
        {doctor?.firstName} {doctor?.lastName}
      </h1>

      <p className="card-text">
        <b>Email:</b> {doctor?.email}
      </p>

      <p className="card-text">
        <b>Phone Number:</b> {doctor?.phoneNumber}
      </p>

      <p className="card-text">
        <b>Address:</b> {doctor?.address}
      </p>

      <p className="card-text">
        <b>Fee per Visit:</b> {doctor?.feePerConsultation}
      </p>

      <p className="card-text">
        <b>Timings:</b>
        {doctor?.timings[0]} - {doctor?.timings[1]}
      </p>
    </div>
  );
};

export default Doctor;
