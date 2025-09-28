// Hero section component for the home page

import React from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';

const HeroSection: React.FC = () => {
  return (
    <div className="relative rounded-2xl overflow-hidden mb-8">
      {/* Background image with subtle overlay */}
      <div 
        className="relative h-96 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/images/hero-kitchen.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center bottom',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'scroll'
        }}
      >
        {/* Subtle overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent"></div>
        
        {/* Content */}
        <div className="relative h-full flex items-center">
          <div className="px-8 py-12">
            <h1 className="text-5xl font-bold text-white mb-4">
              Delicious Food,
            </h1>
            <h2 className="text-5xl font-bold text-orange-400 mb-4">
              Delivered Fresh
            </h2>
            <p className="text-xl text-white mb-6 max-w-md">
              Experience the finest flavors from our kitchen to your doorstep
            </p>
            <Link href="/menu">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
                Order Now →
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
