import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { pmsService } from '../../../api/pms.service';
import { Project } from '../../../types/pms';
import Spinner from '../../../components/common/Spinner';
import EmptyState from '../../../components/common/EmptyState';
import { PATHS } from '../../../routes/paths';

const ProjectList = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const response = await pmsService.getProjects();
      setProjects(response.data.results);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  if (loading) return <Spinner />;

  if (!projects.length)
    return (
      <div className="container py-5">
        <EmptyState title="No projects available." />
      </div>
    );

  return (
    <div className="container-fluid py-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold">Projects</h4>
        <button className="btn btn-primary btn-sm">
          + New Project
        </button>
      </div>

      <div className="row g-4">
        {projects.map((project) => (
          <div key={project.id} className="col-md-4">
            <div
              className="card shadow-sm border-0 h-100 cursor-pointer"
              onClick={() =>
                navigate(`/projects/${project.id}`)
              }
            >
              <div className="card-body">
                <h6 className="fw-bold">{project.name}</h6>
                <p className="text-muted small mb-2">
                  Client: {project.client_name}
                </p>

                <span className="badge bg-info text-dark">
                  {project.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectList;
