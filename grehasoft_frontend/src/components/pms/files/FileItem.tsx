import React from 'react';
import { TaskFile } from '../../../types/pms';
import { dateHelper } from '../../../utils/dateHelper';

export const FileItem: React.FC<{ file: TaskFile }> = ({ file }) => {
  const getIcon = (type: string) => {
    if (type.includes('pdf')) return 'bi-file-earmark-pdf text-danger';
    if (type.includes('image')) return 'bi-file-earmark-image text-primary';
    return 'bi-file-earmark-text text-secondary';
  };

  return (
    <div className={`d-flex align-items-center p-2 rounded mb-2 border-start border-3 ${file.is_current_version ? 'bg-primary-subtle border-primary' : 'bg-light border-secondary-subtle'}`}>
      <i className={`bi ${getIcon(file.file_type)} fs-4 me-3`}></i>
      <div className="flex-grow-1 min-w-0">
        <div className="d-flex align-items-center">
          <span className="small fw-bold text-truncate me-2">v{file.revision_no} - {file.file_path.split('/').pop()}</span>
          {file.is_current_version && <span className="badge bg-primary xsmall">LATEST</span>}
        </div>
        <div className="xsmall text-muted">
          By {file.uploaded_by_name} • {dateHelper.formatDisplay(file.created_at)}
        </div>
      </div>
      <a href={file.file_path} target="_blank" rel="noreferrer" className="btn btn-sm btn-link text-primary p-1">
        <i className="bi bi-download fs-5"></i>
      </a>
    </div>
  );
};