import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { Row, Col } from 'antd';
import { showLoading, hideLoading } from '../redux/alertsSlice';
import Layout from '../components/Layout';
import Doctor from '../components/Doctor';

const Home = () => {
  const dispatch = useDispatch();

  const [doctors, setDoctors] = useState([]);

  const getApprovedDoctors = async () => {
    try {
      dispatch(showLoading());

      const response = await axios.get(`/api/users/get-all-approved-doctors`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      console.log('getApprovedDoctors() - response', response);

      if (response.data.success) {
        setDoctors(response.data.data);
      }
    } catch (error) {
      console.log('Home - error', error);
    } finally {
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getApprovedDoctors();
  }, []);

  return (
    <Layout>
      <Row gutter={20}>
        {doctors.map((doctor) => (
          <Col span={8} xs={24} sm={24} lg={8} key={doctor?._id}>
            <Doctor doctor={doctor} />
          </Col>
        ))}
      </Row>
    </Layout>
  );
};

export default Home;
