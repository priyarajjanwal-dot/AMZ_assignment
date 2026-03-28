import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { cart } = useContext(CartContext);
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  
  // Local state for non-logged in users
  const [localPincode, setLocalPincode] = useState(() => localStorage.getItem('amazon_pincode') || 'Select your address');

  const handleSearch = (e) => {
    e.preventDefault();
    const catParam = searchCategory === 'All Categories' || !searchCategory ? '' : searchCategory;
    navigate(`/products?q=${encodeURIComponent(searchQuery)}&category=${encodeURIComponent(catParam)}`);
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  const cartCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
  
  const isLoggedIn = user && user._id !== "000000000000000000000001";
  
  let displayLocationPrimary = 'Delivering to';
  let displayLocationSecondary = localPincode;
  if(isLoggedIn && user.addresses?.length > 0) {
    displayLocationSecondary = `${user.addresses[0].city} ${user.addresses[0].pincode}`;
  }

  const setPincode = (val) => {
    setLocalPincode(val);
    localStorage.setItem('amazon_pincode', val);
    setShowLocationModal(false);
  };

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.navLeft}>
          <Link to="/" className={styles.logoBox}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon Logo" className={styles.logo} />
          </Link>
          
          <div className={styles.locationBox} onClick={() => setShowLocationModal(true)}>
            <span className={styles.locLine1}>{displayLocationPrimary}</span>
            <span className={styles.locLine2}>{displayLocationSecondary}</span>
          </div>
        </div>

        <form className={styles.searchBox} onSubmit={handleSearch}>
          <select 
            className={styles.searchDropdown}
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Books">Books</option>
            <option value="Clothing">Clothing</option>
            <option value="Kitchen & Home">Kitchen & Home</option>
            <option value="Sports & Fitness">Sports & Fitness</option>
            <option value="Beauty & Personal Care">Beauty & Personal Care</option>
          </select>
          <input 
            type="text" 
            className={styles.searchInput} 
            placeholder="Search Amazon.in" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className={styles.searchBtn}>🔍</button>
        </form>

        <div className={styles.navRight}>
          <div 
            className={styles.navItem} 
            onMouseEnter={() => setShowUserDropdown(true)}
            onMouseLeave={() => setShowUserDropdown(false)}
          >
            <span className={styles.navLine1}>Hello, {isLoggedIn ? user.name.split(' ')[0] : 'Sign in'}</span>
            <span className={styles.navLine2}>Account & Lists</span>
            
            {showUserDropdown && (
              <div className={styles.userDropdown}>
                {!isLoggedIn ? (
                  <div className={styles.dropdownSignIn}>
                    <Link to="/login" className={styles.btnPrimary}>Sign in</Link>
                    <p>New customer? <Link to="/signup">Start here.</Link></p>
                  </div>
                ) : (
                  <div className={styles.dropdownLinks}>
                    <h3>Your Account</h3>
                    <Link to="/profile">Your Profile</Link>
                    <Link to="/orders">Your Orders</Link>
                    <Link to="/wishlist">Your Wishlist</Link>
                    <button onClick={handleLogout} className={styles.logoutBtn}>Sign Out</button>
                  </div>
                )}
              </div>
            )}
          </div>

          <Link to="/orders" className={styles.navItem}>
            <span className={styles.navLine1}>Returns</span>
            <span className={styles.navLine2}>& Orders</span>
          </Link>

          <Link to="/cart" className={styles.cartBox}>
            <span className={styles.cartCount}>{cartCount}</span>
            <span className={styles.cartText}>Cart</span>
          </Link>
        </div>
      </nav>

      {showLocationModal && (
        <div className={styles.modalOverlay} onClick={() => setShowLocationModal(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Choose your location</h3>
            </div>
            <div className={styles.modalBody}>
              <p>Delivery options and delivery speeds may vary for different locations</p>
              
              {isLoggedIn && user.addresses?.length > 0 && (
                <div className={styles.addressList}>
                   {user.addresses.map((addr, idx) => (
                     <div key={idx} className={styles.addressItem} onClick={() => setPincode(addr.pincode)}>
                       <strong>{addr.fullName}</strong> - {addr.line1}, {addr.city} {addr.pincode}
                     </div>
                   ))}
                </div>
              )}
              
              <div className={styles.pincodeEntry}>
                <p>Or enter a US zip code / India pincode</p>
                <div className={styles.pinInputRow}>
                  <input type="text" id="pinInput" placeholder="Enter pincode" />
                  <button onClick={() => {
                    const val = document.getElementById('pinInput').value;
                    if(val) setPincode(val);
                  }}>Apply</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
