import React, { useState, useEffect } from 'react';
import './DemoDataLoader.css';

const DemoDataLoader = () => {
  const [demoData, setDemoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [dataLoaded, setDataLoaded] = useState(false);

  const fetchDemoData = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch('/api/demo/all');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setDemoData(data.data);
          setMessage('✅ Demo data loaded successfully!');
          setDataLoaded(true);
        }
      } else {
        setMessage(`❌ Error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDemoData();
  }, []);

  if (!demoData) {
    return (
      <div className="demo-loader">
        <div className="demo-card">
          <h2>📊 Demo Data</h2>
          <p>Loading demo data...</p>
          <button onClick={fetchDemoData} disabled={loading}>
            {loading ? 'Loading...' : 'Load Demo Data'}
          </button>
          {message && <p className="message">{message}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="demo-loader">
      <div className="demo-card">
        <h2>✨ Sample Data Preview</h2>
        <div className="demo-stats">
          <div className="stat">
            <span className="number">{demoData.products?.length || 0}</span>
            <span className="label">Products</span>
          </div>
          <div className="stat">
            <span className="number">{demoData.customers?.length || 0}</span>
            <span className="label">Customers</span>
          </div>
          <div className="stat">
            <span className="number">{demoData.orders?.length || 0}</span>
            <span className="label">Orders</span>
          </div>
        </div>

        <div className="demo-section">
          <h3>📦 Sample Products ({demoData.products?.length})</h3>
          <div className="items-grid">
            {demoData.products?.slice(0, 3).map(product => (
              <div key={product.id} className="item-card">
                <img src={product.image} alt={product.name} />
                <h4>{product.name}</h4>
                <p className="price">${product.price.toFixed(2)}</p>
                <p className="category">{product.category}</p>
                <p className="stock">Stock: {product.stock}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="demo-section">
          <h3>👥 Sample Customers ({demoData.customers?.length})</h3>
          <div className="customer-list">
            {demoData.customers?.slice(0, 3).map(customer => (
              <div key={customer.id} className="customer-item">
                <div className="customer-info">
                  <h4>{customer.name}</h4>
                  <p>{customer.email}</p>
                  <p className="location">{customer.city}, {customer.country}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="demo-section">
          <h3>📋 Sample Orders ({demoData.orders?.length})</h3>
          <div className="orders-list">
            {demoData.orders?.slice(0, 3).map(order => (
              <div key={order.id} className="order-item">
                <div className="order-header">
                  <span className="order-id">Order {order.id}</span>
                  <span className={`status ${order.status}`}>{order.status}</span>
                </div>
                <p className="order-total">Total: ${order.total.toFixed(2)}</p>
                <p className="order-items">{order.items.length} item(s)</p>
              </div>
            ))}
          </div>
        </div>

        <div className="demo-info">
          <p>✨ This is demo data for testing and development purposes.</p>
          <p>📲 You can use the Admin Panel to add, edit, and manage real data.</p>
        </div>
      </div>
    </div>
  );
};

export default DemoDataLoader;
