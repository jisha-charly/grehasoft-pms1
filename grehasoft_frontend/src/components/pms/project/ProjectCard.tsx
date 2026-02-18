import React from 'react';
import { Link } from 'react-router-dom';
import type { Project } from '../../../types/pms';
import { ProjectProgress } from './ProjectProgress';
import { PATHS } from '../../../routes/paths';

export const ProjectCard: React.FC<{ project: Project }> = ({ project }) => (
  <div className="card h-100 border-0 shadow-sm project-card transition-all">
    <div className="card-body p-4">
      <div className="d-flex justify-content-between align-items-start mb-3">
        <span className="badge bg-light text-primary border xsmall text-uppercase fw-bold">
          {project.department_name}
        </span>
        <span className={`badge ${project.status === 'completed' ? 'bg-success' : 'bg-info'} xsmall text-uppercase`}>
          {project.status.replace('_', ' ')}
        </span>
      </div>

      <h5 className="fw-bold mb-1">
        <Link to={PATHS.PMS.PROJECT_DETAILS(project.id)} className="text-dark text-decoration-none">
          {project.name}
        </Link>
      </h5>
      <p className="text-muted small mb-4">{project.client_name}</p>

      <div className="mb-4">
        <ProjectProgress percentage={project.progress_percentage} />
      </div>

      <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
        <div className="small">
          <i className="bi bi-person-gear me-2 text-muted"></i>
          <span className="fw-medium">{project.manager_name}</span>
        </div>
        <Link to={PATHS.PMS.KANBAN(project.id)} className="btn btn-sm btn-primary fw-bold px-3">
          Board
        </Link>
      </div>
    </div>
  </div>
);