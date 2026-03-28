import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { orderAPI } from '../../services/api';
import styles from './OrderConfirmPage.module.css';

const OrderConfirmPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    orderAPI.getOrderById(orderId)
      .then(res => setOrder(res.data))
      .catch(console.error);
  }, [orderId]);

  if (!order) return <div className={styles.page}><Navbar /><p>Loading order details...</p><Footer /></div>;

  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.successBox}>
          <div className={styles.checkIcon}>✓</div>
          <div className={styles.thankYouText}>
            <h2>Order placed, thank you!</h2>
            <p>Confirmation will be sent to your email.</p>
          </div>
        </div>

        <div className={styles.detailsBox}>
          <p><strong>Order Number:</strong> {order.orderId}</p>
          <p><strong>Total:</strong> ₹{order.pricing.total.toLocaleString('en-IN')}</p>
          <p><strong>Delivery:</strong> {new Date(order.estimatedDelivery).toLocaleDateString('en-IN')}</p>
          <Link to="/orders" className={styles.link}>View or manage your order</Link>
          <Link to="/" className={styles.link}>Continue shopping</Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};
export default OrderConfirmPage;
