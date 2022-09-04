import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button } from 'antd';
import axios from 'axios';
import toast from 'react-hot-toast';
import { showLoading, hideLoading } from '../redux/alertsSlice';

function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.alerts);

  const onFinish = async (values) => {
    console.log('onFinish() - values', values);

    try {
      dispatch(showLoading());

      const response = await axios.post('/api/users/register', values);

      if (response.data.success) {
        toast.success(response.data.message);
        toast('Redirecting to login page');
        navigate('/login');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log('Register - error', error);
      toast.error('Something went wrong');
    } finally {
      dispatch(hideLoading());
    }
  };

  return (
    <div className="authentication">
      <div className="authentication-form card p-3">
        <h1 className="card-title">Nice to meet you</h1>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Name" name="name">
            <Input placeholder="Name" />
          </Form.Item>

          <Form.Item label="Email" name="email">
            <Input placeholder="Email" type="email" />
          </Form.Item>

          <Form.Item label="Password" name="password">
            <Input placeholder="Password" type="password" />
          </Form.Item>

          <div className="d-flex flex-column">
            <Button
              className="primary-button my-2 full-width-button"
              htmlType="submit"
            >
              Register
            </Button>

            <Link to="/login" className="anchor mt-2">
              Click here to Login
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default Register;
