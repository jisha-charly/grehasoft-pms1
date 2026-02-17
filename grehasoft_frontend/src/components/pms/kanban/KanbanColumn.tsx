import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Task } from '../../../types/pms';
import { KanbanTaskCard } from './KanbanTaskCard';

interface Props {
  id: string;
  title: string;
  tasks: Task[];
}

export const KanbanColumn: React.FC<Props> = ({ id, title, tasks }) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div ref={setNodeRef} className="kanban-column shadow-sm border">
      <div className="column-header mb-3">
        <span>{title}</span>
        <span className="badge bg-white text-muted border px-2">{tasks.length}</span>
      </div>
      
      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div className="kanban-task-list flex-grow-1">
          {tasks.map((task) => (
            <KanbanTaskCard key={task.id} task={task} />
          ))}
          {tasks.length === 0 && (
            <div className="text-center py-4 opacity-25 small border border-dashed rounded-3">
              Drop tasks here
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
};