// Header component

import React from 'react';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  return (
    <header className={`bg-gray-50/70 px-6 py-4 border-b border-gray-200/80 ${className}`}>
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
