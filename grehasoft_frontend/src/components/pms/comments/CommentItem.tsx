import React from "react";
import { formatDateTime } from "../../../utils/dateHelpers";
import { Comment } from "../../../types/pms";

interface Props {
  comment: Comment;
  currentUserId?: number;
}

const CommentItem: React.FC<Props> = ({ comment, currentUserId }) => {
  const isMine = currentUserId === comment.created_by;

  return (
    <div className={`d-flex mb-3 ${isMine ? "justify-content-end" : ""}`}>
      <div
        className={`p-3 rounded-3 shadow-sm ${
          isMine ? "bg-primary text-white" : "bg-light"
        }`}
        style={{ maxWidth: "75%" }}
      >
        <div className="small fw-bold mb-1">
          {comment.created_by_name}
        </div>

        <div className="small mb-2">{comment.content}</div>

        <div className="text-end small opacity-75">
          {formatDateTime(comment.created_at)}
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
