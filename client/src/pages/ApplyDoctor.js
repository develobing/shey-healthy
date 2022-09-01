import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { showLoading, hideLoading } from '../redux/alertsSlice';
import { Form, Col, Row, Input, TimePicker, Button } from 'antd';
import Layout from '../components/Layout';

const ApplyDoctor = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, token } = useSelector((state) => state.user);
  const { loading } = useSelector((state) => state.alerts);

  const onFinish = async (values) => {
    console.log('values', values);

    try {
      dispatch(showLoading());

      const response = await axios.post(
        '/api/users/apply-doctor-account',
        {
          ...values,
          userId: user._id,
          email: user.email,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        navigate('/');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log('ApplyDoctor - error', error);

      toast.error('Something went wrong');
    } finally {
      dispatch(hideLoading());
    }
  };
  return (
    <Layout>
      <h1 className="page-title">Apply Doctor</h1>
      <hr />

      <Form layout="vertical" onFinish={onFinish}>
        <h1 className="card-title mt-4">Personal Information</h1>

        <Row gutter={20}>
          <Col span={8} xs={24} sm={24} lg={8}>
            <Form.Item
              required
              label="First Name"
              name="firstName"
              rules={[{ required: true }]}
            >
              <Input placeholder="First Name" />
            </Form.Item>
          </Col>

          <Col span={8} xs={24} sm={24} lg={8}>
            <Form.Item
              required
              label="Last Name"
              name="lastName"
              rules={[{ required: true }]}
            >
              <Input placeholder="Last Name" />
            </Form.Item>
          </Col>

          <Col span={8} xs={24} sm={24} lg={8}>
            <Form.Item
              required
              label="Phone Number"
              name="phoneNumber"
              rules={[{ required: true }]}
            >
              <Input placeholder="Phone Number" />
            </Form.Item>
          </Col>

          <Col span={8} xs={24} sm={24} lg={8}>
            <Form.Item
              required
              label="Website"
              name="website"
              rules={[{ required: true }]}
            >
              <Input placeholder="Website" />
            </Form.Item>
          </Col>
        </Row>
        <hr />

        <h1 className="card-title mt-4">Professional Information</h1>

        <Row gutter={20}>
          <Col span={8} xs={24} sm={24} lg={8}>
            <Form.Item
              required
              label="Specialization"
              name="specialization"
              rules={[{ required: true }]}
            >
              <Input placeholder="Specialization" />
            </Form.Item>
          </Col>

          <Col span={8} xs={24} sm={24} lg={8}>
            <Form.Item
              required
              label="Experience"
              name="experience"
              rules={[{ required: true }]}
            >
              <Input placeholder="Experience" />
            </Form.Item>
          </Col>

          <Col span={8} xs={24} sm={24} lg={8}>
            <Form.Item
              required
              label="Fee Per Consultation"
              name="feePerConsultation"
              rules={[{ required: true }]}
            >
              <Input placeholder="Fee Per Consultation" />
            </Form.Item>
          </Col>

          <Col span={8} xs={24} sm={24} lg={8}>
            <Form.Item
              required
              label="Timings"
              name="timinigs"
              rules={[{ required: true }]}
            >
              <TimePicker.RangePicker />
            </Form.Item>
          </Col>

          <Col span={8} xs={24} sm={24} lg={8}>
            <Form.Item
              required
              label="Address"
              name="address"
              rules={[{ required: true }]}
            >
              <Input placeholder="Address" />
            </Form.Item>
          </Col>
        </Row>

        <div className="d-flex justify-content-end">
          <Button className="primary-button" htmlType="submit">
            Submit
          </Button>
        </div>
      </Form>
    </Layout>
  );
};

export default ApplyDoctor;
