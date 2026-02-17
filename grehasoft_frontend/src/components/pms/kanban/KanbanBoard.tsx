import React from 'react';
import { 
  DndContext, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors, 
  DragEndEvent 
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Task, KANBAN_COLUMNS } from '../../../types/pms';
import { KanbanColumn } from './KanbanColumn';

interface Props {
  tasks: Task[];
  onTaskMove: (event: DragEndEvent) => void;
}

export const KanbanBoard: React.FC<Props> = ({ tasks, onTaskMove }) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  return (
    <DndContext 
      sensors={sensors} 
      collisionDetection={closestCorners} 
      onDragEnd={onTaskMove}
    >
      <div className="kanban-container custom-scrollbar pb-3">
        {KANBAN_COLUMNS.map((col) => (
          <KanbanColumn
            key={col.id}
            id={col.id}
            title={col.title}
            tasks={tasks.filter((t) => t.status === col.id)}
          />
        ))}
      </div>
    </DndContext>
  );
};