import React from 'react';

interface Props {
  size?: 'sm' | 'md' | 'lg';
  center?: boolean;
  color?: string;
}

export const Spinner: React.FC<Props> = ({ size = 'md', center = false, color = 'primary' }) => {
  const sizeMap = { sm: '1rem', md: '2rem', lg: '3rem' };
  const content = (
    <div 
      className={`spinner-border text-${color}`} 
      style={{ width: sizeMap[size], height: sizeMap[size] }} 
      role="status"
    >
      <span className="visually-hidden">Loading...</span>
    </div>
  );

  return center ? (
    <div className="d-flex justify-content-center align-items-center w-100 py-5">{content}</div>
  ) : content;
};