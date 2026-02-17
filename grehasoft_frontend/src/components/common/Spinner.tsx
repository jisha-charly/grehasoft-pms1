import React from "react";

interface Props {
  size?: "sm" | "lg";
  center?: boolean;
}

const Spinner: React.FC<Props> = ({ size = "sm", center = false }) => {
  return (
    <div className={center ? "text-center p-4" : ""}>
      <div
        className={`spinner-border ${
          size === "lg" ? "spinner-border-lg" : "spinner-border-sm"
        } text-primary`}
      ></div>
    </div>
  );
};

export default Spinner;
