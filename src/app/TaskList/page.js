"use client"

import React, { useState, useEffect } from 'react';
import TaskItem from '../components/taskitem';
import styles from './TaskList.module.css';

const TaskList = ({ userRole }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("tftoken")  
      const response = await fetch(`http://13.222.160.28:5000/api/tasks`, {
      method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      
      const data = await response.json();
      console.log(data)
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      const token = localStorage.getItem("tftoken")
      const response = await fetch(`http://13.222.160.28:5000/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      setTasks(tasks.filter(task => task._id !== taskId));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className={styles.loading}>Loading tasks...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <div className={styles.taskList}>
      <div className={styles.taskListHeader}>
        <h2 className={styles.taskListTitle}>All Tasks</h2>
        <span className={styles.taskCount}>{tasks.length} tasks</span>
      </div>

      {tasks.length === 0 ? (
        <div className={styles.noTasks}>
          No tasks yet. Create your first task!
        </div>
      ) : (


        <div className={styles.tgt}>
          <div className={styles.tasksGrid}>
          {tasks.map(task => (
            <TaskItem
              key={task._id}
              task={task}
              userRole={userRole}
              onDelete={handleDeleteTask}
              onTaskUpdated={fetchTasks}
            />
          ))}
        </div>
          </div>
        
      )}
    </div>
  );
};

export default TaskList;