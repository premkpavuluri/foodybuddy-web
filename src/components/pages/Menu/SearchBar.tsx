'use client';

// Search bar component for the menu page

import React, { useState } from 'react';
import Input from '@/components/ui/Input';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  placeholder = "Search for dishes..." 
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Trigger search on every keystroke with debounce
    if (value.trim() === '') {
      onSearch('');
    } else {
      const timeoutId = setTimeout(() => {
        onSearch(value);
      }, 300);
      
      return () => clearTimeout(timeoutId);
    }
  };

  return (
    <form onSubmit={handleSearch} className="mb-6">
      <Input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={handleInputChange}
        icon={
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        }
        className="max-w-md"
      />
    </form>
  );
};

export default SearchBar;
