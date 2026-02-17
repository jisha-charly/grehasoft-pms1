import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { pmsService } from '../../../api/pms.service';
import { Task } from '../../../types/pms';
import { useAuth } from '../../../context/AuthContext';
import Spinner from '../../../components/common/Spinner';
import EmptyState from '../../../components/common/EmptyState';

const MyTasks = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const fetchTasks = async () => {
    try {
      const response = await pmsService.getTasks(0, {
        assigned_to: user?.id
      });

      setTasks(response.data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks =
    statusFilter === 'all'
      ? tasks
      : tasks.filter((t) => t.status === statusFilter);

  if (loading) return <Spinner />;

  return (
    <div className="container-fluid py-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold">My Tasks</h4>

        <select
          className="form-select form-select-sm w-auto"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="blocked">Blocked</option>
          <option value="done">Done</option>
        </select>
      </div>

      {filteredTasks.length === 0 ? (
        <EmptyState title="No assigned tasks found." />
      ) : (
        <div className="row g-3">
          {filteredTasks.map((task) => (
            <div key={task.id} className="col-md-4">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className={`badge bg-${getStatusColor(task.status)}`}>
                      {task.status.replace('_', ' ').toUpperCase()}
                    </span>

                    <span className="badge bg-secondary">
                      {task.priority}
                    </span>
                  </div>

                  <h6 className="fw-bold">{task.title}</h6>
                  <p className="text-muted small mb-3">
                    {task.description}
                  </p>

                  <div className="d-flex justify-content-between">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() =>
                        navigate(`/projects/${task.project}`)
                      }
                    >
                      View Project
                    </button>

                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() =>
                        navigate(`/projects/${task.project}/kanban`)
                      }
                    >
                      Open Board
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Status color helper
const getStatusColor = (status: string) => {
  switch (status) {
    case 'todo':
      return 'secondary';
    case 'in_progress':
      return 'primary';
    case 'blocked':
      return 'danger';
    case 'done':
      return 'success';
    default:
      return 'secondary';
  }
};

export default MyTasks;
