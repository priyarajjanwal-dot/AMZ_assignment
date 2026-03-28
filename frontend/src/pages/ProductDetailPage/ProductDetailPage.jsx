import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import ImageCarousel from '../../components/ImageCarousel/ImageCarousel';
import StarRating from '../../components/StarRating/StarRating';
import { productAPI } from '../../services/api';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import styles from './ProductDetailPage.module.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addItem, loading: cartLoading } = useContext(CartContext);
  const [quantity, setQuantity] = useState(1);
  const { user } = useContext(AuthContext);

  const isGuest = !user || user._id === "000000000000000000000001";

  useEffect(() => {
    productAPI.getById(id)
      .then(res => setProduct(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (product) {
      if(isGuest) return navigate('/login');
      await addItem(product._id, quantity);
      navigate('/cart');
    }
  };

  const handleBuyNow = async () => {
    if (product) {
      if(isGuest) return navigate('/login');
      await addItem(product._id, quantity);
      navigate('/checkout');
    }
  };

  if (loading) return <div><Navbar /><p>Loading...</p><Footer /></div>;
  if (!product) return <div><Navbar /><p>Product not found</p><Footer /></div>;

  return (
    <div className={styles.page}>
      <Navbar />
      
      <div className={styles.container}>
        <div className={styles.imageCol}>
          <ImageCarousel images={product.images} />
        </div>
        
        <div className={styles.detailsCol}>
          <h1 className={styles.title}>{product.name}</h1>
          <div className={styles.ratingBox}>
            <StarRating rating={product.rating} count={product.reviewCount} />
          </div>
          
          <hr className={styles.divider} />
          
          <div className={styles.priceSection}>
            <div className={styles.discountBadge}>-{product.discountPercent}%</div>
            <div className={styles.priceBox}>
              <span className={styles.symbol}>₹</span>
              <span className={styles.price}>{product.discountedPrice.toLocaleString('en-IN')}</span>
            </div>
            <div className={styles.mrpBox}>
              M.R.P.: <span className={styles.mrp}>₹{product.price.toLocaleString('en-IN')}</span>
            </div>
          </div>
          
          <div className={styles.taxInfo}>Inclusive of all taxes</div>

          <hr className={styles.divider} />
          
          <div className={styles.specs}>
            <h3>Specifications</h3>
            <ul>
              {product.specifications?.map((spec, idx) => (
                <li key={idx}><strong>{spec.key}:</strong> {spec.value}</li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className={styles.buyCol}>
          <div className={styles.buyBox}>
            <div className={styles.buyPrice}>₹{product.discountedPrice.toLocaleString('en-IN')}</div>
            <div className={styles.deliveryInfo}>
              <strong>FREE delivery</strong> tomorrow.
            </div>
            <h4 className={styles.inStock}>In stock</h4>
            
            <div className={styles.qtyBox}>
              <label>Quantity: </label>
              <select value={quantity} onChange={e => setQuantity(Number(e.target.value))}>
                {[1,2,3,4,5].map(num => <option key={num} value={num}>{num}</option>)}
              </select>
            </div>
            
            <button className={styles.addBtn} onClick={handleAddToCart} disabled={cartLoading}>Add to Cart</button>
            <button className={styles.buyBtn} onClick={handleBuyNow} disabled={cartLoading}>Buy Now</button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProductDetailPage;
