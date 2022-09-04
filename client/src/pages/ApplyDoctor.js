import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import toast from 'react-hot-toast';
import { showLoading, hideLoading } from '../redux/alertsSlice';
import Layout from '../components/Layout';
import DoctorForm from '../components/DoctorForm';

const ApplyDoctor = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, token } = useSelector((state) => state.user);
  const { loading } = useSelector((state) => state.alerts);

  const onFinish = async (values) => {
    console.log('onFinish() - values', values);

    try {
      dispatch(showLoading());

      const response = await axios.post(
        '/api/users/apply-doctor-account',
        {
          ...values,
          timings: [
            moment(values?.timings?.[0].format('HH:mm')),
            moment(values?.timings?.[1].format('HH:mm')),
          ],
          userId: user._id,
          email: user.email,
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
      <h1 className="page-title">Apply Doctor</h1>
      <hr />

      <DoctorForm onFinish={onFinish} />
    </Layout>
  );
};

export default ApplyDoctor;
