import React from 'react';
import './Pagination.css';
import { getPageNumbers } from '../utils/paginationUtils';

const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const pageNumbers = getPageNumbers(currentPage, totalPages, 7);
  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="pagination-container">
      <div className="pagination-info">
        Showing {startIndex}-{endIndex} of {totalItems} items
      </div>

      <div className="pagination-controls">
        <button
          className="pagination-button"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          title="First Page"
        >
          ⟨⟨
        </button>

        <button
          className="pagination-button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          title="Previous Page"
        >
          ⟨
        </button>

        <div className="pagination-pages">
          {pageNumbers[0] > 1 && (
            <>
              <button
                className="pagination-button"
                onClick={() => onPageChange(1)}
              >
                1
              </button>
              {pageNumbers[0] > 2 && <span className="pagination-dots">...</span>}
            </>
          )}

          {pageNumbers.map(page => (
            <button
              key={page}
              className={`pagination-button ${page === currentPage ? 'active' : ''}`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          ))}

          {pageNumbers[pageNumbers.length - 1] < totalPages && (
            <>
              {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                <span className="pagination-dots">...</span>
              )}
              <button
                className="pagination-button"
                onClick={() => onPageChange(totalPages)}
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        <button
          className="pagination-button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          title="Next Page"
        >
          ⟩
        </button>

        <button
          className="pagination-button"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          title="Last Page"
        >
          ⟩⟩
        </button>
      </div>

      <div className="pagination-summary">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
};

export default Pagination;
