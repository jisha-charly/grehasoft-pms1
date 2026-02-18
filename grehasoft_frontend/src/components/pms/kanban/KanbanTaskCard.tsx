import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task } from '../../../types/pms';
import { TaskPriority } from '../task/TaskPriority';

export const KanbanTaskCard: React.FC<{ task: Task }> = ({ task }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} 
      className={`kanban-card priority-${task.priority}`}>
      <div className="d-flex justify-content-between align-items-start mb-2">
        <TaskPriority priority={task.priority} />
        <span className="xsmall text-muted">#{task.id}</span>
      </div>
      <h6 className="fw-bold small mb-2">{task.title}</h6>
      <div className="d-flex justify-content-between align-items-center">
        <div className="avatar-group d-flex">
          {task.assigned_users.slice(0, 2).map(u => (
            <div key={u.id} className="bg-light border rounded-circle xsmall p-1 me-n2" title={u.full_name}>
              {u.full_name.substring(0, 2)}
            </div>
          ))}
        </div>
        {task.due_date && <span className="xsmall text-muted"><i className="bi bi-calendar3 me-1"></i></span>}
      </div>
    </div>
  );
};