/**
 * Pagination Utilities
 * Provides functions for handling pagination
 */

/**
 * Get paginated items
 * @param {Array} items - All items
 * @param {Number} page - Current page (1-indexed)
 * @param {Number} pageSize - Items per page
 * @returns {Object} { items, totalPages, hasNextPage, hasPrevPage }
 */
export const getPaginatedItems = (items, page = 1, pageSize = 10) => {
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  return {
    items: items.slice(start, end),
    totalItems,
    totalPages,
    currentPage: page,
    pageSize,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
    startIndex: start + 1,
    endIndex: Math.min(end, totalItems),
  };
};

/**
 * Get page numbers for pagination controls
 * @param {Number} currentPage - Current page
 * @param {Number} totalPages - Total pages
 * @param {Number} windowSize - Number of page buttons to show
 * @returns {Array} Array of page numbers
 */
export const getPageNumbers = (currentPage, totalPages, windowSize = 5) => {
  const pages = [];
  let startPage = Math.max(1, currentPage - Math.floor(windowSize / 2));
  let endPage = Math.min(totalPages, startPage + windowSize - 1);

  if (endPage - startPage + 1 < windowSize) {
    startPage = Math.max(1, endPage - windowSize + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return pages;
};

/**
 * Calculate offset for API queries
 * @param {Number} page - Current page
 * @param {Number} pageSize - Items per page
 * @returns {Number} Offset
 */
export const getOffset = (page = 1, pageSize = 10) => {
  return (page - 1) * pageSize;
};

/**
 * Validate page number
 * @param {Number} page - Page number
 * @param {Number} totalPages - Total pages
 * @returns {Number} Valid page number
 */
export const validatePageNumber = (page, totalPages) => {
  const pageNum = parseInt(page);
  if (isNaN(pageNum) || pageNum < 1) return 1;
  if (pageNum > totalPages) return totalPages;
  return pageNum;
};
