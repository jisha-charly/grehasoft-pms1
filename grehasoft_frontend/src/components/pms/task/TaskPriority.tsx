import React from "react";

const TaskPriority = ({ priority }: { priority: string }) => {
  const color =
    priority === "high"
      ? "danger"
      : priority === "medium"
      ? "warning"
      : "secondary";

  return (
    <span className={`badge bg-${color}`}>
      {priority.toUpperCase()}
    </span>
  );
};

export default TaskPriority;
