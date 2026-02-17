import React from 'react';

export const ProjectProgress: React.FC<{ percentage: number }> = ({ percentage }) => (
  <div className="w-100">
    <div className="d-flex justify-content-between xsmall mb-1">
      <span className="fw-bold">{percentage}% Complete</span>
    </div>
    <div className="progress" style={{ height: '6px' }}>
      <div 
        className={`progress-bar bg-${percentage === 100 ? 'success' : 'primary'}`} 
        role="progressbar" 
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  </div>
);