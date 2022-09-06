import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { Row, Col } from 'antd';
import { showLoading, hideLoading } from '../redux/alertsSlice';
import Layout from '../components/Layout';
import Doctor from '../components/Doctor';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.user);
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
      <h1 className="page-title">Doctors</h1>
      <hr />

      {doctors?.length > 0 ? (
        <Row gutter={20}>
          {doctors.map((doctor) => (
            <Col span={8} xs={24} sm={24} lg={8} key={doctor?._id}>
              <Doctor doctor={doctor} />
            </Col>
          ))}
        </Row>
      ) : (
        <div className="d-flex flex-column justify-content-center align-items-center">
          <h2 className="title-text">No doctors found</h2>

          {!user?.isDoctor && !user?.isAdmin && (
            <p
              className="normal-text cursor-pointer"
              onClick={() => navigate('/apply-doctor')}
            >
              Apply doctor
            </p>
          )}
        </div>
      )}
    </Layout>
  );
};

export default Home;
