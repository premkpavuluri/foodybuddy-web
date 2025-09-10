'use client';

// Navigation sidebar component

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAVIGATION_ITEMS, ACCOUNT_ITEMS } from '@/constants';

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <div className={`w-64 bg-gray-50 min-h-screen flex flex-col ${className}`}>
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">🍔</span>
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
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
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
            {ACCOUNT_ITEMS.map((item) => (
              <Link
                key={item.id}
                href={item.path}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
