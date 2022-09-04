import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import Layout from '../../components/Layout';
import { showLoading, hideLoading } from '../../redux/alertsSlice';
import { Table } from 'antd';

const UsersList = () => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);

  const getUsersData = async () => {
    try {
      dispatch(showLoading());

      const response = await axios.get('/api/admin/get-all-users', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      console.log('getUsersData() - response', response);

      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (error) {
      console.log('getUsersData() - error', error);
    } finally {
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getUsersData();
  }, []);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      render: (text, record) => (
        <div className="d-flex">
          <h1 className="anchor">Block</h1>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <h1 className="page-header">Users List</h1>

      <Table columns={columns} dataSource={users} />
    </Layout>
  );
};

export default UsersList;
