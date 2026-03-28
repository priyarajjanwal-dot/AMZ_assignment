import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userAPI } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import styles from './Auth.module.css';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await userAPI.register({ name, email, password });
      await loginUser(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className={styles.authPage}>
      <Link to="/">
        <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon Logo" className={styles.logoDark} />
      </Link>
      
      <div className={styles.authContainer}>
        <h1>Create Account</h1>
        {error && <div className={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label>Your name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="First and last name" />
          </div>
          <div className={styles.inputGroup}>
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className={styles.inputGroup}>
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="At least 6 characters" />
          </div>
          
          <button type="submit" className={styles.primaryBtn}>Verify email</button>
        </form>
        
        <p className={styles.terms}>
          By creating an account, you agree to Amazon's Conditions of Use and Privacy Notice.
        </p>
        
        <div className={styles.footerLinks}>
          Already have an account? <Link to="/login" className={styles.linkText}>Sign in</Link>
        </div>
      </div>
    </div>
  );
};
export default SignupPage;
