import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import styles from './Auth.module.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginUser(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    }
  };

  return (
    <div className={styles.authPage}>
      <Link to="/">
        <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon Logo" className={styles.logoDark} />
      </Link>
      
      <div className={styles.authContainer}>
        <h1>Sign in</h1>
        {error && <div className={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label>Email or mobile phone number</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className={styles.inputGroup}>
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          
          <button type="submit" className={styles.primaryBtn}>Continue</button>
        </form>
        
        <p className={styles.terms}>
          By continuing, you agree to Amazon's Conditions of Use and Privacy Notice.
        </p>
      </div>

      <div className={styles.dividerBox}>
        <div className={styles.dividerTitle}>New to Amazon?</div>
      </div>
      
      <Link to="/signup" className={styles.createBtn}>
        Create your Amazon account
      </Link>
    </div>
  );
};
export default LoginPage;
