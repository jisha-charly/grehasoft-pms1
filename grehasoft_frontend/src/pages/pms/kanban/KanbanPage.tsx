import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { pmsService } from '../../../api/pms.service';
import { Task } from '../../../types/pms';
import KanbanBoard from '../../../components/pms/kanban/KanbanBoard';
import Spinner from '../../../components/common/Spinner';
import EmptyState from '../../../components/common/EmptyState';

const KanbanPage = () => {
  const { projectId } = useParams<{ projectId: string }>();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await pmsService.getTasks(Number(projectId));
      setTasks(response.data);
    } catch (err) {
      console.error('Failed to load tasks:', err);
      setError('Failed to load project tasks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchTasks();
    }
  }, [projectId]);

  if (loading) return <Spinner />;

  if (error)
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );

  if (!tasks.length)
    return (
      <div className="container py-5">
        <EmptyState title="No tasks found for this project." />
      </div>
    );

  return (
    <div className="container-fluid py-3">
      <h4 className="fw-bold mb-4">Project Kanban Board</h4>

      <KanbanBoard
        tasks={tasks}
        onTaskUpdate={fetchTasks}
      />
    </div>
  );
};

export default KanbanPage;
