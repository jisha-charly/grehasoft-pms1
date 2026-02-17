import React from 'react';
import { Modal } from '../../common/Modal';
import { Task } from '../../../types/pms';
import { CommentSection } from '../comments/CommentSection';
import { FileVersionList } from '../files/FileVersionList';

export const TaskDetailModal: React.FC<{ task: Task | null; onClose: () => void }> = ({ task, onClose }) => {
  if (!task) return null;

  return (
    <Modal show={!!task} title={task.title} onClose={onClose} size="xl">
      <div className="row g-4">
        <div className="col-lg-8">
          <label className="fw-bold xsmall text-uppercase text-muted">Description</label>
          <p className="border rounded p-3 bg-light-subtle">{task.description || 'No description provided.'}</p>
          <hr />
          <CommentSection taskId={task.id} />
        </div>
        <div className="col-lg-4 border-start">
          <label className="fw-bold xsmall text-uppercase text-muted mb-2">Attachments</label>
          <FileVersionList taskId={task.id} />
          <div className="mt-4">
            <label className="fw-bold xsmall text-uppercase text-muted">Metadata</label>
            <div className="small mb-1">Status: <strong>{task.status}</strong></div>
            <div className="small">Type: <strong>{task.task_type_name}</strong></div>
          </div>
        </div>
      </div>
    </Modal>
  );
};