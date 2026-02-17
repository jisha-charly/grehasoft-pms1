import React, { useEffect, useState } from "react";
import { pmsService } from "../../../api/pms.service";
import { Comment } from "../../../types/pms";
import { useAuth } from "../../../hooks/useAuth";
import CommentItem from "./CommentItem";

interface Props {
  taskId: number;
}

const CommentSection: React.FC<Props> = ({ taskId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchComments = async () => {
    try {
      const response = await pmsService.getTaskComments(taskId);
      setComments(response.data);
    } catch (error) {
      console.error("Failed to fetch comments");
    }
  };

  useEffect(() => {
    fetchComments();
  }, [taskId]);

  const handleSubmit = async () => {
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      await pmsService.addTaskComment({
        task: taskId,
        content: newComment,
      });

      setNewComment("");
      fetchComments();
    } catch (error) {
      console.error("Failed to post comment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card border-0 shadow-sm mt-4">
      <div className="card-body">
        <h6 className="fw-bold mb-3">Discussion</h6>

        {/* Comment List */}
        <div
          style={{
            maxHeight: "300px",
            overflowY: "auto",
          }}
          className="mb-3"
        >
          {comments.length === 0 ? (
            <div className="text-muted small text-center py-3">
              No comments yet.
            </div>
          ) : (
            comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                currentUserId={user?.id}
              />
            ))
          )}
        </div>

        {/* Add Comment */}
        <div className="d-flex">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Posting..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentSection;
