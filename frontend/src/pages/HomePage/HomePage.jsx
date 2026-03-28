import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import ProductCard from '../../components/ProductCard/ProductCard';
import { productAPI } from '../../services/api';
import styles from './HomePage.module.css';
const categoryImages = {
  'Electronics': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=400&h=300',
  'Books': 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&q=80&w=400&h=300',
  'Clothing': 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'Kitchen & Home': 'https://images.unsplash.com/photo-1652349566530-86ef1a7cfd7d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'Sports & Fitness': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=400&h=300',
  'Beauty & Personal Care': 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=400&h=300'
};

const HomePage = () => {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featRes, catRes] = await Promise.all([
          productAPI.getFeatured(),
          productAPI.getCategories()
        ]);
        setFeatured(featRes.data);
        setCategories(catRes.data);
      } catch (err) {
        console.error('Error fetching home data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className={styles.homeBox}>
      <Navbar />
      
      <div className={styles.heroBanner}>
        <div className={styles.heroGradient}></div>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.categoryGrid}>
          {categories.map((cat, i) => (
            <div key={i} className={styles.catCard}>
              <h3>Explore {cat}</h3>
              <div className={styles.catImgBox}>
                <img src={categoryImages[cat] || 'https://images.unsplash.com/photo-1521566652839-a1705e4fb066?auto=format&fit=crop&q=80&w=400&h=300'} alt={cat} />
              </div>
              <Link to={`/products?category=${encodeURIComponent(cat)}`} className={styles.catLink}>See more</Link>
            </div>
          ))}
        </div>

        <section className={styles.featuredSection}>
          <h2>Featured Deals</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className={styles.featuredRail}>
              {featured.map(prod => (
                <div key={prod._id} className={styles.railItem}>
                  <ProductCard product={prod} />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;
