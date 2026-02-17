import React from "react";

const TaskAssignments = ({ users }: { users: any[] }) => {
  return (
    <div className="d-flex">
      {users.map((u) => (
        <div key={u.id} className="me-2 small">
          {u.first_name}
        </div>
      ))}
    </div>
  );
};

export default TaskAssignments;
