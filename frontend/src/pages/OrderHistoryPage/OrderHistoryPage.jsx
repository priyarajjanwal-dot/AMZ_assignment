import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { orderAPI } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import styles from './OrderHistoryPage.module.css';

const OrderHistoryPage = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?._id) {
      orderAPI.getUserOrders(user._id)
        .then(res => setOrders(res.data))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user]);

  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.container}>
        <h1 className={styles.title}>Your Orders</h1>
        
        {loading ? <p>Loading orders...</p> : 
         orders.length === 0 ? <p>You have no orders.</p> : 
         orders.map(order => (
          <div key={order._id} className={styles.orderCard}>
            <div className={styles.orderHeader}>
              <div className={styles.headerInfo}>
                <div className={styles.infoCol}>
                  <span className={styles.label}>ORDER PLACED</span>
                  <span className={styles.val}>{new Date(order.placedAt).toLocaleDateString('en-IN')}</span>
                </div>
                <div className={styles.infoCol}>
                  <span className={styles.label}>TOTAL</span>
                  <span className={styles.val}>₹{order.pricing.total.toLocaleString('en-IN')}</span>
                </div>
                <div className={styles.infoCol}>
                  <span className={styles.label}>DISPATCH TO</span>
                  <span className={styles.val}>{order.shippingAddress.street}, {order.shippingAddress.city}</span>
                </div>
              </div>
              <div className={styles.headerRight}>
                <span className={styles.label}>ORDER # {order.orderId}</span>
                <Link to={`/order-confirm/${order.orderId}`} className={styles.link}>View order details</Link>
              </div>
            </div>
            
            <div className={styles.orderBody}>
              <h3 className={styles.status}>
                {order.status === 'Processing' ? 'Arriving soon' : order.status}
              </h3>
              
              {order.items.map(item => (
                <div key={item.productId} className={styles.itemRow}>
                  <img src={item.image} alt={item.name} className={styles.itemImg} />
                  <div className={styles.itemDetails}>
                    <Link to={`/products/${item.productId}`} className={styles.itemName}>{item.name}</Link>
                    <span className={styles.itemQty}>Qty: {item.quantity}</span>
                  </div>
                  <div className={styles.itemActions}>
                    <button className={styles.actionBtn}>Track package</button>
                    <button className={styles.actionBtn}>Return items</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
};
export default OrderHistoryPage;
