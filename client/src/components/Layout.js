import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Badge } from 'antd';
import '../layout.css';
import { setUser } from '../redux/userSlice';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);
  const [collapsed, SetCollapsed] = useState(false);

  const userMenus = [
    {
      name: 'Home',
      path: '/',
      icon: 'ri-home-line',
    },
    {
      name: 'Appointments',
      path: '/appointments',
      icon: 'ri-file-list-line',
    },
    {
      name: 'Apply Doctor',
      path: '/apply-doctor',
      icon: 'ri-hospital-line',
    },
    {
      name: 'Profile',
      path: '/profile',
      icon: 'ri-profile-line',
    },
  ];

  const doctorMenus = [
    {
      name: 'Home',
      path: '/',
      icon: 'ri-home-line',
    },
    {
      name: 'Appointments',
      path: '/doctor/appointments',
      icon: 'ri-file-list-line',
    },
    {
      name: 'Profile',
      path: `/doctor/profile/${user?._id}`,
      icon: 'ri-profile-line',
    },
  ];

  const adminMenus = [
    {
      name: 'Home',
      path: '/',
      icon: 'ri-home-line',
    },
    {
      name: 'Appointments',
      path: '/appointments',
      icon: 'ri-file-list-line',
    },
    {
      name: 'Users',
      path: '/admin/users',
      icon: 'ri-user-line',
    },
    {
      name: 'Doctors',
      path: '/admin/doctors',
      icon: 'ri-user-star-line',
    },
    {
      name: 'Profile',
      path: '/profile',
      icon: 'ri-profile-line',
    },
  ];

  const role = user?.isAdmin
    ? 'Admin'
    : user?.isDoctor
    ? 'Doctor'
    : !!user
    ? 'User'
    : null;
  const menuToBeRendered = user?.isAdmin
    ? adminMenus
    : user?.isDoctor
    ? doctorMenus
    : !!user
    ? userMenus
    : [];

  return (
    <div className="main">
      <div className="d-flex layout">
        <div className={collapsed ? 'collapsed-sidebar' : 'sidebar'}>
          <div className="sidebar-header">
            <h1 className="logo">SH</h1>
            {role && <h1 className="role">{role}</h1>}
          </div>

          <div className="menu">
            {menuToBeRendered.map((menu) => {
              const isActive = location.pathname === menu.path;

              return (
                <div
                  className={`d-flex menu-item ${
                    isActive && 'active-menu-item'
                  }`}
                  key={menu.path}
                >
                  <i className={menu.icon}></i>
                  {!collapsed && <Link to={menu.path}>{menu.name}</Link>}
                </div>
              );
            })}

            <div
              className="d-flex menu-item"
              onClick={() => {
                localStorage.clear();
                dispatch(setUser(null));
                navigate('/login');
              }}
            >
              <i className="ri-logout-box-line"></i>
              {!collapsed && <Link to="/login">Logout</Link>}
            </div>
          </div>
        </div>

        <div className="content">
          <div className="header">
            {collapsed ? (
              <i
                className="ri-menu-2-fill header-action-icon"
                onClick={() => SetCollapsed(false)}
              ></i>
            ) : (
              <i
                className="ri-close-fill header-action-icon"
                onClick={() => SetCollapsed(true)}
              ></i>
            )}

            <div className="d-flex align-items-center px-4">
              <Badge
                count={user?.unseenNotifications?.length}
                className="mx-3"
                onClick={() => navigate('/notifications')}
              >
                <i className="ri-notification-line header-action-icon"></i>
              </Badge>

              <Link className="anchor" to="/profile">
                {user?.name}
              </Link>
            </div>
          </div>

          <div className="body">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
