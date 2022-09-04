import React, { useEffect } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import { Tabs } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { showLoading, hideLoading } from '../redux/alertsSlice';
import { toast } from 'react-hot-toast';
import { setUser } from '../redux/userSlice';

const Notifications = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const markAllAsSeen = async () => {
    try {
      dispatch(showLoading());

      const response = await axios.post(
        '/api/users/mark-all-notifications-as-seen',
        {
          userId: user._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      console.log('markAllAsSeen() - response', response);

      if (response.data.success) {
        toast.success(response.data.message);
        dispatch(setUser(response.data.data));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log('markAllAsSeen - error', error);
      toast.error('Something went wrong');
    } finally {
      dispatch(hideLoading());
    }
  };

  const deleteAll = async () => {
    try {
      dispatch(showLoading());

      const response = await axios.post(
        '/api/users/delete-all-notifications',
        {
          userId: user._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        dispatch(setUser(response.data.data));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log('deleteAll - error', error);
      toast.error('Something went wrong');
    } finally {
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    if (!user) {
      // getUser();
    }
  }, [user]);

  return (
    <Layout>
      <h1 className="page-title">Notifications</h1>

      <Tabs>
        <Tabs.TabPane tab="unseen" key={1}>
          <div className="d-flex justify-content-end">
            <h1 className="anchor" onClick={markAllAsSeen}>
              Mark all as seen
            </h1>
          </div>

          {user?.unseenNotifications.map((notification, index) => (
            <div
              className="card p-2"
              onClick={() => navigate(notification.onClickPath)}
              key={index}
            >
              <div className="card-text">{notification?.message}</div>
            </div>
          ))}
        </Tabs.TabPane>

        <Tabs.TabPane tab="seen" key={2}>
          <div className="d-flex justify-content-end">
            <h1 className="anchor" onClick={deleteAll}>
              Delete all
            </h1>
          </div>
          {user?.seenNotifications.map((notification, index) => (
            <div
              className="card p-2"
              onClick={() => navigate(notification.onClickPath)}
              key={index}
            >
              <div className="card-text">{notification?.message}</div>
            </div>
          ))}
        </Tabs.TabPane>
      </Tabs>
    </Layout>
  );
};

export default Notifications;
