import React, { useState, useEffect } from 'react';
import { useLocalization } from '../contexts/LocalizationContext';
import { formatCurrency } from '../utils/currencyManager';
import { auth } from '../config/firebase';
import { getIdToken } from 'firebase/auth';
import './AdminPanel.css';

const AdminPanel = () => {
  const { t, currency } = useLocalization();
  const [activeTab, setActiveTab] = useState('orders');
  const [data, setData] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOptions, setFilterOptions] = useState({});
  const [sortConfig, setSortConfig] = useState({ field: 'createdAt', direction: 'desc' });
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [statusMessage, setStatusMessage] = useState('');

  const tabs = [
    { id: 'orders', label: '📦 Orders', icon: '📦' },
    { id: 'customers', label: '👥 Customers', icon: '👥' },
    { id: 'products', label: '🏷️ Products', icon: '🏷️' },
    { id: 'notifications', label: '🔔 Notifications', icon: '🔔' },
    { id: 'reviews', label: '⭐ Reviews', icon: '⭐' },
    { id: 'messages', label: '💬 Messages', icon: '💬' }
  ];

  // Fetch data based on active tab
  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) return;

      const token = await getIdToken(user);
      const response = await fetch(`/api/${activeTab}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        setData(result || []);
        setSelectedIds(new Set());
      }
    } catch (error) {
      console.error(`Error fetching ${activeTab}:`, error);
      setStatusMessage(`Failed to load ${activeTab}`);
    } finally {
      setLoading(false);
    }
  };

  // Toggle selection
  const toggleSelection = (id) => {
    const newSelection = new Set(selectedIds);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedIds(newSelection);
  };

  // Select all
  const toggleSelectAll = () => {
    if (selectedIds.size === data.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(data.map(item => item.id)));
    }
  };

  // Bulk delete
  const bulkDelete = async () => {
    if (selectedIds.size === 0) {
      setStatusMessage('No items selected');
      return;
    }

    if (!window.confirm(`Delete ${selectedIds.size} items? This cannot be undone.`)) {
      return;
    }

    try {
      setLoading(true);
      const user = auth.currentUser;
      const token = await getIdToken(user);

      const deletePromises = Array.from(selectedIds).map(id =>
        fetch(`/api/${activeTab}/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
      );

      const results = await Promise.all(deletePromises);
      const successful = results.filter(r => r.ok).length;

      setStatusMessage(`Deleted ${successful} items successfully`);
      setSelectedIds(new Set());
      await fetchData();
    } catch (error) {
      console.error('Error deleting items:', error);
      setStatusMessage('Failed to delete items');
    } finally {
      setLoading(false);
    }
  };

  // Single delete
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item? This cannot be undone.')) {
      return;
    }

    try {
      const user = auth.currentUser;
      const token = await getIdToken(user);

      const response = await fetch(`/api/${activeTab}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setStatusMessage('Item deleted successfully');
        await fetchData();
      } else {
        setStatusMessage('Failed to delete item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      setStatusMessage('Error deleting item');
    }
  };

  // Edit item
  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData(getFormDataForTab(item));
    setShowModal(true);
  };

  // Get form fields based on tab
  const getFormDataForTab = (item = {}) => {
    switch (activeTab) {
      case 'orders':
        return {
          customerId: item.customerId || '',
          status: item.status || 'pending',
          total: item.total || 0
        };
      case 'customers':
        return {
          name: item.name || '',
          email: item.email || '',
          phone: item.phone || '',
          address: item.address || ''
        };
      case 'products':
        return {
          name: item.name || '',
          description: item.description || '',
          price: item.price || 0,
          stock: item.stock || 0,
          category: item.category || ''
        };
      case 'notifications':
        return {
          title: item.title || '',
          message: item.message || '',
          type: item.type || 'info',
          read: item.read || false
        };
      case 'reviews':
        return {
          title: item.title || '',
          comment: item.comment || '',
          rating: item.rating || 5,
          verified: item.verified || false
        };
      case 'messages':
        return {
          subject: item.subject || '',
          message: item.message || '',
          status: item.status || 'open'
        };
      default:
        return {};
    }
  };

  // Get columns based on tab
  const getColumnsForTab = () => {
    switch (activeTab) {
      case 'orders':
        return ['id', 'customerId', 'total', 'status', 'createdAt'];
      case 'customers':
        return ['id', 'name', 'email', 'phone', 'address'];
      case 'products':
        return ['id', 'name', 'price', 'stock', 'category'];
      case 'notifications':
        return ['id', 'title', 'type', 'read', 'createdAt'];
      case 'reviews':
        return ['id', 'title', 'rating', 'verified', 'createdAt'];
      case 'messages':
        return ['id', 'subject', 'status', 'createdAt'];
      default:
        return [];
    }
  };

  // Format cell value
  const formatCellValue = (value, field) => {
    if (!value) return '-';
    if (field.includes('price')) return formatCurrency(value, currency);
    if (field === 'createdAt' && value) {
      return new Date(value).toLocaleDateString();
    }
    if (typeof value === 'boolean') return value ? '✓' : '✗';
    return String(value).substring(0, 50);
  };

  // Filter data
  const filteredData = data.filter(item => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm || Object.values(item).some(
      v => String(v).toLowerCase().includes(searchLower)
    );
    return matchesSearch;
  });

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    const aVal = a[sortConfig.field];
    const bVal = b[sortConfig.field];
    
    if (!aVal) return 1;
    if (!bVal) return -1;
    
    const comparison = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
    return sortConfig.direction === 'asc' ? comparison : -comparison;
  });

  const columns = getColumnsForTab();

  if (loading && data.length === 0) {
    return <div className="admin-panel loading">Loading...</div>;
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>🛠️ Admin Panel - Centralized Management</h1>
        <p>Manage all your business entities from one place</p>
      </div>

      {statusMessage && (
        <div className="status-message">
          {statusMessage}
          <button onClick={() => setStatusMessage('')}>✕</button>
        </div>
      )}

      {/* Tabs */}
      <div className="admin-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => {
              setActiveTab(tab.id);
              setSearchTerm('');
              setSelectedIds(new Set());
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="admin-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="action-buttons">
          {selectedIds.size > 0 && (
            <button
              className="btn btn-danger"
              onClick={bulkDelete}
            >
              🗑️ Delete {selectedIds.size} Items
            </button>
          )}
          <button className="btn btn-primary" onClick={fetchData}>
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="admin-stats">
        <div className="stat-item">
          <label>Total Items:</label>
          <span>{data.length}</span>
        </div>
        <div className="stat-item">
          <label>Filtered:</label>
          <span>{filteredData.length}</span>
        </div>
        <div className="stat-item">
          <label>Selected:</label>
          <span>{selectedIds.size}</span>
        </div>
      </div>

      {/* Table */}
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedIds.size === data.length && data.length > 0}
                  onChange={toggleSelectAll}
                  title="Select all items"
                />
              </th>
              {columns.map(col => (
                <th
                  key={col}
                  onClick={() => setSortConfig({
                    field: col,
                    direction: sortConfig.field === col && sortConfig.direction === 'asc' ? 'desc' : 'asc'
                  })}
                  className="sortable"
                  title={`Sort by ${col}`}
                >
                  {col}
                  {sortConfig.field === col && (
                    <span className="sort-indicator">
                      {sortConfig.direction === 'asc' ? ' ▲' : ' ▼'}
                    </span>
                  )}
                </th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 2} className="no-data">
                  No {activeTab} found
                </td>
              </tr>
            ) : (
              sortedData.map(item => (
                <tr key={item.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.has(item.id)}
                      onChange={() => toggleSelection(item.id)}
                    />
                  </td>
                  {columns.map(col => (
                    <td key={col}>
                      {formatCellValue(item[col], col)}
                    </td>
                  ))}
                  <td className="action-cell">
                    <button
                      className="action-btn edit-btn"
                      onClick={() => handleEdit(item)}
                      title="Edit"
                    >
                      ✎ Edit
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => handleDelete(item.id)}
                      title="Delete"
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for editing */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Edit {activeTab === 'customers' ? 'Customer' : activeTab.slice(0, -1)}</h3>
            <div className="modal-body">
              {Object.keys(getFormDataForTab()).map(key => (
                <div key={key} className="form-group">
                  <label>{key}</label>
                  {key === 'status' || key === 'type' ? (
                    <select
                      value={formData[key] || ''}
                      onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                    >
                      <option value="">Select {key}</option>
                      {activeTab === 'orders' && ['pending', 'completed', 'cancelled'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                      {activeTab === 'notifications' && ['info', 'warning', 'error', 'success'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                      {activeTab === 'messages' && ['open', 'resolved', 'closed'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  ) : typeof formData[key] === 'boolean' ? (
                    <input
                      type="checkbox"
                      checked={formData[key] || false}
                      onChange={(e) => setFormData({ ...formData, [key]: e.target.checked })}
                    />
                  ) : typeof formData[key] === 'number' ? (
                    <input
                      type="number"
                      value={formData[key] || 0}
                      onChange={(e) => setFormData({ ...formData, [key]: parseFloat(e.target.value) })}
                    />
                  ) : (
                    <input
                      type="text"
                      value={formData[key] || ''}
                      onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => setShowModal(false)}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
