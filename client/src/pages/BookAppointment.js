import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { showLoading, hideLoading } from '../redux/alertsSlice';
import Layout from '../components/Layout';
import { Row, Col, DatePicker, TimePicker, Button } from 'antd';
import moment from 'moment';

const BookAppointment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const { user } = useSelector((state) => state.user);
  const [doctor, setDoctor] = useState(null);
  const [isAvailable, setIsAvailable] = useState(false);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);

  const getDoctorData = async () => {
    try {
      dispatch(showLoading());

      const response = await axios.post(
        '/api/doctors/get-doctor-info-by-user-id',
        {
          userId: params?.userId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      console.log('getDoctorData() - response', response);

      if (response.data.success) {
        setDoctor(response.data.data);
      } else {
        throw new Error('Failed to get doctor');
      }
    } catch (error) {
      console.log('getDoctorData() - error', error);
    } finally {
      dispatch(hideLoading());
    }
  };

  const bookNow = async () => {
    try {
      dispatch(showLoading());

      const response = await axios.post(
        '/api/appointments/book-appointment',
        {
          userId: user?._id,
          doctorId: doctor?._id,
          dateTime: `${moment(date).format('DD-MM-YYYY')} ${time}`,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      console.log('bookNow() - response', response);

      if (response.data.success) {
        toast.success('Appointment booked successfully');
        navigate('/home');
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.log('bookNow() - error', error);
      toast.error(error?.message || 'Error booking appointment');
    } finally {
      dispatch(hideLoading());
    }
  };

  const checkAvailability = async () => {
    try {
      dispatch(showLoading());

      const response = await axios.post(
        '/api/appointments/check-booking-availability',
        {
          doctorId: doctor?._id,
          dateTime: `${moment(date).format('DD-MM-YYYY')} ${time}`,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      console.log('checkAvailability() - response', response);

      if (response.data.success) {
        toast.success(response.data.message);
        setIsAvailable(true);
      } else {
        throw new Error('Failed to check availability');
      }
    } catch (error) {
      console.log('checkAvailability() - error', error);
      toast.error('Error booking appointment');
    } finally {
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getDoctorData();
  }, []);

  return (
    <Layout>
      {doctor && (
        <div>
          <h1 className="page-title">
            {doctor?.firstName} {doctor?.lastName}
          </h1>
          <hr />

          <Row>
            <Col span={12} sm={24} xs={24} lg={8}>
              <p className="normal-text">
                <b>Timings:</b> {doctor?.timings[0]} - {doctor?.timings[1]}
              </p>

              <div className="d-flex flex-column mt-3">
                <DatePicker
                  format="DD-MM-YYYY"
                  onChange={(value) => {
                    setIsAvailable(false);
                    setDate(moment(value).format('DD-MM-YYYY'));
                  }}
                />
                <TimePicker
                  format="HH:mm"
                  className="mt-3"
                  onChange={(value) => {
                    setIsAvailable(false);
                    setTime(moment(value).format('HH:mm'));
                  }}
                />

                <Button
                  className="primary-button full-width-button mt-3"
                  onClick={checkAvailability}
                >
                  Check Availability
                </Button>

                <Button
                  disabled={!isAvailable}
                  className="primary-button full-width-button mt-3"
                  onClick={bookNow}
                >
                  Book Now
                </Button>
              </div>
            </Col>
          </Row>
        </div>
      )}
    </Layout>
  );
};

export default BookAppointment;
