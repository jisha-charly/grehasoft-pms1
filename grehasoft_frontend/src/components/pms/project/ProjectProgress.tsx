import React from "react";

const ProjectProgress = ({ progress }: { progress: number }) => {
  return (
    <div>
      <div className="progress" style={{ height: 6 }}>
        <div
          className="progress-bar"
          style={{ width: `${progress}%` }}
        />
      </div>
      <small className="text-muted">{progress}% Complete</small>
    </div>
  );
};

export default ProjectProgress;
