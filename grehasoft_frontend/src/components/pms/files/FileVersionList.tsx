import React, { useState, useEffect } from 'react';
import { pmsService } from '../../../api/pms.service';
import { TaskFile } from '../../../types/pms';
import { FileItem } from './FileItem';
import { Spinner } from '../../common/Spinner';

export const FileVersionList: React.FC<{ taskId: number }> = ({ taskId }) => {
  const [files, setFiles] = useState<TaskFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    pmsService.getTaskFiles(taskId).then(res => {
      // Sort: Current version first, then descending by revision number
      const sorted = res.data.sort((a, b) => b.revision_no - a.revision_no);
      setFiles(sorted);
      setLoading(false);
    });
  }, [taskId]);

  if (loading) return <Spinner center size="sm" />;

  return (
    <div className="file-history mt-3">
      {files.length > 0 ? (
        files.map(f => <FileItem key={f.id} file={f} />)
      ) : (
        <div className="alert alert-light border border-dashed text-center small py-3">
          No attachments found.
        </div>
      )}
    </div>
  );
};