import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { pmsService } from '../../../api/pms.service';
import type { Project } from '../../../types/pms';
import { DataTable } from '../../../components/common/DataTable';
import { ProjectProgress } from '../../../components/pms/project/ProjectProgress';
import { dateHelper } from '../../../utils/dateHelper';
import { Button } from '../../../components/common/Button';

const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    pmsService.getProjects().then((res) => {
      setProjects(res.data.results);
      setLoading(false);
    });
  }, []);

  const columns = [
    { 
      header: 'Project Name', 
      render: (p: Project) => (
        <div>
          <Link to={`/pms/projects/${p.id}/kanban`} className="fw-bold text-decoration-none">{p.name}</Link>
          <div className="text-muted xsmall">{p.client_name}</div>
        </div>
      ) 
    },
    { header: 'Manager', render: (p: Project) => <span className="small">{p.manager_name}</span> },
    { 
      header: 'Progress', 
      render: (p: Project) => <ProjectProgress percentage={p.progress_percentage} /> 
    },
    { 
      header: 'Status', 
      render: (p: Project) => (
        <span className={`badge border text-capitalize ${p.status === 'completed' ? 'bg-success-subtle text-success' : 'bg-light text-dark'}`}>
          {p.status.replace('_', ' ')}
        </span>
      ) 
    },
    { header: 'Deadline', render: (p: Project) => dateHelper.formatDisplay(p.end_date) },
  ];

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold">Projects Workspace</h3>
        <Button variant="primary"><i className="bi bi-plus-lg me-2"></i>New Project</Button>
      </div>
      <DataTable columns={columns} data={projects} loading={loading} />
    </div>
  );
};

export default ProjectList;