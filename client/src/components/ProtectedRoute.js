import axios from 'axios';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import { hideLoading, showLoading } from '../redux/alertsSlice';
import { setUser } from '../redux/userSlice';

const ProtectedRoute = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.user);

  const getUser = async () => {
    try {
      dispatch(showLoading());

      const response = await axios.post(
        '/api/users/get-user-info-by-id',
        {
          token: localStorage.getItem('token'),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.data.success) {
        dispatch(setUser(response.data.data));
      } else {
        throw new Error('Failed to get user');
      }
    } catch (error) {
      console.log('ProtectedRoute - error', error);

      localStorage.removeItem('token');
      navigate('/login');
    } finally {
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    if (!user) {
      getUser();
    }
  }, []);

  if (localStorage.getItem('token')) {
    return props.children;
  } else {
    return <Navigate to="/login" />;
  }
};

export default ProtectedRoute;
