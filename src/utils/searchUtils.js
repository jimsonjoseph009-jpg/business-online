/**
 * Search and Filter Utilities
 * Provides functions for searching and filtering data
 */

/**
 * Search items by multiple fields
 * @param {Array} items - Items to search through
 * @param {String} searchTerm - Search term
 * @param {Array} searchFields - Fields to search in
 * @returns {Array} Filtered items
 */
export const searchItems = (items, searchTerm, searchFields) => {
  if (!searchTerm || searchTerm.trim() === '') {
    return items;
  }

  const term = searchTerm.toLowerCase().trim();
  return items.filter(item => {
    return searchFields.some(field => {
      const value = getNestedValue(item, field);
      return value && value.toString().toLowerCase().includes(term);
    });
  });
};

/**
 * Filter items by status
 * @param {Array} items - Items to filter
 * @param {String} status - Status to filter by
 * @param {String} statusField - Field name for status
 * @returns {Array} Filtered items
 */
export const filterByStatus = (items, status, statusField = 'status') => {
  if (!status) return items;
  return items.filter(item => item[statusField] === status);
};

/**
 * Filter items by date range
 * @param {Array} items - Items to filter
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {String} dateField - Field name for date
 * @returns {Array} Filtered items
 */
export const filterByDateRange = (items, startDate, endDate, dateField = 'createdAt') => {
  if (!startDate || !endDate) return items;

  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();

  return items.filter(item => {
    const itemDate = new Date(item[dateField]).getTime();
    return itemDate >= start && itemDate <= end;
  });
};

/**
 * Filter items by price range
 * @param {Array} items - Items to filter
 * @param {Number} minPrice - Minimum price
 * @param {Number} maxPrice - Maximum price
 * @param {String} priceField - Field name for price
 * @returns {Array} Filtered items
 */
export const filterByPriceRange = (items, minPrice, maxPrice, priceField = 'price') => {
  if (minPrice === undefined || maxPrice === undefined) return items;

  return items.filter(item => {
    const price = parseFloat(item[priceField]);
    return price >= minPrice && price <= maxPrice;
  });
};

/**
 * Sort items by field
 * @param {Array} items - Items to sort
 * @param {String} field - Field to sort by
 * @param {String} direction - 'asc' or 'desc'
 * @returns {Array} Sorted items
 */
export const sortItems = (items, field, direction = 'asc') => {
  const sorted = [...items].sort((a, b) => {
    const aVal = getNestedValue(a, field);
    const bVal = getNestedValue(b, field);

    if (aVal === undefined || aVal === null) return 1;
    if (bVal === undefined || bVal === null) return -1;

    if (typeof aVal === 'string') {
      return direction === 'asc' 
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }

    return direction === 'asc' 
      ? aVal - bVal
      : bVal - aVal;
  });

  return sorted;
};

/**
 * Get nested value from object
 * @param {Object} obj - Object
 * @param {String} path - Path to value (e.g., 'user.name')
 * @returns {Any} Value
 */
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, prop) => current?.[prop], obj);
};

/**
 * Apply multiple filters and search
 * @param {Array} items - Items to filter
 * @param {Object} filters - Filter object
 * @returns {Array} Filtered items
 */
export const applyFilters = (items, filters) => {
  let result = items;

  if (filters.search && filters.searchFields) {
    result = searchItems(result, filters.search, filters.searchFields);
  }

  if (filters.status && filters.statusField) {
    result = filterByStatus(result, filters.status, filters.statusField);
  }

  if (filters.startDate && filters.endDate && filters.dateField) {
    result = filterByDateRange(result, filters.startDate, filters.endDate, filters.dateField);
  }

  if (filters.minPrice !== undefined && filters.maxPrice !== undefined && filters.priceField) {
    result = filterByPriceRange(result, filters.minPrice, filters.maxPrice, filters.priceField);
  }

  if (filters.sortField) {
    result = sortItems(result, filters.sortField, filters.sortDirection || 'asc');
  }

  return result;
};

/**
 * Deduplicate items by field
 * @param {Array} items - Items to deduplicate
 * @param {String} field - Field to deduplicate by
 * @returns {Array} Deduplicated items
 */
export const deduplicateItems = (items, field) => {
  const seen = new Set();
  return items.filter(item => {
    const value = item[field];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
};

/**
 * Group items by field
 * @param {Array} items - Items to group
 * @param {String} field - Field to group by
 * @returns {Object} Grouped items
 */
export const groupItems = (items, field) => {
  return items.reduce((groups, item) => {
    const key = item[field];
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {});
};
