// src/pages/admin/settings/DepartmentSettings.tsx

import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { PATHS } from '../../../routes/paths';

interface DepartmentConfig {
  name: string;
  description: string;
  isActive: boolean;
}

const DepartmentSettings: React.FC = () => {
  const { user } = useAuth();

  // 🔒 Only SUPER_ADMIN can access
  if (user?.role !== 'SUPER_ADMIN') {
    return <Navigate to={PATHS.AUTH.UNAUTHORIZED} replace />;
  }

  const [departments, setDepartments] = useState<DepartmentConfig[]>([
    {
      name: 'Software',
      description: 'Handles development, projects, tasks, and sprint boards.',
      isActive: true,
    },
    {
      name: 'Digital Marketing',
      description: 'Manages leads, campaigns, conversions, and ROI tracking.',
      isActive: true,
    },
  ]);

  const toggleDepartment = (index: number) => {
    const updated = [...departments];
    updated[index].isActive = !updated[index].isActive;
    setDepartments(updated);
  };

  return (
    <div className="container-fluid">
      <div className="mb-4">
        <h2 className="fw-bold">Department Settings</h2>
        <p className="text-muted small">
          Configure department availability and internal visibility rules.
        </p>
      </div>

      <div className="row g-4">
        {departments.map((dept, index) => (
          <div key={dept.name} className="col-md-6">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h5 className="fw-bold mb-1">{dept.name}</h5>
                    <p className="text-muted small mb-0">
                      {dept.description}
                    </p>
                  </div>

                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={dept.isActive}
                      onChange={() => toggleDepartment(index)}
                    />
                  </div>
                </div>

                <div>
                  <span
                    className={`badge ${
                      dept.isActive ? 'bg-success' : 'bg-secondary'
                    }`}
                  >
                    {dept.isActive ? 'Active' : 'Disabled'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5">
        <button className="btn btn-primary">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default DepartmentSettings;
