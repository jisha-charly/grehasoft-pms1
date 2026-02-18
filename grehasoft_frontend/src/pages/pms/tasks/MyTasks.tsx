import React, { useState, useEffect } from 'react';
import { pmsService } from '../../../api/pms.service';
import type { Task } from '../../../types/pms';
import { DataTable } from '../../../components/common/DataTable';
//import { dateHelper } from '../../../utils/dateHelper';
import type { Column } from '../../../components/common/DataTable';

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

  const columns: Column<Task>[] = [
  {
    header: 'Title',
    key: 'title',
    render: (t) => <span className="fw-semibold">{t.title}</span>,
  },
  {
    header: 'Status',
    key: 'status',
    render: (t) => <span className="badge bg-info">{t.status}</span>,
  },
  {
    header: 'Due Date',
    key: 'due_date',
    render: (t) => <span>{t.due_date}</span>,
  },
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