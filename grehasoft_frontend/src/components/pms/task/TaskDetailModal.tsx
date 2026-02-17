import React from "react";
import { Task } from "../../../types/pms";
import CommentSection from "../comments/CommentSection";

interface Props {
  task: Task;
}

const TaskDetailModal: React.FC<Props> = ({ task }) => {
  return (
    <div>
      <h5>{task.title}</h5>
      <p>{task.description}</p>

      <CommentSection taskId={task.id} />
    </div>
  );
};

export default TaskDetailModal;
