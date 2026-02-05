/**
 * useSearch Hook
 * Provides search/filter functionality for components
 */

import { useState, useMemo } from 'react';

export const useSearch = (items, searchFields = []) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;

    const query = searchQuery.toLowerCase();

    return items.filter(item => {
      // If no search fields specified, search all string values
      if (searchFields.length === 0) {
        return Object.values(item).some(
          value =>
            typeof value === 'string' && value.toLowerCase().includes(query)
        );
      }

      // Search in specified fields
      return searchFields.some(field => {
        const value = item[field];
        return (
          typeof value === 'string' && value.toLowerCase().includes(query)
        );
      });
    });
  }, [items, searchQuery, searchFields]);

  return {
    searchQuery,
    setSearchQuery,
    filteredItems,
    hasResults: filteredItems.length > 0,
  };
};

export default useSearch;
