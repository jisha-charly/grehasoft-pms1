import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { pmsService } from '../../../api/pms.service';
import type { Project } from '../../../types/pms';
import {Spinner} from '../../../components/common/Spinner';
import { MilestoneList } from '../../../components/pms/project/MilestoneList';

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      pmsService.getProject(Number(id)).then(res => {
        setProject(res.data);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading || !project) return <Spinner center />;

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">{project.name}</h3>
          <p className="text-muted small">Client: {project.client_name} • Dept: {project.department_name}</p>
        </div>
        <Link to={`/pms/projects/${project.id}/kanban`} className="btn btn-primary">
          <i className="bi bi-kanban me-2"></i>Open Kanban Board
        </Link>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <h6 className="fw-bold mb-3">Description</h6>
              <p className="text-muted">{project.description || 'No description provided.'}</p>
            </div>
          </div>
          <MilestoneList milestones={project.milestones || []} />
        </div>
        
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <h6 className="fw-bold mb-3">Project Team</h6>
              <div className="list-group list-group-flush">
                {project.members?.map(m => (
                  <div key={m.id} className="list-group-item px-0 py-2 d-flex align-items-center border-0">
                    <div className="bg-primary text-white rounded-circle me-3 small d-flex align-items-center justify-content-center" style={{ width: 32, height: 32 }}>
                      {m.user_details.full_name[0]}
                    </div>
                    <div>
                      <div className="small fw-bold">{m.user_details.full_name}</div>
                      <div className="xsmall text-muted">{m.role_in_project}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;