import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import Layout from '../../components/Layout';
import { showLoading, hideLoading } from '../../redux/alertsSlice';
import { Table } from 'antd';
import toast from 'react-hot-toast';
import moment from 'moment';

const DoctorAppointments = () => {
  const dispatch = useDispatch();
  const [appointments, setAppointments] = useState([]);

  const getAppointmentsData = async () => {
    try {
      dispatch(showLoading());

      const response = await axios.get(
        '/api/appointments/get-appointments-by-doctor-id',
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

  const changeAppointmentStatus = async (record, status) => {
    try {
      dispatch(showLoading());

      const response = await axios.post(
        '/api/appointments/change-appointment-status',
        {
          appointmentId: record._id,
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      console.log('changeAppointmentStatus() - response', response);

      if (response.data.success) {
        toast.success(response.data.message);
        getAppointmentsData();
      }
    } catch (error) {
      console.log('changeAppointmentStatus() - error', error);
      toast.error("Error changing appointment's status");
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
    },
    {
      title: 'Patient',
      dataIndex: 'name',
      render: (text, record) => <span>{record.user?.name}</span>,
    },
    {
      title: 'Phone',
      render: (text, record) => <span>{record.doctor?.phoneNumber}</span>,
    },
    {
      title: 'Date & Time',
      dataIndex: 'dateTime',
      render: (text, record) => (
        <span>{moment(record.dateTime).format('YYYY-MM-DD hh:mm')}</span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      render: (text, record) => (
        <div className="d-flex flex-column">
          {(record.status === 'pending' || record.status === 'rejected') && (
            <h1
              className="anchor"
              onClick={() => changeAppointmentStatus(record, 'approved')}
            >
              Approve
            </h1>
          )}

          {(record.status === 'pending' || record.status === 'approved') && (
            <h1
              className="anchor"
              onClick={() => changeAppointmentStatus(record, 'rejected')}
            >
              Reject
            </h1>
          )}
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <h1 className="page-header">Appointments</h1>

      <Table columns={columns} dataSource={appointments} rowKey="_id" />
    </Layout>
  );
};

export default DoctorAppointments;
