import React from "react";
import { Milestone } from "../../../types/pms";

const MilestoneList = ({ milestones }: { milestones: Milestone[] }) => {
  return (
    <ul className="list-group list-group-flush">
      {milestones.map((m) => (
        <li key={m.id} className="list-group-item">
          {m.title}
        </li>
      ))}
    </ul>
  );
};

export default MilestoneList;
