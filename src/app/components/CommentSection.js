import React, { useState, useEffect } from 'react';
import styles from './CommentSection.module.css';

const CommentSection = ({ taskId, userRole, isOwner }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const tfuser = JSON.parse(localStorage.getItem("tfuser"));
  const curruid = tfuser._id;
  const urole = tfuser.role
  const uname = tfuser.email


  console.log(".......................",isOwner)
  console.log(".......................",userRole)

  useEffect(() => {
    fetchComments();
  }, [taskId]);

  const fetchComments = async () => {
    const token = localStorage.getItem("tftoken")
    try {
      const response = await fetch(`http://13.222.160.28:5000/api/comments/task/${taskId}`, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      
      const data = await response.json();
      console.log("cmntsssssssssssss",data)
      setComments(data);
    } catch (err) {
      console.error('Error fetching comments:', err);
    } finally {
      setFetching(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
    const token = localStorage.getItem("tftoken")
      const response = await fetch('http://13.222.160.28:5000/api/comments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: newComment,
          task: taskId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add comment');
      }

      const data = await response.json();
      setComments([data, ...comments]);
      setNewComment('');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId, isCommentOwner) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    if (!isCommentOwner && userRole !== 'admin') {
      alert('You can only delete your own comments');
      return;
    }

    try {
      const token = localStorage.getItem("tftoken")
      const response = await fetch(`http://13.222.160.28:5000/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }

      setComments(comments.filter(comment => comment._id !== commentId));
    } catch (err) {
      alert(err.message);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className={styles.commentSection}>
      <div className={styles.commentForm}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className={styles.commentInput}
          placeholder="Add a comment..."
          rows="2"
        />
        <button
          onClick={handleSubmitComment}
          className={styles.commentSubmitButton}
          disabled={loading || !newComment.trim()}
        >
          {loading ? 'Posting...' : 'Post Comment'}
        </button>
      </div>

      {fetching ? (
        <div className={styles.loading}>Loading comments...</div>
      ) : comments.length === 0 ? (
        <div className={styles.noComments}>No comments yet. Be the first to comment!</div>
      ) : (
        <div className={styles.commentsList}>
          {comments.map(comment => {
            const isCommentOwner = comment.createdBy._id === curruid; // Get current user ID
            const canDelete = isCommentOwner || userRole === 'admin' || isOwner;

            return (
              <div key={comment._id} className={styles.commentItem}>
                <div className={styles.commentHeader}>
                  <span className={styles.commentAuthor}>@{comment.createdBy.email}</span>
                  <span className={styles.commentDate}>{formatDate(comment.createdAt)}</span>
                </div>
                <p className={styles.commentText}>{comment.text}</p>
                {canDelete && (
                  <button
                    onClick={() => handleDeleteComment(comment._id, isCommentOwner)}
                    className={styles.deleteCommentButton}
                  >
                    Delete
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CommentSection;