import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import StarRating from '../StarRating/StarRating';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import { userAPI } from '../../services/api';
import styles from './ProductCard.module.css';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addItem } = useContext(CartContext);
  const { user, updateUser } = useContext(AuthContext);
  const [loadingWishlist, setLoadingWishlist] = useState(false);

  const isGuest = !user || user._id === "000000000000000000000001";
  
  // Check if product is in wishlist.
  const isInWishlist = !isGuest && user.wishlist?.some(
    w => typeof w === 'object' ? w._id === product._id : w === product._id
  );

  const toggleWishlist = async (e) => {
    e.stopPropagation();
    if (isGuest) {
      navigate('/login');
      return;
    }
    
    setLoadingWishlist(true);
    try {
      if (isInWishlist) {
        const res = await userAPI.removeFromWishlist(product._id);
        updateUser(res.data);
      } else {
        const res = await userAPI.addToWishlist(product._id);
        updateUser(res.data);
      }
    } catch(err) {
      console.error(err);
    } finally {
      setLoadingWishlist(false);
    }
  };

  return (
    <div className={styles.card}>
      <button 
        className={`${styles.wishlistBtn} ${isInWishlist ? styles.active : ''}`}
        onClick={toggleWishlist}
        disabled={loadingWishlist}
      >
        {isInWishlist ? '❤️' : '🤍'}
      </button>
      <Link to={`/products/${product._id}`} className={styles.imageBox}>
        <img src={product.images[0]} alt={product.name} className={styles.image} />
      </Link>
      
      <div className={styles.details}>
        <Link to={`/products/${product._id}`} className={styles.title}>
          {product.name}
        </Link>
        
        <div className={styles.ratingBox}>
          <StarRating rating={product.rating} count={product.reviewCount} />
        </div>
        
        <div className={styles.priceBox}>
          <span className={styles.currency}>₹</span>
          <span className={styles.price}>{product.discountedPrice.toLocaleString('en-IN')}</span>
          <span className={styles.mrp}>M.R.P: ₹{product.price.toLocaleString('en-IN')}</span>
          <span className={styles.discount}>({product.discountPercent}% off)</span>
        </div>
        
        <div className={styles.delivery}>
          FREE Delivery by Amazon
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
