'use client';

// Menu page component

import React, { useState } from 'react';
import MenuHeader from './MenuHeader';
import SearchBar from './SearchBar';
import CategoryFilters from './CategoryFilters';
import MenuGrid from './MenuGrid';
import { useMenu } from '@/hooks/useMenu';

const MenuPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const { menuItems, loading, error, fetchMenuItems, searchMenuItems } = useMenu(selectedCategory);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSearchQuery(''); // Clear search when changing category
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      searchMenuItems(query);
    } else {
      fetchMenuItems(selectedCategory);
    }
  };

  return (
    <div className="w-full max-w-none">
      <MenuHeader />
      <SearchBar onSearch={handleSearch} />
      <CategoryFilters
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />
      <MenuGrid
        items={menuItems}
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default MenuPage;
