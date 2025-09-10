// Menu page header component

import React from 'react';

const MenuHeader: React.FC = () => {
  return (
    <div className="mb-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-2">Our Menu</h1>
      <p className="text-lg text-gray-600">
        Discover our delicious selection of freshly prepared meals.
      </p>
    </div>
  );
};

export default MenuHeader;
