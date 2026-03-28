import React from 'react';

const Star = ({ fill }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill={fill} stroke="#ffa41c" strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

const StarRating = ({ rating, count }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<Star key={i} fill="#ffa41c" />);
    } else if (rating >= i - 0.5) {
      stars.push(<Star key={i} fill="url(#halfGrad)" />);
    } else {
      stars.push(<Star key={i} fill="none" />);
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      <svg width="0" height="0">
        <defs>
          <linearGradient id="halfGrad" x1="0" x2="1" y1="0" y2="0">
            <stop offset="50%" stopColor="#ffa41c" />
            <stop offset="50%" stopColor="transparent" />
          </linearGradient>
        </defs>
      </svg>
      {stars}
      {count !== undefined && <span style={{ color: '#007185', fontSize: '13px', marginLeft: '5px' }}>{count}</span>}
    </div>
  );
};

export default StarRating;
