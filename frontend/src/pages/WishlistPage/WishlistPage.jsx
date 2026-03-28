import React, { useContext, useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import ProductCard from '../../components/ProductCard/ProductCard';
import { AuthContext } from '../../context/AuthContext';
import { userAPI } from '../../services/api';
import styles from './WishlistPage.module.css';

const WishlistPage = () => {
  const { user } = useContext(AuthContext);
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user._id !== "000000000000000000000001") {
      userAPI.getProfile().then(res => {
        setWishlistProducts(res.data.wishlist || []);
      }).catch(err => {
        console.error("Failed to load wishlist", err);
      }).finally(() => {
         setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user || user._id === "000000000000000000000001") {
    return <Navigate to="/login" />;
  }

  const handleRemove = async (productId) => {
    try {
      const res = await userAPI.removeFromWishlist(productId);
      setWishlistProducts(res.data.wishlist || []);
    } catch(err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.container}>
        <h1 className={styles.title}>Your Wishlist</h1>
        
        {loading ? <p>Loading your saved items...</p> : 
         wishlistProducts.length === 0 ? (
           <div className={styles.emptyBox}>
             <p>Your wishlist is currently empty.</p>
             <Link to="/" className={styles.shopBtn}>Continue Shopping</Link>
           </div>
         ) : (
           <div className={styles.grid}>
             {wishlistProducts.map(product => (
               <div key={product._id} className={styles.productWrap}>
                 <ProductCard product={product} />
                 <button className={styles.removeBtn} onClick={() => handleRemove(product._id)}>
                   Remove from list
                 </button>
               </div>
             ))}
           </div>
         )
        }
      </div>
      <Footer />
    </div>
  );
};

export default WishlistPage;
