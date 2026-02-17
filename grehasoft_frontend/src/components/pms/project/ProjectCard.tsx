import React from "react";
import { Project } from "../../../types/pms";
import ProjectProgress from "./ProjectProgress";

interface Props {
  project: Project;
}

const ProjectCard: React.FC<Props> = ({ project }) => {
  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body">
        <h6 className="fw-bold">{project.name}</h6>
        <p className="small text-muted">{project.description}</p>
        <ProjectProgress progress={project.progress || 0} />
      </div>
    </div>
  );
};

export default ProjectCard;
