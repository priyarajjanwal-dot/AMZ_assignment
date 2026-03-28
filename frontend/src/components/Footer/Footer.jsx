import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.backToTop} onClick={() => window.scrollTo(0, 0)}>
        Back to top
      </div>
      
      <div className={styles.linkContainer}>
        <div className={styles.linkColumn}>
          <h3>Get to Know Us</h3>
          <ul>
            <li><Link to="/">About Us</Link></li>
            <li><Link to="/">Careers</Link></li>
            <li><Link to="/">Press Releases</Link></li>
            <li><Link to="/">Amazon Science</Link></li>
          </ul>
        </div>
        
        <div className={styles.linkColumn}>
          <h3>Connect with Us</h3>
          <ul>
            <li><Link to="/">Facebook</Link></li>
            <li><Link to="/">Twitter</Link></li>
            <li><Link to="/">Instagram</Link></li>
          </ul>
        </div>
        
        <div className={styles.linkColumn}>
          <h3>Make Money with Us</h3>
          <ul>
            <li><Link to="/">Sell on Amazon</Link></li>
            <li><Link to="/">Sell under Amazon Accelerator</Link></li>
            <li><Link to="/">Amazon Global Selling</Link></li>
            <li><Link to="/">Affiliate Program</Link></li>
          </ul>
        </div>
        
        <div className={styles.linkColumn}>
          <h3>Let Us Help You</h3>
          <ul>
            <li><Link to="/">COVID-19 and Amazon</Link></li>
            <li><Link to="/profile">Your Account</Link></li>
            <li><Link to="/orders">Returns Centre</Link></li>
            <li><Link to="/">100% Purchase Protection</Link></li>
          </ul>
        </div>
      </div>
      
      <div className={styles.bottomBar}>
        <div className={styles.logoBox}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon Logo" className={styles.logo} />
        </div>
        <p className={styles.copyright}>© 1996-2026, Amazon.com, Inc. or its affiliates</p>
      </div>
    </footer>
  );
};

export default Footer;
