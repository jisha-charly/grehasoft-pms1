import React from 'react';

const DepartmentSettings: React.FC = () => {
  return (
    <div className="container-fluid">
      <div className="mb-4">
        <h3 className="fw-bold">Department Configuration</h3>
        <p className="text-muted small">Configure domain isolation rules and service categories.</p>
      </div>

      <div className="row g-4">
        {['Software Development', 'Digital Marketing'].map((dept, idx) => (
          <div className="col-md-6" key={idx}>
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="bg-primary text-white rounded p-2 px-3 fw-bold">
                    {dept[0]}
                  </div>
                  <button className="btn btn-sm btn-link text-decoration-none">Edit Settings</button>
                </div>
                <h5 className="fw-bold">{dept}</h5>
                <p className="text-muted small">Handles all client workflows related to {dept.toLowerCase()} services.</p>
                <hr />
                <div className="d-flex justify-content-between xsmall">
                  <span className="text-muted">Domain Isolation:</span>
                  <span className="text-success fw-bold">STRICT</span>
                </div>
                <div className="d-flex justify-content-between xsmall mt-2">
                  <span className="text-muted">Kanban Columns:</span>
                  <span>4 Columns (Standard)</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 card border-0 bg-warning-subtle p-4 border-start border-warning border-4">
        <h6 className="fw-bold text-warning-emphasis"><i className="bi bi-info-circle me-2"></i>Data Isolation Warning</h6>
        <p className="small mb-0 opacity-75">
          Changing department names or slugs will affect project filtering across the entire system. 
          Ensure all active projects are archived before modifying core department identifiers.
        </p>
      </div>
    </div>
  );
};

export default DepartmentSettings;