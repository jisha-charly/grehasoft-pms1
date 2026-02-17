import React from "react";
import { TaskFile } from "../../../types/pms";
import FileItem from "./FileItem";

const FileVersionList = ({ files }: { files: TaskFile[] }) => {
  return (
    <ul className="list-group">
      {files.map((f) => (
        <FileItem key={f.id} file={f} />
      ))}
    </ul>
  );
};

export default FileVersionList;
