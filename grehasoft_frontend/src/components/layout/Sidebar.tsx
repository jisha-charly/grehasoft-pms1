import React from 'react';
import { SidebarItem } from './SidebarItem';
import { useAuth } from '../../hooks/useAuth';
import { PATHS } from '../../routes/paths';

interface Props {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<Props> = ({ isOpen }) => {
  const { user } = useAuth();
  const deptName = user?.department?.name || 'Global Admin';

  return (
    <aside className={`sidebar custom-scrollbar ${isOpen ? 'show' : 'hide'}`}>
      <div className="d-flex flex-column h-100">
        <div className="sidebar-header p-4">
          <h5 className="fw-bold text-primary mb-0">Grehasoft</h5>
          <small className="text-muted text-uppercase xsmall fw-bold">{deptName}</small>
        </div>

        <nav className="flex-grow-1">
          <div className="px-3 mb-2 small text-muted text-uppercase fw-bold xsmall">General</div>
          <SidebarItem to="/" label="Dashboard" icon="bi-grid-1x2" />
          
          <div className="px-3 mt-4 mb-2 small text-muted text-uppercase fw-bold xsmall">Sales & Clients</div>
          <SidebarItem 
            to={PATHS.CRM.LEADS} 
            label="Leads" 
            icon="bi-person-plus" 
            allowedRoles={['SUPER_ADMIN', 'SALES_EXECUTIVE']} 
          />
          <SidebarItem to={PATHS.CRM.CLIENTS} label="Clients" icon="bi-building" />

          <div className="px-3 mt-4 mb-2 small text-muted text-uppercase fw-bold xsmall">Execution</div>
          <SidebarItem to={PATHS.PMS.PROJECTS} label="Projects" icon="bi-kanban" />
          <SidebarItem to={PATHS.PMS.MY_TASKS} label="My Tasks" icon="bi-check2-square" />

          <div className="px-3 mt-4 mb-2 small text-muted text-uppercase fw-bold xsmall">Administration</div>
          <SidebarItem 
            to={PATHS.ADMIN.USERS} 
            label="Staff Directory" 
            icon="bi-people" 
            allowedRoles={['SUPER_ADMIN']} 
          />
          <SidebarItem 
            to={PATHS.ADMIN.AUDIT_LOGS} 
            label="Audit Trail" 
            icon="bi-shield-check" 
            allowedRoles={['SUPER_ADMIN']} 
          />
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;