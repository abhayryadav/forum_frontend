"use client"
import React, { useState, useEffect } from 'react';
import TaskList from './TaskList/page';
import TaskForm from './components/TaskForm';
import LoginSignup from './components/login';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [showLogin, setShowLogin] = useState(true);
  const router = useRouter()
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    const token = localStorage.getItem("tftoken")
    if(!token){
      window.alert("please login")
      router.push("/")
      return
    }
    try {
      setLoading(true)
      const response = await fetch('http://localhost:5000/api/auth/verify-token', {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (response.ok) {
        console.log("99999999999",data)
        
        setIsAuthenticated(true);
        setUserRole(data.user.role);
        
          setLoading(false)
       
      }
    } catch (error) {
      console.error('Session check error:', error);
    }
  };

  const handleAuthSuccess = (role) => {
    setIsAuthenticated(true);
    setUserRole(role);
  };

  const handleLogout = async () => {
    try {
      const resp = await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
      });
      if(resp.ok){
        localStorage.removeItem('tftoken')
        localStorage.removeItem('tfuser')
      }
      setIsAuthenticated(false);
      setUserRole('');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className={styles.appContainer}>
        <LoginSignup 
          onAuthSuccess={handleAuthSuccess}
          showLogin={showLogin}
          setShowLogin={setShowLogin}
        />
      </div>
    );
  }







  if (loading) {
  return (
     <div className={styles.loadingContainer}>
   
      <div className={styles.loadingText}>Loading</div>
    </div>
  )
}
  return (
    <div className={styles.appContainer}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.appTitle}>TaskFlow</h1>
          <div className={styles.userInfo}>
            <span className={`${styles.roleBadge} ${userRole === 'admin' ? styles.superuser : ''}`}>
              {userRole === 'admin' ? 'admin' : 'User'}
            </span>
            <button onClick={handleLogout} className={styles.logoutButton}>
              Logout
            </button>
          </div>
        </div>
      </header>
      
      <main className={styles.mainContent}>
        <div className={styles.container}>
          <div className={styles.dashboard}>
            <div className={styles.sidebar}>
              <TaskForm userRole={userRole} />
            </div>
            
            <div className={styles.content}>
              <TaskList userRole={userRole} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;