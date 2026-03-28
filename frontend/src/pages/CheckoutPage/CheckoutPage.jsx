import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import { orderAPI } from '../../services/api';
import styles from './CheckoutPage.module.css';

const CheckoutPage = () => {
  const { cart, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [selectedAddressIdx, setSelectedAddressIdx] = useState(0);
  
  const [placing, setPlacing] = useState(false);

  const items = cart?.items || [];
  if (items.length === 0) {
    return <div><Navbar /><p style={{padding:'20px'}}>Your cart is empty.</p><Footer /></div>;
  }

  const subtotal = items.reduce((acc, item) => acc + (item.productId?.discountedPrice || 0) * item.quantity, 0);

  const handlePlaceOrder = async () => {
    setPlacing(true);
    try {
      const orderData = {
        userId: user._id,
        items: items.map(i => ({ 
          productId: i.productId._id,
          name: i.productId.name,
          image: i.productId.images[0],
          price: i.productId.discountedPrice,
          quantity: i.quantity
        })),
        shippingAddress: user?.addresses?.[selectedAddressIdx] ? {
          fullName: user.addresses[selectedAddressIdx].fullName || user.name,
          phone: user.addresses[selectedAddressIdx].phone || user?.phone || '0000000000',
          line1: user.addresses[selectedAddressIdx].line1,
          city: user.addresses[selectedAddressIdx].city,
          state: user.addresses[selectedAddressIdx].state,
          pincode: user.addresses[selectedAddressIdx].pincode
        } : {
          fullName: user?.name || 'Guest User',
          phone: user?.phone || '0000000000',
          line1: 'Street 1, Haus Khas',
          city: 'Delhi',
          state: 'Delhi',
          pincode: '110070'
        },
        pricing: {
          subtotal,
          deliveryCharge: 0,
          discount: 0,
          total: subtotal
        },
        paymentMethod: 'COD'
      };

      const { data } = await orderAPI.placeOrder(orderData);
      await clearCart();
      navigate(`/order-confirm/${data.orderId}`);
    } catch(err) {
      console.error(err);
      alert('Failed to place order.');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon Logo" className={styles.logo} />
        <h2>Checkout ({items.reduce((a,c)=>a+c.quantity, 0)} items)</h2>
        <span>🔒</span>
      </header>
      
      <div className={styles.container}>
        <div className={styles.mainCol}>
          <div className={styles.stepBox}>
            <h3>1. Delivery address</h3>
            <div className={styles.stepContent}>
              {user?.addresses && user.addresses.length > 0 ? (
                user.addresses.map((addr, idx) => (
                  <div key={idx} style={{ marginBottom: '10px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <input 
                      type="radio" 
                      name="address" 
                      checked={selectedAddressIdx === idx} 
                      onChange={() => setSelectedAddressIdx(idx)}
                      style={{ marginTop: '5px' }}
                    />
                    <div>
                      <p style={{ margin: 0 }}><strong>{addr.fullName}</strong></p>
                      <p style={{ margin: 0 }}>{addr.line1}, {addr.city}</p>
                      <p style={{ margin: 0 }}>{addr.state} {addr.pincode}</p>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <p><strong>{user?.name || 'Guest User'}</strong></p>
                  <p>Street 1, Haus Khas, Delhi, Delhi 110070, India</p>
                </>
              )}
            </div>
          </div>
          
          <div className={styles.stepBox}>
            <h3>2. Payment method</h3>
            <div className={styles.stepContent}>
              <p><strong>Cash on Delivery (COD)</strong></p>
              <p>Pay on delivery with cash, UPI or card.</p>
            </div>
          </div>
          
          <div className={styles.stepBox}>
            <h3>3. Review items and delivery</h3>
            <div className={styles.stepContent}>
              {items.map(i => (
                <div key={i.productId._id} className={styles.reviewItem}>
                  <img src={i.productId.images[0]} alt={i.productId.name} className={styles.itemImg}/>
                  <div className={styles.itemInfo}>
                    <h4>{i.productId.name}</h4>
                    <span className={styles.itemPrice}>₹{i.productId.discountedPrice.toLocaleString('en-IN')}</span>
                    <span className={styles.itemQty}>Qty: {i.quantity}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className={styles.sideCol}>
          <div className={styles.summaryBox}>
            <button className={styles.placeBtn} onClick={handlePlaceOrder} disabled={placing}>
              {placing ? 'Placing Order...' : 'Place your order'}
            </button>
            <p className={styles.disclaimer}>By placing your order, you agree to Amazon's privacy notice and conditions of use.</p>
            <hr />
            <h3>Order Summary</h3>
            <div className={styles.summaryRow}><span>Items:</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div>
            <div className={styles.summaryRow}><span>Delivery:</span><span>₹0</span></div>
            <div className={styles.summaryRow}><span>Total:</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div>
            <hr />
            <div className={styles.orderTotal}><span>Order Total:</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
export default CheckoutPage;
