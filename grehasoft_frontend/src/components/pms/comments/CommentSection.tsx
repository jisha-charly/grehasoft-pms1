import React, { useState, useEffect } from 'react';
import api from '../../../api/axiosInstance';
import { TaskComment } from '../../../types/pms';
import { CommentItem } from './CommentItem';
import { useAuth } from '../../../context/AuthContext';
import { Button } from '../../common/Button';

export const CommentSection: React.FC<{ taskId: number }> = ({ taskId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<TaskComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get<TaskComment[]>(`pms/task-comments/?task=${taskId}`).then(res => setComments(res.data));
  }, [taskId]);

  const handlePost = async () => {
    if (!newComment.trim()) return;
    setLoading(true);
    try {
      const res = await api.post<TaskComment>('pms/task-comments/', { task: taskId, comment: newComment });
      setComments([...comments, res.data]);
      setNewComment('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column h-100">
      <h6 className="fw-bold xsmall text-uppercase text-muted mb-3">Discussions</h6>
      <div className="flex-grow-1 overflow-auto custom-scrollbar pe-2 mb-3" style={{ maxHeight: '400px' }}>
        {comments.map(c => <CommentItem key={c.id} comment={c} isOwn={c.user === user?.id} />)}
      </div>
      <div className="mt-auto border-top pt-3">
        <textarea 
          className="form-control form-control-sm mb-2" 
          placeholder="Write a message..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <div className="text-end">
          <Button variant="primary" size="sm" onClick={handlePost} loading={loading}>
            Post Comment
          </Button>
        </div>
      </div>
    </div>
  );
};