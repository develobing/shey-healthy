import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { showLoading, hideLoading } from '../redux/alertsReducer';

const Home = () => {
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(showLoading());

      const response = await axios.post(
        `/api/users/get-user-info-by-id`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      console.log('response.data', response.data);
    } catch (error) {
      console.log('Home - error', error);
    } finally {
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return <div>Home</div>;
};

export default Home;
