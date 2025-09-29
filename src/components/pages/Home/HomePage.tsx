// Home page component

import React from 'react';
import HeroSection from './HeroSection';
import FeatureCards from './FeatureCards';
import FeaturedItems from './FeaturedItems';

const HomePage: React.FC = () => {
  return (
    <div className="w-full max-w-none">
      <HeroSection />
      <FeatureCards />
      <FeaturedItems />
    </div>
  );
};

export default HomePage;
