import React, { useState } from 'react';
import styles from './TaskForm.module.css';

const TaskForm = ({ userRole }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem("tftoken"); // Changed from "tftoken" to "token"
      const response = await fetch(`http://${process.env.NEXT_PUBLIC_URL}:5000/api/tasks`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create task');
      }

      setTitle('');
      setDescription('');
      setSuccess('Task created successfully!');
      
      // Clear success message after 3 seconds and reload
      setTimeout(() => {
        setSuccess('');
        window.location.reload();
      }, 2000);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setTitle('');
    setDescription('');
    setError('');
    setSuccess('');
  };

  return (
    <div className={styles.taskFormContainer}>
      <div className={styles.taskFormHeader}>
        <h2 className={styles.taskFormTitle}>Create New Task</h2>
        <p className={styles.taskFormSubtitle}>Fill in the details below</p>
      </div>
      
      <form className={styles.taskForm} onSubmit={handleSubmit}>
        {error && <div className={styles.formError}>{error}</div>}
        {success && <div className={styles.formSuccess}>{success}</div>}
        
        <div className={styles.formSection}>
          <label className={styles.formLabel}>
            Title
            <span className={styles.requiredStar}>*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setError('');
            }}
            className={styles.formInput}
            placeholder="What needs to be done?"
            required
            maxLength="100"
          />
          <div className={`${styles.inputCounter} ${title.length > 80 ? styles.warning : ''}`}>
            {title.length}/100
          </div>
        </div>

        <div className={styles.formSection}>
          <label className={styles.formLabel}>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`${styles.formInput} ${styles.formTextarea}`}
            placeholder="Add more details about this task..."
            rows="4"
            maxLength="500"
          />
          <div className={`${styles.inputCounter} ${description.length > 450 ? styles.warning : ''}`}>
            {description.length}/500
          </div>
        </div>

        {/* <div className={styles.formSection}>
          <label className={styles.formLabel}>Status</label>
          <div className={styles.prioritySelector}>
            {['To Do', 'In Progress', 'Completed'].map((status) => (
              <div
                key={status}
                className={`${styles.priorityOption} ${styles.selected}`}
              >
                {status}
              </div>
            ))}
          </div>
        </div> */}

        <div className={styles.formActions}>
          <button
            type="button"
            onClick={handleClear}
            className={styles.clearButton}
            disabled={loading}
          >
            Clear
          </button>
          <button
            type="submit"
            className={`${styles.submitButton} ${loading ? styles.loading : ''}`}
            disabled={loading}
          >
            {loading ? '' : 'Create Task'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;