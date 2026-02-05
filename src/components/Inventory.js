import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLocalization } from '../contexts/LocalizationContext';
import { formatCurrency } from '../utils/currencyManager';
import Pagination from './Pagination';
import SearchFilterBar from './SearchFilterBar';
import { getPaginatedItems } from '../utils/paginationUtils';
import { searchItems } from '../utils/searchUtils';
import { inventoryAPI } from '../utils/apiClient';
import './Inventory.css';

const Inventory = () => {
  const { currentUser } = useAuth();
  const { t, currency } = useLocalization();
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('stock');
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      // Try to fetch from API, fallback to mock data
      try {
        const data = await inventoryAPI.getAll();
        setInventory(data);
        setFilteredInventory(data);
      } catch (apiError) {
        // API not available, use mock data
        console.log('Using mock data - API not available');
        setInventory(mockInventoryData);
        setFilteredInventory(mockInventoryData);
      }
    } catch (error) {
      console.error('Error fetching inventory:', error);
      setInventory(mockInventoryData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let results = [...inventory];

    if (searchTerm) {
      results = searchItems(results, searchTerm, ['name', 'sku', 'category']);
    }

    results.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredInventory(results);
    setCurrentPage(1);
  }, [searchTerm, sortField, sortDirection, inventory]);

  const { items: paginatedInventory, totalPages } = getPaginatedItems(
    filteredInventory,
    currentPage,
    pageSize
  );

  const getStockStatus = (stock, reorderLevel) => {
    if (stock <= 0) return 'out-of-stock';
    if (stock <= reorderLevel) return 'low-stock';
    return 'in-stock';
  };

  const handleUpdateStock = async (productId, newStock) => {
    try {
      // Try API call first
      try {
        await inventoryAPI.updateStock(productId, newStock);
      } catch (apiError) {
        console.log('API not available, updating locally');
      }
      
      // Update local state
      const updated = inventory.map(item =>
        item.id === productId ? { ...item, stock: newStock, lastUpdated: new Date() } : item
      );
      setInventory(updated);
    } catch (error) {
      console.error('Error updating stock:', error);
    }
  };

  if (loading) {
    return <div className="inventory"><div className="loader">{t('common', 'loading')}</div></div>;
  }

  return (
    <div className="inventory">
      <div className="page-header">
        <h1>📋 {t('inventory', 'title')}</h1>
        <p>{t('inventory', 'description')}</p>
      </div>

      <SearchFilterBar
        onSearch={(term) => setSearchTerm(term)}
        onSort={(field, direction) => {
          setSortField(field);
          setSortDirection(direction);
        }}
        sortFields={[
          { value: 'stock', label: 'Stock Level' },
          { value: 'name', label: 'Product Name' },
          { value: 'reorderLevel', label: 'Reorder Level' }
        ]}
      />

      <div className="inventory-stats">
        <div className="stat-card">
          <span className="stat-label">{t('inventory', 'totalProducts') || 'Total Products'}</span>
          <span className="stat-value">{inventory.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">{t('inventory', 'inStock')}</span>
          <span className="stat-value">{inventory.filter(i => i.stock > 0).length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">{t('inventory', 'lowStockAlert')}</span>
          <span className="stat-value warning">{inventory.filter(i => i.stock <= i.reorderLevel && i.stock > 0).length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">{t('inventory', 'outOfStock')}</span>
          <span className="stat-value danger">{inventory.filter(i => i.stock <= 0).length}</span>
        </div>
      </div>

      {paginatedInventory.length > 0 ? (
        <>
          <div className="inventory-table-container">
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>{t('inventory', 'sku')}</th>
                  <th>{t('inventory', 'productName')}</th>
                  <th>{t('inventory', 'category')}</th>
                  <th>{t('inventory', 'stock')}</th>
                  <th>{t('inventory', 'reorderLevel')}</th>
                  <th>{t('inventory', 'status')}</th>
                  <th>{t('common', 'edit')}</th>
                  <th>{t('inventory', 'actions')}</th>
                </tr>
              </thead>
              <tbody>
                {paginatedInventory.map(item => {
                  const status = getStockStatus(item.stock, item.reorderLevel);
                  return (
                    <tr key={item.id} className={`status-${status}`}>
                      <td className="sku">{item.sku}</td>
                      <td>{item.name}</td>
                      <td>{item.category}</td>
                      <td className="stock-level">{item.stock}</td>
                      <td>{item.reorderLevel}</td>
                      <td>
                        <span className={`status-badge ${status}`}>
                          {status === 'in-stock' && `✓ ${t('inventory', 'inStock')}`}
                          {status === 'low-stock' && `⚠ ${t('inventory', 'lowStockAlert')}`}
                          {status === 'out-of-stock' && `✗ ${t('inventory', 'outOfStock')}`}
                        </span>
                      </td>
                      <td className="date">{new Date(item.lastUpdated).toLocaleDateString()}</td>
                      <td>
                        <button className="btn-edit">{t('common', 'edit')}</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredInventory.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>{t('inventory', 'noResults')}</h3>
        </div>
      )}
    </div>
  );
};

const mockInventoryData = [
  { id: '1', sku: 'SKU-001', name: 'Laptop Pro', category: 'Electronics', stock: 15, reorderLevel: 10, lastUpdated: new Date() },
  { id: '2', sku: 'SKU-002', name: 'Wireless Mouse', category: 'Accessories', stock: 3, reorderLevel: 20, lastUpdated: new Date() },
  { id: '3', sku: 'SKU-003', name: 'USB Cable', category: 'Accessories', stock: 0, reorderLevel: 50, lastUpdated: new Date() },
  { id: '4', sku: 'SKU-004', name: 'Monitor 4K', category: 'Electronics', stock: 8, reorderLevel: 5, lastUpdated: new Date() },
];

export default Inventory;
