import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DndContext, closestCorners } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';

import { pmsService } from '../../../api/pms.service';
import type { Task, TaskStatus } from '../../../types/pms';
import { KanbanColumn,KANBAN_COLUMNS} from '../../../components/pms/kanban/KanbanColumn';

import {Spinner} from '../../../components/common/Spinner';

const KanbanPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [projectName, setProjectName] = useState('');

  useEffect(() => {
    if (projectId) {
      Promise.all([
        pmsService.getProject(Number(projectId)),
        pmsService.getTasks(Number(projectId))
      ]).then(([projRes, tasksRes]) => {
        setProjectName(projRes.data.name);
        setTasks(tasksRes.data);
        setLoading(false);
      });
    }
  }, [projectId]);

  const onDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as number;
    const newStatus = over.id as TaskStatus;
    
    const task = tasks.find(t => t.id === taskId);
    if (!task || task.status === newStatus) return;

    // Optimistic Update
    const originalTasks = [...tasks];
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));

    try {
      // Backend expects: status and board_order
      await pmsService.updateTaskStatus(taskId, newStatus, 0); 
    } catch (err) {
      setTasks(originalTasks); // Rollback
      alert("Failed to update task. Please try again.");
    }
  };

  if (loading) return <Spinner center />;

  return (
    <div className="container-fluid">
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <h4 className="fw-bold mb-0">Kanban: {projectName}</h4>
        <button className="btn btn-outline-primary btn-sm"><i className="bi bi-plus-lg me-2"></i>Add Task</button>
      </div>

      <DndContext collisionDetection={closestCorners} onDragEnd={onDragEnd}>
        <div className="d-flex overflow-auto pb-3 gap-3" style={{ minHeight: '75vh' }}>
          {KANBAN_COLUMNS.map(col => (
  <KanbanColumn
    key={col.id}
    id={col.id}
    title={col.title}
    tasks={tasks.filter(t => t.status === col.id)}
  />
))}

        </div>
      </DndContext>
    </div>
  );
};

export default KanbanPage;