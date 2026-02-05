import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLocalization } from '../contexts/LocalizationContext';
import { formatCurrency } from '../utils/currencyManager';
import Pagination from './Pagination';
import SearchFilterBar from './SearchFilterBar';
import { getPaginatedItems } from '../utils/paginationUtils';
import { searchItems } from '../utils/searchUtils';
import { discountAPI } from '../utils/apiClient';
import './Discounts.css';

const Discounts = () => {
  const { t, currency } = useLocalization();
  const [discounts, setDiscounts] = useState(mockDiscountData);
  const [filteredDiscounts, setFilteredDiscounts] = useState(mockDiscountData);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize] = useState(10);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    try {
      setLoading(true);
      try {
        const data = await discountAPI.getAll();
        setDiscounts(data);
        setFilteredDiscounts(data);
      } catch (apiError) {
        console.log('Using mock data - API not available');
        setDiscounts(mockDiscountData);
        setFilteredDiscounts(mockDiscountData);
      }
    } catch (error) {
      console.error('Error fetching discounts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let results = [...discounts];
    if (searchTerm) {
      results = searchItems(results, searchTerm, ['code', 'description']);
    }
    setFilteredDiscounts(results);
    setCurrentPage(1);
  }, [searchTerm, discounts]);

  const { items: paginatedDiscounts, totalPages } = getPaginatedItems(
    filteredDiscounts,
    currentPage,
    pageSize
  );

  const handleDeleteDiscount = async (id) => {
    try {
      try {
        await discountAPI.delete(id);
      } catch (apiError) {
        console.log('API not available, deleting locally');
      }
      setDiscounts(discounts.filter(d => d.id !== id));
    } catch (error) {
      console.error('Error deleting discount:', error);
    }
  };

  return (
    <div className="discounts">
      <div className="page-header">
        <h1>🏷️ {t('discounts', 'title')}</h1>
        <p>{t('discounts', 'description')}</p>
      </div>

      <div className="toolbar">
        <SearchFilterBar onSearch={setSearchTerm} />
        <button className="btn-primary" onClick={() => setShowModal(true)}>+ {t('discounts', 'addDiscount')}</button>
      </div>

      <div className="discount-stats">
        <div className="stat-card">
          <span className="stat-label">{t('discounts', 'active')}</span>
          <span className="stat-value">{discounts.filter(d => d.active).length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">{t('discounts', 'usedCount')}</span>
          <span className="stat-value">{discounts.reduce((sum, d) => sum + d.usageCount, 0)}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">{t('discounts', 'totalRevenue') || 'Revenue Impact'}</span>
          <span className="stat-value">{formatCurrency((discounts.reduce((sum, d) => sum + d.totalSavings, 0) / 100), currency)}</span>
        </div>
      </div>

      {paginatedDiscounts.length > 0 ? (
        <>
          <div className="discounts-grid">
            {paginatedDiscounts.map(discount => (
              <div key={discount.id} className="discount-card">
                <div className="discount-code">{discount.code}</div>
                <div className="discount-info">
                  <p>{discount.description}</p>
                  <div className="discount-details">
                    <span>{t('discounts', 'discountType')}: {discount.type === 'percentage' ? `${discount.value}%` : formatCurrency(discount.value, currency)}</span>
                    <span>{t('discounts', 'usedCount')}: {discount.usageCount}/{discount.maxUses || '∞'}</span>
                  </div>
                </div>
                <div className="discount-footer">
                  <span className={`status ${discount.active ? 'active' : 'inactive'}`}>
                    {discount.active ? `✓ ${t('discounts', 'active')}` : `✗ ${t('discounts', 'inactive')}`}
                  </span>
                  <button className="btn-delete" onClick={() => handleDeleteDiscount(discount.id)}>{t('common', 'delete')}</button>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredDiscounts.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      ) : (
        <div className="empty-state">
          <h3>{t('discounts', 'noResults')}</h3>
          <button className="btn-primary" onClick={() => setShowModal(true)}>{t('discounts', 'addDiscount')}</button>
        </div>
      )}
    </div>
  );
};

const mockDiscountData = [
  { id: '1', code: 'SAVE20', description: '20% off all items', type: 'percentage', value: 20, usageCount: 45, maxUses: 100, totalSavings: 5000, active: true, expiryDate: '2026-02-28' },
  { id: '2', code: 'SUMMER50', description: '$50 off orders over $200', type: 'fixed', value: 50, usageCount: 12, maxUses: 50, totalSavings: 600, active: true, expiryDate: '2026-03-31' },
  { id: '3', code: 'WELCOME10', description: '10% off first purchase', type: 'percentage', value: 10, usageCount: 89, maxUses: null, totalSavings: 8900, active: true, expiryDate: null },
];

export default Discounts;
