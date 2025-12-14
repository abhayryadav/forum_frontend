import { useState } from 'react';
import styles from './comment.module.css';

export default function CommentForm({ taskId, onCommentAdded }) {
  const [text, setText] = useState('');

  const handleSubmit = async (e) => {
    const token = localStorage.getItem("tftoken")
    e.preventDefault();
    const res = await fetch(`http://${process.env.NEXT_PUBLIC_URL}:5000/api/comments`, {
      method: 'POST',
      headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      body: JSON.stringify({ text, task: taskId })
    });
    if (res.ok) {
      setText('');
      onCommentAdded();
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.commentForm}>
      <textarea
        placeholder="Add comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        required
      />
      <button type="submit">Add Comment</button>
    </form>
  );
}