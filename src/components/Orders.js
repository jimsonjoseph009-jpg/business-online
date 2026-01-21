import React, { useState, useEffect } from 'react';
import { auth } from '../config/firebase';
import { getIdToken } from 'firebase/auth';
import SearchFilterBar from './SearchFilterBar';
import Pagination from './Pagination';
import { sortItems } from '../utils/searchUtils';
import { getPaginatedItems } from '../utils/paginationUtils';
import { exportToCSV, prepareDataForExport } from '../utils/exportUtils';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [formData, setFormData] = useState({
    customerId: '',
    items: [{ productId: '', quantity: 1, price: 0 }],
    status: 'pending'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyAllFilters();
  }, [searchTerm, filters, sortField, sortDirection, allOrders, currentPage]);

  const fetchData = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const token = await getIdToken(user);
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const [ordersRes, customersRes, productsRes] = await Promise.all([
        fetch('/api/orders', { headers }),
        fetch('/api/customers', { headers }),
        fetch('/api/products', { headers })
      ]);

      const ordersData = await ordersRes.json();
      const customersData = await customersRes.json();
      const productsData = await productsRes.json();

      setAllOrders(ordersData);
      setCustomers(customersData);
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyAllFilters = () => {
    let filtered = allOrders;

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(order => {
        const customer = customers.find(c => c.id === order.customerId);
        return (
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (customer && customer.name.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      });
    }

    // Apply sort
    if (sortField) {
      filtered = sortItems(filtered, sortField, sortDirection);
    }

    // Apply pagination
    const paginated = getPaginatedItems(filtered, currentPage, pageSize);
    setOrders(paginated.items);
    
    // Store pagination info
    window.paginationInfo = {
      totalItems: paginated.totalItems,
      totalPages: paginated.totalPages,
      currentPage: paginated.currentPage,
      pageSize: paginated.pageSize,
      hasNextPage: paginated.hasNextPage,
      hasPrevPage: paginated.hasPrevPage,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      if (!user) return;

      const token = await getIdToken(user);
      
      const items = formData.items.filter(item => item.productId);
      const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      const orderData = {
        customerId: formData.customerId,
        items,
        total,
        status: formData.status
      };

      const url = editingOrder ? `/api/orders/${editingOrder.id}` : '/api/orders';
      const method = editingOrder ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        setShowModal(false);
        setEditingOrder(null);
        setFormData({
          customerId: '',
          items: [{ productId: '', quantity: 1, price: 0 }],
          status: 'pending'
        });
        fetchData();
      } else {
        alert('Failed to save order. Please try again.');
      }
    } catch (error) {
      console.error('Error saving order:', error);
      alert('Failed to save order. Please try again.');
    }
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { productId: '', quantity: 1, price: 0 }]
    });
  };

  const updateItem = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    if (field === 'productId') {
      const product = products.find(p => p.id === value);
      if (product) {
        newItems[index].price = product.price;
      }
    }
    
    setFormData({ ...formData, items: newItems });
  };

  const removeItem = (index) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index)
    });
  };

  const handleEdit = (order) => {
    setFormData({
      customerId: order.customerId,
      items: order.items || [{ productId: '', quantity: 1, price: 0 }],
      status: order.status
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;

    try {
      const user = auth.currentUser;
      if (!user) return;

      const token = await getIdToken(user);
      const response = await fetch(`/api/orders/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        fetchData();
        setCurrentPage(1);
      } else {
        alert('Failed to delete order.');
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('Failed to delete order.');
    }
  };

  const handleExport = () => {
    try {
      const exportData = allOrders.map(order => ({
        id: order.id,
        customer: getCustomerName(order.customerId),
        total: `$${order.total?.toFixed(2) || '0.00'}`,
        status: order.status,
        date: order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'
      }));
      exportToCSV(exportData, ['id', 'customer', 'total', 'status', 'date'], 'orders.csv');
    } catch (error) {
      console.error('Error exporting orders:', error);
      alert('Failed to export orders');
    }
  };

  const getCustomerName = (customerId) => {
    const customer = customers.find(c => c.id === customerId);
    return customer ? customer.name : 'Unknown';
  };

  const getStatusBadge = (status) => {
    const statuses = {
      pending: { color: '#ed8936', bg: '#feebc8' },
      completed: { color: '#48bb78', bg: '#c6f6d5' },
      cancelled: { color: '#f56565', bg: '#fed7d7' }
    };
    const s = statuses[status] || statuses.pending;
    return <span className="status-badge" style={{ background: s.bg, color: s.color }}>{status}</span>;
  };

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  const paginationInfo = window.paginationInfo || { 
    totalItems: allOrders.length, 
    totalPages: 1, 
    currentPage: 1, 
    pageSize: 10 
  };

  return (
    <div className="orders">
      <div className="page-header">
        <h1>Orders</h1>
        <button 
          className="add-button"
          onClick={() => {
            setEditingOrder(null);
            setFormData({
              customerId: '',
              items: [{ productId: '', quantity: 1, price: 0 }],
              status: 'pending'
            });
            setShowModal(true);
          }}
        >
          + Create Order
        </button>
      </div>

      <SearchFilterBar
        onSearch={setSearchTerm}
        onFilter={setFilters}
        onSort={(field, direction) => {
          setSortField(field);
          setSortDirection(direction);
          setCurrentPage(1);
        }}
        showDateRange={true}
        showStatus={true}
        statuses={['pending', 'completed', 'cancelled']}
        onExport={handleExport}
      />

      {orders.length === 0 ? (
        <div className="empty-state">
          <p>No orders found. {allOrders.length === 0 ? 'Create your first order to get started!' : 'Try adjusting your filters.'}</p>
        </div>
      ) : (
        <>
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div>
                    <h3>Order #{order.id.slice(0, 8)}</h3>
                    <p className="order-customer">Customer: {getCustomerName(order.customerId)}</p>
                  </div>
                  <div className="order-meta">
                    {getStatusBadge(order.status)}
                    <p className="order-total">${order.total?.toFixed(2) || '0.00'}</p>
                  </div>
                </div>
                <div className="order-items">
                  {order.items?.map((item, idx) => {
                    const product = products.find(p => p.id === item.productId);
                    return (
                      <div key={idx} className="order-item">
                        <span>{product?.name || 'Unknown Product'}</span>
                        <span>Qty: {item.quantity}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="card-actions">
                  <button onClick={() => handleEdit(order)} className="edit-button">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(order.id)} className="delete-button">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          {paginationInfo.totalPages > 1 && (
            <Pagination
              currentPage={paginationInfo.currentPage}
              totalPages={paginationInfo.totalPages}
              totalItems={paginationInfo.totalItems}
              pageSize={paginationInfo.pageSize}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content large-modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editingOrder ? 'Edit Order' : 'Create Order'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Customer *</label>
                <select
                  value={formData.customerId}
                  onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                  required
                >
                  <option value="">Select a customer</option>
                  {customers.map(customer => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Items</label>
                {formData.items.map((item, index) => (
                  <div key={index} className="order-item-form">
                    <select
                      value={item.productId}
                      onChange={(e) => updateItem(index, 'productId', e.target.value)}
                    >
                      <option value="">Select a product</option>
                      {products.map(product => (
                        <option key={product.id} value={product.id}>
                          {product.name} - ${product.price?.toFixed(2)}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                      placeholder="Qty"
                    />
                    <input
                      type="number"
                      step="0.01"
                      value={item.price}
                      onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value))}
                      placeholder="Price"
                    />
                    {formData.items.length > 1 && (
                      <button type="button" onClick={() => removeItem(index)} className="remove-item-button">
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={addItem} className="add-item-button">
                  + Add Item
                </button>
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)} className="cancel-button">
                  Cancel
                </button>
                <button type="submit" className="save-button">
                  {editingOrder ? 'Update Order' : 'Create Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
