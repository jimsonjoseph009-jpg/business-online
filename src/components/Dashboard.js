import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../config/firebase';
import { getAuth, getIdToken } from 'firebase/auth';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    customers: 0,
    products: 0,
    orders: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const token = await getIdToken(user);
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const [customersRes, productsRes, ordersRes] = await Promise.all([
        fetch('/api/customers', { headers }),
        fetch('/api/products', { headers }),
        fetch('/api/orders', { headers })
      ]);

      const customers = await customersRes.json();
      const products = await productsRes.json();
      const orders = await ordersRes.json();

      const revenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);

      setStats({
        customers: customers.length,
        products: products.length,
        orders: orders.length,
        revenue
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Total Customers', value: stats.customers, icon: '👥', color: '#667eea' },
    { title: 'Products', value: stats.products, icon: '📦', color: '#f56565' },
    { title: 'Orders', value: stats.orders, icon: '🛒', color: '#48bb78' },
    { title: 'Revenue', value: `$${stats.revenue.toLocaleString()}`, icon: '💰', color: '#ed8936' }
  ];

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Dashboard</h1>
      <p className="dashboard-subtitle">Welcome to your business management center</p>
      
      <div className="stats-grid">
        {statCards.map((stat, index) => (
          <div key={index} className="stat-card" style={{ borderTop: `4px solid ${stat.color}` }}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <h3 className="stat-title">{stat.title}</h3>
              <p className="stat-value">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <Link to="/customers" className="action-button">
            <span className="action-icon">👥</span>
            <span>Manage Customers</span>
          </Link>
          <Link to="/products" className="action-button">
            <span className="action-icon">📦</span>
            <span>Manage Products</span>
          </Link>
          <Link to="/orders" className="action-button">
            <span className="action-icon">🛒</span>
            <span>View Orders</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
