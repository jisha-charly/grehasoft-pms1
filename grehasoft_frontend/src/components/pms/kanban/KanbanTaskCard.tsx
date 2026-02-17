import React from "react";
import { Task } from "../../../types/pms";
import TaskPriority from "../task/TaskPriority";

interface Props {
  task: Task;
}

const KanbanTaskCard: React.FC<Props> = ({ task }) => {
  return (
    <div className="card shadow-sm mb-3 border-0">
      <div className="card-body p-3">
        <div className="d-flex justify-content-between">
          <h6 className="small fw-bold">{task.title}</h6>
          <TaskPriority priority={task.priority} />
        </div>

        <p className="small text-muted mb-2">
          {task.description?.substring(0, 60)}...
        </p>
      </div>
    </div>
  );
};

export default KanbanTaskCard;
