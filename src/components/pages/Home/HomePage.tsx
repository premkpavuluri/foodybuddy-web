// Home page component

import React from 'react';
import HeroSection from './HeroSection';
import FeatureCards from './FeatureCards';
import FeaturedItems from './FeaturedItems';

const HomePage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <HeroSection />
      <FeatureCards />
      <FeaturedItems />
    </div>
  );
};

export default HomePage;
