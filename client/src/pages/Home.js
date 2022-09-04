import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { showLoading, hideLoading } from '../redux/alertsSlice';
import Layout from '../components/Layout';

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

      console.log('getData() - response', response);
    } catch (error) {
      console.log('Home - error', error);
    } finally {
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Layout>
      <h1>Home page</h1>
    </Layout>
  );
};

export default Home;
