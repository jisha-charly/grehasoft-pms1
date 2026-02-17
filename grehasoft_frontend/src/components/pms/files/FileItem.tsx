import React from "react";
import { TaskFile } from "../../../types/pms";

const FileItem: React.FC<{ file: TaskFile }> = ({ file }) => {
  return (
    <li className="list-group-item d-flex justify-content-between">
      <span>{file.file_path.split("/").pop()}</span>
      <a href={file.file_path} target="_blank" rel="noreferrer">
        Download
      </a>
    </li>
  );
};

export default FileItem;
