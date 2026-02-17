import React, { useState, useEffect } from 'react';
import { pmsService } from '../../../api/pms.service';
import { Task } from '../../../types/pms';
import { DataTable } from '../../../components/common/DataTable';
import { dateHelper } from '../../../utils/dateHelper';

const MyTasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // API should have a ?assigned_to_me=true filter handled by DRF ViewSet
    pmsService.getTasks(0, { assigned_to_me: true }).then(res => {
      setTasks(res.data);
      setLoading(false);
    });
  }, []);

  const columns = [
    { header: 'Task Name', key: 'title', render: (t: Task) => <span className="fw-bold">{t.title}</span> },
    { header: 'Project', key: 'project_name' },
    { 
      header: 'Priority', 
      render: (t: Task) => (
        <span className={`badge ${t.priority === 'critical' ? 'bg-danger' : 'bg-info text-dark'}`}>
          {t.priority.toUpperCase()}
        </span>
      ) 
    },
    { header: 'Status', render: (t: Task) => <span className="text-capitalize small fw-bold">{t.status}</span> },
    { header: 'Due Date', render: (t: Task) => dateHelper.formatDisplay(t.due_date) }
  ];

  return (
    <div className="container-fluid">
      <h3 className="fw-bold mb-4">My Assigned Tasks</h3>
      <div className="card border-0 shadow-sm">
        <DataTable columns={columns} data={tasks} loading={loading} />
      </div>
    </div>
  );
};

export default MyTasks;