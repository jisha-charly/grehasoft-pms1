import React from "react";

interface TooltipProps {
  text: string;
  children: React.ReactElement<any>;
}

export const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  return React.cloneElement(children as React.ReactElement<any>, {
    title: text,
    "data-bs-toggle": "tooltip",
    "data-bs-placement": "top",
  });
};
