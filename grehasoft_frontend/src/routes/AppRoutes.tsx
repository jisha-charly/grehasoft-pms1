import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PATHS } from './paths';
import PrivateRoute from './PrivateRoute';
import { useAuth } from '../context/AuthContext';

// Layouts
import MainLayout from '../layouts/MainLayout';

// Pages (Lazy loading recommended for production)
import Login from '../pages/auth/Login';
import Unauthorized from '../pages/auth/Unauthorized';
import ExecutiveDashboard from '../pages/dashboard/ExecutiveDashboard';
import SoftwareDashboard from '../pages/dashboard/SoftwareDashboard';
import MarketingDashboard from '../pages/dashboard/MarketingDashboard';
import LeadList from '../pages/crm/leads/LeadList';
import ProjectList from '../pages/pms/projects/ProjectList';
import KanbanPage from '../pages/pms/kanban/KanbanPage';
import UserList from '../pages/admin/users/UserList';
import ActivityLogs from '../pages/admin/audit/ActivityLogs';

/**
 * Logic to decide which dashboard a user lands on after login
 */
const DashboardRedirect = () => {
  const { user } = useAuth();
  if (user?.role === 'SUPER_ADMIN') return <Navigate to={PATHS.DASHBOARD.EXECUTIVE} />;
  
  const dept = user?.department?.name.toLowerCase();
  if (dept?.includes('software')) return <Navigate to={PATHS.DASHBOARD.SOFTWARE} />;
  if (dept?.includes('marketing')) return <Navigate to={PATHS.DASHBOARD.MARKETING} />;
  
  return <Navigate to={PATHS.AUTH.UNAUTHORIZED} />;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path={PATHS.AUTH.LOGIN} element={<Login />} />
      <Route path={PATHS.AUTH.UNAUTHORIZED} element={<Unauthorized />} />

      {/* Protected Routes (Main Layout Wrapper) */}
      <Route
        element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }
      >
        {/* Root Redirect Logic */}
        <Route path="/" element={<DashboardRedirect />} />
        
        {/* Dashboards */}
        <Route path={PATHS.DASHBOARD.EXECUTIVE} element={
            <PrivateRoute allowedRoles={['SUPER_ADMIN']}><ExecutiveDashboard /></PrivateRoute>
        } />
        <Route path={PATHS.DASHBOARD.SOFTWARE} element={<SoftwareDashboard />} />
        <Route path={PATHS.DASHBOARD.MARKETING} element={<MarketingDashboard />} />

        {/* CRM Module */}
        <Route path={PATHS.CRM.LEADS} element={
            <PrivateRoute allowedRoles={['SUPER_ADMIN', 'SALES_EXECUTIVE']}><LeadList /></PrivateRoute>
        } />
        <Route path={PATHS.CRM.CLIENTS} element={<div>Clients List Component</div>} />

        {/* PMS Module */}
        <Route path={PATHS.PMS.PROJECTS} element={<ProjectList />} />
        <Route path="/pms/projects/:projectId/kanban" element={<KanbanPage />} />
        <Route path={PATHS.PMS.MY_TASKS} element={<div>My Tasks Component</div>} />

        {/* Admin Module */}
        <Route path={PATHS.ADMIN.USERS} element={
            <PrivateRoute allowedRoles={['SUPER_ADMIN']}><UserList /></PrivateRoute>
        } />
        <Route path={PATHS.ADMIN.AUDIT_LOGS} element={
            <PrivateRoute allowedRoles={['SUPER_ADMIN']}><ActivityLogs /></PrivateRoute>
        } />
      </Route>

      {/* Fallback 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;