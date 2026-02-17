import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { Navigate, useNavigate } from 'react-router-dom';
import { PATHS } from '../../../routes/paths';
import api from '../../../api/axiosInstance';
import { User } from '../../../types/auth';

const UserList: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔒 SUPER_ADMIN only
  if (user?.role !== 'SUPER_ADMIN') {
    return <Navigate to={PATHS.AUTH.UNAUTHORIZED} replace />;
  }

  useEffect(() => {
    api.get<User[]>('users/')
      .then(res => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center p-5">Loading users...</div>;

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between mb-4">
        <h2 className="fw-bold">User Management</h2>
        <button className="btn btn-primary">
          + Add User
        </button>
      </div>

      <div className="card shadow-sm border-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Department</th>
                <th>Status</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.first_name} {u.last_name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className="badge bg-info text-dark">
                      {u.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td>{u.department}</td>
                  <td>
                    <span className="badge bg-success">Active</span>
                  </td>
                  <td className="text-end">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => navigate(`/admin/users/${u.id}`)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserList;
