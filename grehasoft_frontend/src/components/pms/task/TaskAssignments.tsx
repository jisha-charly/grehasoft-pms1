import React from 'react';

interface UserInfo {
  id: number;
  full_name: string;
}

interface Props {
  users: UserInfo[];
  size?: number;
}

export const TaskAssignments: React.FC<Props> = ({ users, size = 28 }) => {
  const displayLimit = 3;
  const displayUsers = users.slice(0, displayLimit);
  const remainingCount = users.length - displayLimit;

  return (
    <div className="d-flex align-items-center">
      <div className="avatar-group d-flex align-items-center me-2">
        {displayUsers.map((user, idx) => (
          <div 
            key={user.id}
            className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center border border-2 border-white shadow-sm"
            style={{ 
              width: `${size}px`, 
              height: `${size}px`, 
              fontSize: `${size * 0.4}px`,
              marginLeft: idx === 0 ? 0 : `-${size / 3}px`,
              zIndex: displayUsers.length - idx
            }}
            title={user.full_name}
          >
            {user.full_name.charAt(0)}
          </div>
        ))}
      </div>
      {remainingCount > 0 && (
        <span className="xsmall text-muted fw-bold">+{remainingCount} more</span>
      )}
    </div>
  );
};