import React from 'react';
import { useAuth } from '../context/AuthContext';
import BusinessDashboard from './dashboards/BusinessDashboard';
import HelperDashboard from './dashboards/HelperDashboard';
import NormalDashboard from './dashboards/NormalDashboard';
import AdminDashboard from './dashboards/AdminDashboard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case 'business':
      return <BusinessDashboard />;
    case 'helper':
      return <HelperDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return <NormalDashboard />;
  }
};

export default Dashboard;
