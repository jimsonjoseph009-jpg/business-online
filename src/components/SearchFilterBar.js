import React, { useState } from 'react';
import './SearchFilterBar.css';

const SearchFilterBar = ({
  onSearch,
  onFilter,
  onSort,
  showDateRange = false,
  showPriceRange = false,
  showStatus = false,
  statuses = [],
  categories = [],
  onExport,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    onSearch(term);
  };

  const handleFilterChange = () => {
    const filters = {
      status: status || undefined,
      category: category || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
    };
    onFilter(filters);
  };

  const handleSortChange = (field) => {
    const newDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);
    onSort(field, newDirection);
  };

  const handleReset = () => {
    setSearchTerm('');
    setStatus('');
    setCategory('');
    setStartDate('');
    setEndDate('');
    setMinPrice('');
    setMaxPrice('');
    setSortField('name');
    setSortDirection('asc');
    
    onSearch('');
    onFilter({});
    onSort('name', 'asc');
  };

  return (
    <div className="search-filter-bar">
      <div className="search-section">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
      </div>

      <div className="filter-section">
        {showStatus && statuses.length > 0 && (
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              handleFilterChange();
            }}
            className="filter-select"
          >
            <option value="">All Statuses</option>
            {statuses.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        )}

        {categories.length > 0 && (
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              handleFilterChange();
            }}
            className="filter-select"
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        )}

        {showDateRange && (
          <div className="date-range-inputs">
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                handleFilterChange();
              }}
              className="filter-input"
              placeholder="Start Date"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                handleFilterChange();
              }}
              className="filter-input"
              placeholder="End Date"
            />
          </div>
        )}

        {showPriceRange && (
          <div className="price-range-inputs">
            <input
              type="number"
              value={minPrice}
              onChange={(e) => {
                setMinPrice(e.target.value);
                handleFilterChange();
              }}
              className="filter-input"
              placeholder="Min Price"
              min="0"
            />
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(e.target.value);
                handleFilterChange();
              }}
              className="filter-input"
              placeholder="Max Price"
              min="0"
            />
          </div>
        )}
      </div>

      <div className="sort-section">
        <select
          value={sortField}
          onChange={(e) => handleSortChange(e.target.value)}
          className="sort-select"
        >
          <option value="name">Sort by Name</option>
          <option value="date">Sort by Date</option>
          <option value="price">Sort by Price</option>
          <option value="status">Sort by Status</option>
        </select>
        <button
          onClick={() => {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
            onSort(sortField, sortDirection === 'asc' ? 'desc' : 'asc');
          }}
          className="sort-button"
          title={`Current: ${sortDirection}`}
        >
          {sortDirection === 'asc' ? '↑' : '↓'}
        </button>
      </div>

      <div className="action-buttons">
        {onExport && (
          <button onClick={onExport} className="export-button">
            📥 Export
          </button>
        )}
        <button onClick={handleReset} className="reset-button">
          ↻ Reset
        </button>
      </div>
    </div>
  );
};

export default SearchFilterBar;
