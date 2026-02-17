import React from 'react';
import { TaskComment } from '../../../types/pms';
import { dateHelper } from '../../../utils/dateHelper';

export const CommentItem: React.FC<{ comment: TaskComment; isOwn: boolean }> = ({ comment, isOwn }) => (
  <div className={`d-flex mb-3 ${isOwn ? 'justify-content-end' : ''}`}>
    <div className={`p-3 rounded-3 shadow-sm ${isOwn ? 'bg-primary text-white' : 'bg-light border'}`} style={{ maxWidth: '85%' }}>
      {!isOwn && <div className="fw-bold xsmall mb-1 text-primary">{comment.user_name}</div>}
      <div className="small mb-1">{comment.comment}</div>
      <div className={`xsmall ${isOwn ? 'text-white-50' : 'text-muted'}`}>
        {dateHelper.formatDateTime(comment.created_at)}
      </div>
    </div>
  </div>
);