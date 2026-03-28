import React from 'react';
import styles from './CategoryFilter.module.css';

const CategoryFilter = ({ categories, selectedCategory, onSelect }) => {
  return (
    <div className={styles.filterBox}>
      <h3 className={styles.title}>Department</h3>
      <ul className={styles.list}>
        <li 
          className={`${styles.item} ${!selectedCategory ? styles.active : ''}`}
          onClick={() => onSelect('')}
        >
          All Categories
        </li>
        {categories.map((cat, idx) => (
          <li 
            key={idx} 
            className={`${styles.item} ${selectedCategory === cat ? styles.active : ''}`}
            onClick={() => onSelect(cat)}
          >
            {cat}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryFilter;
