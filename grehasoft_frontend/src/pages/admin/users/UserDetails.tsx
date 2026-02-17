import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useParams, Navigate } from 'react-router-dom';
import { PATHS } from '../../../routes/paths';
import api from '../../../api/axiosInstance';
import { User } from '../../../types/auth';

const UserDetails: React.FC = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  if (user?.role !== 'SUPER_ADMIN') {
    return <Navigate to={PATHS.AUTH.UNAUTHORIZED} replace />;
  }

  useEffect(() => {
    api.get<User>(`users/${id}/`)
      .then(res => {
        setUserData(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center p-5">Loading user details...</div>;
  if (!userData) return <div className="text-danger p-5">User not found.</div>;

  return (
    <div className="container-fluid">
      <h2 className="fw-bold mb-4">User Details</h2>

      <div className="card shadow-sm border-0">
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-6">
              <strong>Name:</strong>
              <div>{userData.first_name} {userData.last_name}</div>
            </div>
            <div className="col-md-6">
              <strong>Email:</strong>
              <div>{userData.email}</div>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <strong>Role:</strong>
              <div>{userData.role}</div>
            </div>
            <div className="col-md-6">
              <strong>Department:</strong>
              <div>{userData.department}</div>
            </div>
          </div>

          <div className="mt-4">
            <button className="btn btn-warning me-2">
              Change Role
            </button>
            <button className="btn btn-danger">
              Deactivate User
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
