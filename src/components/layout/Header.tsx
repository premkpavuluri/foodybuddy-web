'use client';

// Header component

import React from 'react';
import Icon from '@/components/ui/Icon';
import { useSidebar } from '@/contexts/SidebarContext';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const { toggleSidebar } = useSidebar();

  return (
    <header className={`bg-gray-50/70 px-6 py-4 border-b border-gray-200/80 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle sidebar"
          >
            <Icon name="sidebar" size={20} color="#f97316" />
          </button>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">Welcome to Foody Buddy</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
