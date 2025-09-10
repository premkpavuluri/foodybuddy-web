// Category filters component for the menu page

import React from 'react';
import Button from '@/components/ui/Button';
import { MENU_CATEGORIES } from '@/constants';

interface CategoryFiltersProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilters: React.FC<CategoryFiltersProps> = ({
  selectedCategory,
  onCategoryChange
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {MENU_CATEGORIES.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? 'primary' : 'outline'}
          size="sm"
          onClick={() => onCategoryChange(category)}
          className="mb-2"
        >
          {category}
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilters;
