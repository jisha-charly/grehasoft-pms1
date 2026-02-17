import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';
import PrivateRoute from './PrivateRoute';

import MainLayout from '../layouts/MainLayout';

// Dashboards
import ExecutiveDashboard from '../pages/dashboard/ExecutiveDashboard';
import SoftwareDashboard from '../pages/dashboard/SoftwareDashboard';
import MarketingDashboard from '../pages/dashboard/MarketingDashboard';

// Auth Pages
import Login from '../pages/auth/Login';
import Unauthorized from '../pages/auth/Unauthorized';

// CRM
import LeadList from '../pages/crm/leads/LeadList';
import ClientList from '../pages/crm/clients/ClientList';

// PMS
import ProjectList from '../pages/pms/projects/ProjectList';
import KanbanPage from '../pages/pms/kanban/KanbanPage';
import MyTasks from '../pages/pms/tasks/MyTasks';

// Admin
import UserList from '../pages/admin/users/UserList';
import ActivityLogs from '../pages/admin/audit/ActivityLogs';

// Errors
import NotFound from '../pages/errors/NotFound';

const DashboardRouter = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  if (user.role === 'SUPER_ADMIN') {
    return <ExecutiveDashboard />;
  }

  if (user.department === 'software') {
    return <SoftwareDashboard />;
  }

  if (user.department === 'digital_marketing') {
    return <MarketingDashboard />;
  }

  return <Unauthorized />;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>

      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }
      >
        {/* Dashboard Auto Route */}
        <Route index element={<DashboardRouter />} />

        {/* CRM */}
        <Route path="crm/leads" element={<LeadList />} />
        <Route path="crm/clients" element={<ClientList />} />

        {/* PMS */}
        <Route path="pms/projects" element={<ProjectList />} />
        <Route path="pms/kanban/:projectId" element={<KanbanPage />} />
        <Route path="pms/my-tasks" element={<MyTasks />} />

        {/* Admin */}
        <Route path="admin/users" element={<UserList />} />
        <Route path="admin/activity" element={<ActivityLogs />} />

      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
};

export default AppRoutes;
