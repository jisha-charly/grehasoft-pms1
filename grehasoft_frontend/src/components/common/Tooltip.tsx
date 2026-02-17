import React from 'react';

interface Props {
  text: string;
  children: React.ReactElement;
}

export const Tooltip: React.FC<Props> = ({ text, children }) => {
  // Simple implementation using native title. 
  // For advanced Bootstrap Tooltips, initialization via bootstrap.js would be required.
  return React.cloneElement(children, {
    title: text,
    'data-bs-toggle': 'tooltip',
    'data-bs-placement': 'top',
  });
};