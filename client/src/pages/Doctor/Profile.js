import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { showLoading, hideLoading } from '../../redux/alertsSlice';
import Layout from '../../components/Layout';
import DoctorForm from '../../components/DoctorForm';
import moment from 'moment';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const { user } = useSelector((state) => state.user);
  const [doctor, setDoctor] = useState(null);

  const getDoctorData = async () => {
    try {
      dispatch(showLoading());

      const response = await axios.post(
        '/api/doctors/get-doctor-info-by-user-id',
        {
          userId: params?.doctorId,
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

  useEffect(() => {
    getDoctorData();
  }, []);

  const onFinish = async (values) => {
    console.log('onFinish() - values', values);

    try {
      dispatch(showLoading());

      const response = await axios.post(
        '/api/doctors/update-doctor-profile',
        {
          userId: params?.doctorId,
          timings: [
            moment(values?.timings?.[0].format('HH:mm')),
            moment(values?.timings?.[1].format('HH:mm')),
          ],
          ...values,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      console.log('onFinish() - response', response);

      if (response.data.success) {
        toast.success(response.data.message);
        navigate('/');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log('onFinish() - error', error);

      toast.error('Something went wrong');
    } finally {
      dispatch(hideLoading());
    }
  };

  return (
    <Layout>
      <h1 className="page-title">Profile</h1>

      <hr />

      {doctor && <DoctorForm initialValues={doctor} onFinish={onFinish} />}
    </Layout>
  );
};

export default Profile;
