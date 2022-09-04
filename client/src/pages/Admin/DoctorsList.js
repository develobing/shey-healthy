import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import Layout from '../../components/Layout';
import { showLoading, hideLoading } from '../../redux/alertsSlice';
import { Table } from 'antd';
import toast from 'react-hot-toast';

const DoctorsList = () => {
  const dispatch = useDispatch();
  const [doctors, setDoctors] = useState([]);

  const getDoctorsData = async () => {
    try {
      dispatch(showLoading());

      const response = await axios.get('/api/admin/get-all-doctors', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      console.log('getDoctorsData() - response', response);

      if (response.data.success) {
        setDoctors(response.data.data);
      }
    } catch (error) {
      console.log('getDoctorsData() - error', error);
    } finally {
      dispatch(hideLoading());
    }
  };

  const changeDoctorStatus = async (record, status) => {
    try {
      dispatch(showLoading());

      const response = await axios.post(
        '/api/admin/change-doctor-status',
        {
          userId: record.userId,
          doctorId: record._id,
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      console.log('changeDoctorStatus() - response', response);

      if (response.data.success) {
        toast.success(response.data.message);
        getDoctorsData();
      }
    } catch (error) {
      console.log('changeDoctorStatus() - error', error);
      toast.error("Error changing doctor's status");
    } finally {
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getDoctorsData();
  }, []);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      render: (text, record) => (
        <span>
          {record.firstName} {record.lastName}
        </span>
      ),
    },
    {
      title: 'Phone',
      dataIndex: 'phoneNumber',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
    },
    {
      title: 'Status',
      dataIndex: 'status',
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      render: (text, record) => (
        <div className="d-flex">
          {record.status === 'pending' && (
            <h1
              className="anchor"
              onClick={() => changeDoctorStatus(record, 'approved')}
            >
              Approve
            </h1>
          )}

          {record.status === 'approved' && (
            <h1
              className="anchor"
              onClick={() => changeDoctorStatus(record, 'blocked')}
            >
              Block
            </h1>
          )}

          {record.status === 'blocked' && (
            <h1
              className="anchor"
              onClick={() => changeDoctorStatus(record, 'pending')}
            >
              Unblock
            </h1>
          )}
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <h1 className="page-header">Doctors List</h1>

      <Table columns={columns} dataSource={doctors} />
    </Layout>
  );
};

export default DoctorsList;
