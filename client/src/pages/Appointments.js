import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import Layout from '../components/Layout';
import { showLoading, hideLoading } from '../redux/alertsSlice';
import { Table } from 'antd';
import moment from 'moment';

const Appointments = () => {
  const dispatch = useDispatch();
  const [appointments, setAppointments] = useState([]);

  const getAppointmentsData = async () => {
    try {
      dispatch(showLoading());

      const response = await axios.get(
        '/api/appointments/get-appointments-by-user-id',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      console.log('getAppointmentsData() - response', response);

      if (response.data.success) {
        setAppointments(response.data.data);
      }
    } catch (error) {
      console.log('getAppointmentsData() - error', error);
    } finally {
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getAppointmentsData();
  }, []);

  const columns = [
    {
      title: 'ID',
      dataIndex: '_id',
      responsive: ['md'],
    },
    {
      title: 'Doctor',
      dataIndex: 'name',
      render: (text, record) => <span>{record.doctor?.fullName}</span>,
    },
    {
      title: 'Phone',
      responsive: ['md'],
      render: (text, record) => <span>{record.doctor?.phoneNumber}</span>,
    },
    {
      title: 'Date & Time',
      responsive: ['md'],
      render: (text, record) => (
        <span>{moment(record.dateTime).format('YYYY-MM-DD hh:mm')}</span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      responsive: ['md'],
    },
  ];

  return (
    <Layout>
      <h1 className="page-title">Appointments</h1>
      <hr />

      <Table columns={columns} dataSource={appointments} rowKey="_id" />
    </Layout>
  );
};

export default Appointments;
