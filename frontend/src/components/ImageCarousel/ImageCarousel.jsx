import React, { useState } from 'react';
import styles from './ImageCarousel.module.css';

const ImageCarousel = ({ images = [] }) => {
  const [mainIndex, setMainIndex] = useState(0);

  if (images.length === 0) return null;

  return (
    <div className={styles.carouselContainer}>
      <div className={styles.thumbnails}>
        {images.map((img, idx) => (
          <div 
            key={idx} 
            className={`${styles.thumbnailBox} ${mainIndex === idx ? styles.active : ''}`}
            onMouseEnter={() => setMainIndex(idx)}
          >
            <img src={img} alt={`Thumbnail ${idx}`} className={styles.thumbnail} />
          </div>
        ))}
      </div>
      <div className={styles.mainImageBox}>
        <img src={images[mainIndex]} alt="Main product" className={styles.mainImage} />
      </div>
    </div>
  );
};

export default ImageCarousel;
