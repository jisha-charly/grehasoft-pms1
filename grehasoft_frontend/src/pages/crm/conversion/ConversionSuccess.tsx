import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PATHS } from "../../../routes/paths";

const ConversionSuccess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Optional project id passed after conversion
  const projectId = (location.state as any)?.projectId;

  return (
    <div className="container py-5">
      <div className="card shadow-sm border-0 text-center p-5">
        <div className="mb-4">
          <div
            className="bg-success-subtle text-success rounded-circle d-inline-flex align-items-center justify-content-center"
            style={{ width: 80, height: 80 }}
          >
            <i className="bi bi-check-lg fs-1"></i>
          </div>
        </div>

        <h2 className="fw-bold mb-3">Lead Successfully Converted 🎉</h2>

        <p className="text-muted mb-4">
          The lead has been converted into a Client and a new Project has been
          created inside the PMS module.
        </p>

        {projectId && (
          <div className="alert alert-info small">
            Project ID: <strong>{projectId}</strong>
          </div>
        )}

        <div className="d-flex justify-content-center gap-3 mt-3">
          <button
            className="btn btn-outline-primary"
            onClick={() => navigate(PATHS.CRM_LEADS)}
          >
            Back to Leads
          </button>

          {projectId && (
            <button
              className="btn btn-success"
              onClick={() =>
                navigate(PATHS.PMS_PROJECT_DETAILS(projectId))
              }
            >
              Go to Project
            </button>
          )}

          <button
            className="btn btn-primary"
            onClick={() => navigate(PATHS.DASHBOARD)}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConversionSuccess;
