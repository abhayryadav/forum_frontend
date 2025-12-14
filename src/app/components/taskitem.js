import React, { useState } from 'react';
import CommentSection from './CommentSection';
import styles from './TaskItem.module.css';

const TaskItem = ({ task, userRole, onDelete, onTaskUpdated }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description || '');
  const [loading, setLoading] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const tfuser = JSON.parse(localStorage.getItem("tfuser"));
  const curruid = tfuser._id;
  const urole = tfuser.role
  const uname = tfuser.email

  const isOwner = task.createdBy._id === curruid; // You'll need to get current user ID
  const canEdit =  curruid === task.createdBy._id;
  const canDelete = isOwner || userRole === urole;

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!editedTitle.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("tftoken")
      const response = await fetch(`http://13.222.160.28:5000/api/tasks/${task._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editedTitle,
          description: editedDescription
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      setIsEditing(false);
      onTaskUpdated();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className={styles.taskItem}>
      <div className={styles.taskHeader}>
        <div className={styles.taskMeta}>
          <span className={styles.taskAuthor}>{task.createdBy.email}</span>
          <span className={styles.taskDate}>{formatDate(task.createdAt)}</span>
        </div>
        
        {(canEdit || canDelete) && (
          <div className={styles.taskActions}>
            {canEdit && (
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={styles.actionButton}
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
            )}
            {canDelete && (
              <button
                onClick={() => onDelete(task._id)}
                className={`${styles.actionButton} ${styles.deleteButton}`}
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleEdit} className={styles.editForm}>
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className={styles.editInput}
            placeholder="Task title"
            required
          />
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            className={styles.editTextarea}
            placeholder="Task description"
            rows="3"
          />
          <button
            type="submit"
            className={styles.saveButton}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </form>
      ) : (
        <>
          <h3 className={styles.taskTitle}>{task.title}</h3>
          {task.description && (
            <p className={styles.taskDescription}>{task.description}</p>
          )}
        </>
      )}

      <div className={styles.taskFooter}>
        <button
          onClick={() => setShowComments(!showComments)}
          className={styles.commentsButton}
        >
          {showComments ? 'Hide Comments' : 'Show Comments'}
        </button>
      </div>

      {showComments && (
        <CommentSection 
          taskId={task._id} 
          userRole={userRole}
          isOwner={isOwner}
        />
      )}
    </div>
  );
};

export default TaskItem;