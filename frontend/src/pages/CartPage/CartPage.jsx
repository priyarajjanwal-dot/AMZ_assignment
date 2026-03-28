import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { CartContext } from '../../context/CartContext';
import styles from './CartPage.module.css';

const CartPage = () => {
  const { cart, loading, updateQty, removeItem } = useContext(CartContext);
  const navigate = useNavigate();

  if (loading) return <div><Navbar /><p>Loading cart...</p><Footer /></div>;

  const items = cart?.items || [];
  const isEmpty = items.length === 0;

  const subtotal = items.reduce((acc, item) => {
    return acc + (item.productId?.discountedPrice || 0) * item.quantity;
  }, 0);
  
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className={styles.page}>
      <Navbar />
      
      <div className={styles.container}>
        <div className={styles.cartCol}>
          <div className={styles.cartBox}>
            <h1 className={styles.title}>Shopping Cart</h1>
            {isEmpty && <p>Your Amazon Cart is empty.</p>}
            
            <div className={styles.priceHeader}>Price</div>
            <hr className={styles.divider} />

            {items.map(item => {
              const product = item.productId;
              if (!product) return null;
              
              return (
                <div key={product._id} className={styles.cartItem}>
                  <div className={styles.itemLeft}>
                    <img src={product.images[0]} alt={product.name} className={styles.itemImg} />
                  </div>
                  <div className={styles.itemMid}>
                    <Link to={`/products/${product._id}`} className={styles.itemName}>
                      {product.name}
                    </Link>
                    <div className={styles.inStock}>In stock</div>
                    <div className={styles.delivery}>Eligible for FREE Shipping</div>
                    
                    <div className={styles.actions}>
                      <select 
                        value={item.quantity} 
                        onChange={e => updateQty(product._id, Number(e.target.value))}
                        className={styles.qtySelect}
                      >
                        {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>Qty: {n}</option>)}
                      </select>
                      <span className={styles.separator}>|</span>
                      <button className={styles.deleteBtn} onClick={() => removeItem(product._id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className={styles.itemRight}>
                    <span className={styles.itemPrice}>₹{product.discountedPrice.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              );
            })}
            
            {!isEmpty && (
              <div className={styles.subtotalArea}>
                <span className={styles.subtotalText}>
                  Subtotal ({totalItems} items): <strong>₹{subtotal.toLocaleString('en-IN')}</strong>
                </span>
              </div>
            )}
          </div>
        </div>
        
        {!isEmpty && (
          <div className={styles.checkoutCol}>
            <div className={styles.checkoutBox}>
              <div className={styles.freeShippingBanner}>
                Your order is eligible for FREE Delivery.
              </div>
              <div className={styles.subtotalCheckout}>
                Subtotal ({totalItems} items): <strong>₹{subtotal.toLocaleString('en-IN')}</strong>
              </div>
              <button className={styles.checkoutBtn} onClick={() => navigate('/checkout')}>
                Proceed to Buy
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CartPage;
