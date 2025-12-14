'use client';

import React, { useState } from 'react';
import styles from './login.module.css';
import { useRouter } from 'next/navigation';

function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    SecretKey: '',
  });
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [admslctd,setadmslctd] = useState(0);
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {

    
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    

    // Validation
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      setLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
    //   if(isLogin){
        
    //     const token = localStorage.getItem("tftoken");
    //     if(token){
    //         const verifytoken = await fetch('http://localhost:5000/api/auth/verify-token', {
    //             method: "GET",
    //             headers: {
    //             'Authorization': `Bearer ${token}`,
    //             'Content-Type': 'application/json',
    //             },
    //         });
    //         console.log("oooooooooooooooooooooooo")
    //         if(verifytoken.ok){
                
    //             setTimeout(() => {
                    
    //                 window.location.href = "/";
    //                 }, 3000);
    //         }else{
    //             localStorage.removeItem("tftoken")
    //             window.alert("session expired please login")
    //         }
         
    //     }
        
    //   }
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : { 
            email: formData.email,
            password: formData.password,
            role: formData.role,
            SecretKey:formData.SecretKey
          };
      const response = await fetch(`http://${process.env.NEXT_PUBLIC_URL}:5000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      console.log("oooooooooooooooooooooooo")
      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      // Store token in localStorage
      if (data.token) {
        localStorage.setItem('tftoken', data.token);
        localStorage.setItem('tfuser', JSON.stringify(data.user));
      }

      // Success message
      const userEmail = data.user.email.split('@')[0];
      setSuccess(`${isLogin ? 'Login' : 'Signup'} successful! Welcome ${userEmail}`);
      
      // Reset form
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        role: 'user'
      });

                    
        window.location.href = "/";
 

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };




  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>TaskFlow</h1>
          <p className={styles.subtitle}>Modern Task Management</p>
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${isLogin ? styles.active : ''}`}
            onClick={() => {
              setIsLogin(true);
              setError('');
              setSuccess('');
              setFormData({
                email: formData.email,
                password: '',
                confirmPassword: '',
                role: 'user'
              });
            }}
          >
            Login
          </button>
          <button
            className={`${styles.tab} ${!isLogin ? styles.active : ''}`}
            onClick={() => {
              setIsLogin(false);
              setError('');
              setSuccess('');
            }}
          >
            Sign Up
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          {success && (
            <div className={styles.success}>
              {success}
            </div>
          )}

          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="Enter your email"
              required
            />
          </div>

          {!isLogin && (
            <div className={styles.roleSelection}>
              <label className={styles.roleLabel}>Select Your Role</label>
              <div className={styles.roleOptions}>
                <label className={styles.roleOption}>
                  <input
                    type="radio"
                    name="role"
                    value="user"
                    checked={formData.role === 'user'}
                    onChange={handleInputChange}
                    onClick={()=>{setadmslctd(0)}}
                    className={styles.roleRadio}
                  />
                  <div className={styles.roleCard}>
                    <div className={`${styles.roleIcon} ${styles.userIcon}`}>
                      <svg viewBox="0 0 24 24" width="24" height="24">
                        <path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    </div>
                    <div className={styles.roleInfo}>
                      <span className={styles.roleTitle}>Regular User</span>
                      <span className={styles.roleDesc}>Create & manage your tasks</span>
                    </div>
                  </div>
                </label>

                <label className={styles.roleOption}>
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={formData.role === 'admin'}
                    onChange={handleInputChange}
                    onClick={()=>{setadmslctd(1)}}
                    className={styles.roleRadio}
                  />
                  <div className={styles.roleCard}>
                    <div className={`${styles.roleIcon} ${styles.superuserIcon}`}>
                      <svg viewBox="0 0 24 24" width="24" height="24">
                        <path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                      </svg>
                    </div>
                    <div className={styles.roleInfo}>
                      <span className={styles.roleTitle}>Admin</span>
                      <span className={styles.roleDesc}>Advanced features & analytics</span>
                    </div>
                  </div>
                </label>

                
              </div>
            </div>
          )}

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="Enter your password"
              required
              minLength="6"
            />
          </div>

          {!isLogin && (
            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword" className={styles.label}>Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Confirm your password"
                required
                minLength="6"
              />
            </div>
          )}
          {admslctd == 1 &&(
            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword" className={styles.label}>Secret Key</label>
              <input
                type="password"
                id="secretkey"
                name="SecretKey"
                value={formData.SecretKey}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Secret Key"
                required
                minLength="4"
              />
            </div>
          )}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Create Account')}
          </button>
        </form>

        <div className={styles.footer}>
          <p className={styles.footerText}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              className={styles.linkButton}
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setSuccess('');
                setFormData({
                  email: formData.email,
                  password: '',
                  confirmPassword: '',
                  role: 'user'
                });
              }}
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>
      </div>

      {/* <div className={styles.demoCredentials}>
        <h3 className={styles.demoTitle}>Demo Information:</h3>
        <p className={styles.demoText}>• Use your email address for login</p>
        <p className={styles.demoText}>• Passwords are securely hashed</p>
        <p className={styles.demoText}>• JWT tokens expire in 7 days</p>
        <p className={styles.demoText}>• Choose your role during signup</p>
      </div> */}
    </div>
  );
}

export default LoginPage;