import React from 'react';
import './TopDeals.css'; // Import the external CSS file

// Import images from the assets folder
import pokhara from '../../assets/images/pokhara.jpg';
import lumbini from '../../assets/images/lumbini.jpg';
import kathmandu from '../../assets/images/kathmandu.jpg';
import rara from '../../assets/images/rara.jpg';

import { Link } from 'react-router-dom';


const topDealsData = [
  {
    title: 'Pokhara',
    discount: '73%',
    tours: '65+ Tours',
    image: pokhara,
  },
  {
    title: 'Lumbini',
    discount: '68%',
    tours: '160+ Tours',
    image: lumbini,
  },
  {
    title: 'Kathmandu',
    discount: '43%',
    tours: '70+ Tours',
    image: kathmandu,
  },
  {
    title: 'Rara',
    discount: '40%',
    tours: '10+ Tours',
    image: rara,
  },
];

const TopDeals = () => {
  return (
    <div className="top-deals-container">
      <div className="top-deals-header">
        <h2>Top Deals Around Nepal</h2>
        <p>The best tours and trip deals, globally.</p>
      </div>

      <div className="deals-wrapper">
        {topDealsData.map((deal, index) => (
          <div key={index} className="deal-card">
            <Link><img src={deal.image} alt={deal.title} className="deal-image" /></Link>
            <div className="deal-content">
              <div className="discount-badge">
                UPTO {deal.discount} OFF
              </div>
              <h3>{deal.title}</h3>
              <p>{deal.tours}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopDeals;
