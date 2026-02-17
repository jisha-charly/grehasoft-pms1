import React from "react";
import { Task } from "../../../types/pms";
import KanbanColumn from "./KanbanColumn";

interface Props {
  tasks: Task[];
}

const STATUSES = ["todo", "in_progress", "blocked", "done"];

const KanbanBoard: React.FC<Props> = ({ tasks }) => {
  return (
    <div className="row g-3 flex-nowrap overflow-auto">
      {STATUSES.map((status) => (
        <KanbanColumn
          key={status}
          status={status}
          tasks={tasks.filter((t) => t.status === status)}
        />
      ))}
    </div>
  );
};

export default KanbanBoard;
