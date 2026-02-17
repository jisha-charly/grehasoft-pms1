import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { pmsService } from '../../../api/pms.service';
import { Project } from '../../../types/pms';
import Spinner from '../../../components/common/Spinner';

const ProjectDetails = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProject = async () => {
    try {
      const response = await pmsService.getProject(Number(projectId));
      setProject(response.data);
    } catch (error) {
      console.error('Failed to fetch project:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) fetchProject();
  }, [projectId]);

  if (loading) return <Spinner />;

  if (!project)
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          Project not found.
        </div>
      </div>
    );

  return (
    <div className="container-fluid py-3">
      <div className="mb-4">
        <h4 className="fw-bold">{project.name}</h4>
        <p className="text-muted small">
          Client: {project.client_name}
        </p>

        <span className="badge bg-primary me-2">
          {project.status}
        </span>
      </div>

      <div className="row g-3">
        <div className="col-md-4">
          <div className="card shadow-sm border-0 p-3">
            <h6 className="fw-bold">Start Date</h6>
            <p className="text-muted small">
              {project.start_date}
            </p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0 p-3">
            <h6 className="fw-bold">Project Manager</h6>
            <p className="text-muted small">
              {project.project_manager_name}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 d-flex gap-2">
        <button
          className="btn btn-outline-primary btn-sm"
          onClick={() =>
            navigate(`/projects/${project.id}/kanban`)
          }
        >
          Open Kanban Board
        </button>

        <button className="btn btn-outline-secondary btn-sm">
          Edit Project
        </button>
      </div>
    </div>
  );
};

export default ProjectDetails;
