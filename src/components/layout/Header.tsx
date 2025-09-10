// Header component

import React from 'react';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  return (
    <header className={`bg-white border-b border-gray-200 px-6 py-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Mobile menu button could go here */}
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">Welcome to Foody Buddy</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
