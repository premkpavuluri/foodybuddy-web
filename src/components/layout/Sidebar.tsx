'use client';

// Navigation sidebar component

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAVIGATION_ITEMS, ACCOUNT_ITEMS } from '@/constants';
import Icon from '@/components/ui/Icon';

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <div className={`w-64 bg-orange-50 min-h-screen flex flex-col ${className}`}>
      {/* Logo */}
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-orange-500 rounded-full flex items-center justify-center">
            <Icon name="logo" size={20} color="white" />
          </div>
          <h1 className="text-xl font-bold text-gray-800">Foody Buddy</h1>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 p-4">
        <div className="mb-8">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Main
          </h3>
          <nav className="space-y-2">
            {NAVIGATION_ITEMS.map((item) => (
              <Link
                key={item.id}
                href={item.path}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:bg-orange-100 hover:text-orange-600`}
              >
                <Icon name={item.icon} size={22} color="#f97316" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Account Navigation */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Account
          </h3>
          <nav className="space-y-2">
            {ACCOUNT_ITEMS.map((item) => {
              const iconSize = item.id === 'settings' ? 30 : 22;
              return (
                <Link
                  key={item.id}
                  href={item.path}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:bg-orange-100 hover:text-orange-600`}
                >
                  <div className="flex items-center justify-center w-6 h-6">
                    <Icon name={item.icon} size={iconSize} color="#f97316" />
                  </div>
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
