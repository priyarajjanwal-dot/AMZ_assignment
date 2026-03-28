import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import CategoryFilter from '../../components/CategoryFilter/CategoryFilter';
import ProductCard from '../../components/ProductCard/ProductCard';
import { productAPI } from '../../services/api';
import styles from './ProductListPage.module.css';

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  
  const currentCategory = searchParams.get('category') || '';
  const currentQ = searchParams.get('q') || '';
  const currentSort = searchParams.get('sort') || '';
  const currentPage = Number(searchParams.get('page')) || 1;
  
  useEffect(() => {
    productAPI.getCategories().then(res => setCategories(res.data)).catch(console.error);
  }, []);

  useEffect(() => {
    const fetchProds = async () => {
      setLoading(true);
      try {
        const { data } = await productAPI.getAll({ 
          category: currentCategory, 
          search: currentQ, 
          sort: currentSort,
          page: currentPage,
          limit: 8 
        });
        setProducts(data.products);
        setTotal(data.total);
        setTotalPages(data.pages);
      } catch(err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProds();
  }, [currentCategory, currentQ, currentSort, currentPage]);

  const updateFilters = (key, value) => {
    if (value) searchParams.set(key, value);
    else searchParams.delete(key);
    navigate({ search: searchParams.toString() });
  };

  return (
    <div className={styles.page}>
      <Navbar />
      
      <div className={styles.topBar}>
        <span className={styles.resultCount}>
          1-{products.length} of over {total} results {currentQ && `for "${currentQ}"`}
        </span>
        <div className={styles.sortBox}>
          <label>Sort by:</label>
          <select value={currentSort} onChange={e => updateFilters('sort', e.target.value)} className={styles.sortSelect}>
            <option value="">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Avg. Customer Review</option>
          </select>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.sidebar}>
          <CategoryFilter 
            categories={categories} 
            selectedCategory={currentCategory}
            onSelect={(cat) => updateFilters('category', cat)}
          />
        </div>
        
        <div className={styles.gridBox}>
          {loading ? <h4>Loading...</h4> : 
            products.map(p => (
              <div key={p._id} className={styles.gridItem}>
                 <ProductCard product={p} />
              </div>
            ))
          }
          {!loading && products.length === 0 && <h4>No results found.</h4>}
          
          {!loading && totalPages > 1 && (
            <div className={styles.pagination}>
              <button 
                disabled={currentPage === 1}
                onClick={() => updateFilters('page', String(currentPage - 1))}
              >
                Previous
              </button>
              
              <span>Page {currentPage} of {totalPages}</span>
              
              <button 
                disabled={currentPage === totalPages}
                onClick={() => updateFilters('page', String(currentPage + 1))}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductListPage;
