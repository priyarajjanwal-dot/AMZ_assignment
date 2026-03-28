import React, { useContext, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { AuthContext } from '../../context/AuthContext';
import { userAPI } from '../../services/api';
import styles from './ProfilePage.module.css';

const ProfilePage = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  
  const [addressForm, setAddressForm] = useState({
    fullName: '', phone: '', line1: '', city: '', state: '', pincode: ''
  });

  if (!user || user._id === "000000000000000000000001") {
    return <Navigate to="/login" />;
  }

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const { data } = await userAPI.addAddress({ ...addressForm, label: 'Home' });
      updateUser(data);
      setShowModal(false);
      setAddressForm({ fullName: '', phone: '', line1: '', city: '', state: '', pincode: '' });
    } catch(err) {
      console.error(err);
      alert('Failed to add address');
    }
  };

  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.container}>
        <h1 className={styles.title}>Your Account</h1>
        
        <div className={styles.grid}>
          <Link to="/orders" className={styles.card}>
            <div className={styles.icon}>📦</div>
            <div className={styles.cardContent}>
              <h3>Your Orders</h3>
              <p>Track, return, or buy things again</p>
            </div>
          </Link>
          
          <div className={styles.card} style={{ cursor: 'default' }}>
            <div className={styles.icon}>🔒</div>
            <div className={styles.cardContent}>
              <h3>Login & Security</h3>
              <p>Edit login, name, and mobile number</p>
              <div className={styles.infoLine}><strong>Name:</strong> {user.name}</div>
              <div className={styles.infoLine}><strong>Email:</strong> {user.email}</div>
            </div>
          </div>
          
          <div className={styles.card} onClick={() => setShowModal(true)}>
            <div className={styles.icon}>📍</div>
            <div className={styles.cardContent}>
              <h3>Your Addresses</h3>
              <p>Click to add new address</p>
              {user.addresses?.map((addr, idx) => (
                <div key={idx} className={styles.addressBlock}>
                  <strong>{addr.fullName}</strong><br/>
                  {addr.line1}<br/>
                  {addr.city}, {addr.state} {addr.pincode}
                </div>
              ))}
              {(!user.addresses || user.addresses.length === 0) && <p className={styles.emptyText}>No addresses saved yet.</p>}
            </div>
          </div>
          
          <Link to="/wishlist" className={styles.card}>
            <div className={styles.icon}>❤️</div>
            <div className={styles.cardContent}>
              <h3>Your Wishlist</h3>
              <p>View items you have saved</p>
            </div>
          </Link>
        </div>
      </div>

      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Add a new address</h3>
            </div>
            <form onSubmit={handleAddAddress} className={styles.modalBody}>
              <div className={styles.inputGroup}>
                <label>Full Name</label>
                <input required value={addressForm.fullName} onChange={e => setAddressForm({...addressForm, fullName: e.target.value})} />
              </div>
              <div className={styles.inputGroup}>
                <label>Phone Number</label>
                <input required value={addressForm.phone} onChange={e => setAddressForm({...addressForm, phone: e.target.value})} />
              </div>
              <div className={styles.inputGroup}>
                <label>Flat, House, Building</label>
                <input required value={addressForm.line1} onChange={e => setAddressForm({...addressForm, line1: e.target.value})} />
              </div>
              <div className={styles.inputGroup}>
                <label>City</label>
                <input required value={addressForm.city} onChange={e => setAddressForm({...addressForm, city: e.target.value})} />
              </div>
              <div className={styles.inputGroup}>
                <label>State</label>
                <input required value={addressForm.state} onChange={e => setAddressForm({...addressForm, state: e.target.value})} />
              </div>
              <div className={styles.inputGroup}>
                <label>Pincode</label>
                <input required value={addressForm.pincode} onChange={e => setAddressForm({...addressForm, pincode: e.target.value})} />
              </div>
              
              <button type="submit" className={styles.submitBtn}>Add address</button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};
export default ProfilePage;
