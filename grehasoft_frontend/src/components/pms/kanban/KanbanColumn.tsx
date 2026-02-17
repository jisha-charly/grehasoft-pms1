import React from "react";
import { Task } from "../../../types/pms";
import KanbanTaskCard from "./KanbanTaskCard";

interface Props {
  status: string;
  tasks: Task[];
}

const KanbanColumn: React.FC<Props> = ({ status, tasks }) => {
  return (
    <div className="col-md-3" style={{ minWidth: 280 }}>
      <div className="bg-light rounded p-3 h-100">
        <h6 className="fw-bold text-capitalize mb-3">
          {status.replace("_", " ")} ({tasks.length})
        </h6>

        {tasks.map((task) => (
          <KanbanTaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default KanbanColumn;
