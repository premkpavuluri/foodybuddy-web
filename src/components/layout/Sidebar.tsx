'use client';

// Navigation sidebar component

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { NAVIGATION_ITEMS, ACCOUNT_ITEMS } from '@/constants';
import Icon from '@/components/ui/Icon';
import { useSidebar } from '@/contexts/SidebarContext';

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { isOpen } = useSidebar();

  const isActive = (path: string) => pathname === path;

  const handleNavClick = (href: string) => {
    // Simply navigate without any sidebar logic
    router.push(href);
  };

  return (
    <div className={`${isOpen ? 'w-64' : 'w-16'} bg-white min-h-screen flex flex-col shadow-sm transition-all duration-500 ease-in-out ${className}`}>
      {/* Logo */}
      <div className={`${isOpen ? 'p-6' : 'p-3'} transition-all duration-500 ease-in-out`}>
        <div className="flex items-center justify-center">
          <div className="w-9 h-9 bg-orange-500 rounded-full flex items-center justify-center">
            <Icon name="logo" size={20} color="white" />
          </div>
          {isOpen && (
            <h1 className="ml-3 text-xl font-bold text-gray-800 transition-opacity duration-300 ease-in-out">Foody Buddy</h1>
          )}
        </div>
      </div>

      {/* Main Navigation */}
      <div className={`flex-1 ${isOpen ? 'p-4' : 'p-2'} transition-all duration-500 ease-in-out`}>
        <div className="mb-8">
          {isOpen && (
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Main
            </h3>
          )}
          <nav className="space-y-2">
            {NAVIGATION_ITEMS.map((item) => (
              <div
                key={item.id}
                onClick={() => handleNavClick(item.path)}
                className={`flex items-center ${isOpen ? 'space-x-3 px-3 py-2' : 'justify-center p-2'} rounded-lg transition-colors text-gray-700 hover:bg-orange-100 hover:text-orange-600 cursor-pointer`}
                title={!isOpen ? item.label : undefined}
              >
                <Icon name={item.icon} size={22} color="#f97316" />
                {isOpen && (
                  <span className="font-medium transition-opacity duration-300 ease-in-out">{item.label}</span>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Account Navigation */}
        <div>
          {isOpen && (
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Account
            </h3>
          )}
          <nav className="space-y-2">
            {ACCOUNT_ITEMS.map((item) => {
              const iconSize = item.id === 'settings' ? (isOpen ? 30 : 22) : 22;
              return (
                <div
                  key={item.id}
                  onClick={() => handleNavClick(item.path)}
                  className={`flex items-center ${isOpen ? 'space-x-3 px-3 py-2' : 'justify-center p-2'} rounded-lg transition-colors text-gray-700 hover:bg-orange-100 hover:text-orange-600 cursor-pointer`}
                  title={!isOpen ? item.label : undefined}
                >
                  <div className={`flex items-center justify-center ${isOpen ? 'w-6 h-6' : 'w-8 h-8'}`}>
                    <Icon name={item.icon} size={iconSize} color="#f97316" />
                  </div>
                  {isOpen && (
                    <span className="font-medium transition-opacity duration-300 ease-in-out">{item.label}</span>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
