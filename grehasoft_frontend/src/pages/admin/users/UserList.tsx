import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import { authService } from '../../../api/auth.service';
import type{ User } from '../../../types/auth';
import { DataTable } from '../../../components/common/DataTable';
import { Button } from '../../../components/common/Button';
import { dateHelper } from '../../../utils/dateHelper';
//import {Spinner} from '../../../components/common/Spinner';



const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
 // const [search, setSearch] = useState('');
const handleSuspend = (userId: number) => {
  console.log("Suspend user:", userId);
};


  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      // Reusing authService to fetch all users (accessible by Admin)
      const response = await authService.getCurrentUser(); // Logic: Backend ViewSet handles list
      // Note: In real app, use user.service.getAllUsers()
      setUsers([response] as any); // Mocking array for structure
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const columns = [
    { 
      header: 'Employee', 
      render: (u: User) => (
        <div className="d-flex align-items-center">
          <div className="bg-primary-subtle text-primary rounded-circle p-2 me-3 fw-bold">
            {u.first_name[0]}{u.last_name[0]}
          </div>
          <div>
            <div className="fw-bold">{u.full_name}</div>
            <small className="text-muted">{u.email}</small>
          </div>
        </div>
      ) 
    },
    { 
      header: 'Role', 
      render: (u: User) => (
        <span className="badge bg-light text-dark border">{u.role_name}</span>
      ) 
    },
    { 
      header: 'Department', 
      render: (u: User) => (
        <span className="text-capitalize small fw-medium text-primary">
          {u.department?.name || 'Global'}
        </span>
      ) 
    },
    { 
      header: 'Status', 
      render: (u: User) => (
        <span className={`badge ${u.status === 'active' ? 'bg-success' : 'bg-danger'}`}>
          {u.status.toUpperCase()}
        </span>
      ) 
    },
    { 
      header: 'Joined', 
      render: (u: User) => dateHelper.formatDisplay(u.date_joined) 
    },
    { 
      header: 'Actions', 
     render: (u: User) => (
  <div className="btn-group btn-group-sm">
    <Button
      variant="outline-primary"
      onClick={() => navigate(`/admin/users/${u.id}`)}
    >
      <i className="bi bi-pencil"></i>
    </Button>

    <Button
      variant="danger"
      onClick={() => handleSuspend(u.id)}
    >
      <i className="bi bi-slash-circle"></i>
    </Button>
  </div>
)

    },
  ];

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">Internal Staff</h3>
          <p className="text-muted small">Manage user access, roles, and departmental permissions.</p>
        </div>
        <Button variant="primary"><i className="bi bi-person-plus me-2"></i>Onboard User</Button>
      </div>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-8">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0"><i className="bi bi-search text-muted"></i></span>
                <input type="text" className="form-control border-start-0" placeholder="Search by name, email or ID..." />
              </div>
            </div>
            <div className="col-md-2">
              <select className="form-select">
                <option value="">All Roles</option>
                <option value="PROJECT_MANAGER">Project Manager</option>
                <option value="SALES_EXECUTIVE">Sales Executive</option>
              </select>
            </div>
            <div className="col-md-2">
              <select className="form-select">
                <option value="">All Depts</option>
                <option value="software">Software</option>
                <option value="marketing">Marketing</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <DataTable columns={columns} data={users} loading={loading} />
    </div>
  );
};

export default UserList;