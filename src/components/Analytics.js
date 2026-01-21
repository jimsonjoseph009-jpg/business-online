import React, { useState, useEffect } from 'react';
import { auth } from '../config/firebase';
import { getIdToken } from 'firebase/auth';
import './Analytics.css';

const Analytics = () => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    topProducts: [],
    recentOrders: [],
    monthlyRevenue: []
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month'); // week, month, year

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const token = await getIdToken(user);
      
      const [customersRes, productsRes, ordersRes] = await Promise.all([
        fetch('/api/customers', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/products', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/orders', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const customers = await customersRes.json();
      const products = await productsRes.json();
      const orders = await ordersRes.json();

      // Calculate statistics
      const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
      const completedOrders = orders.filter(o => o.status === 'completed').length;
      const pendingOrders = orders.filter(o => o.status === 'pending').length;
      const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;

      // Top products
      const productCounts = {};
      orders.forEach(order => {
        order.items?.forEach(item => {
          productCounts[item.productId] = (productCounts[item.productId] || 0) + item.quantity;
        });
      });

      const topProducts = Object.entries(productCounts)
        .map(([productId, quantity]) => {
          const product = products.find(p => p.id === productId);
          return {
            productId,
            name: product?.name || 'Unknown',
            quantity,
            revenue: (product?.price || 0) * quantity
          };
        })
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);

      // Recent orders
      const recentOrders = [...orders]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10)
        .map(order => ({
          id: order.id,
          customerId: order.customerId,
          customerName: customers.find(c => c.id === order.customerId)?.name || 'Unknown',
          total: order.total,
          status: order.status,
          date: new Date(order.createdAt).toLocaleDateString()
        }));

      setStats({
        totalCustomers: customers.length,
        totalProducts: products.length,
        totalOrders: orders.length,
        totalRevenue,
        pendingOrders,
        completedOrders,
        cancelledOrders,
        topProducts,
        recentOrders,
        avgOrderValue: orders.length > 0 ? (totalRevenue / orders.length).toFixed(2) : 0
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading analytics...</div>;
  }

  return (
    <div className="analytics">
      <div className="analytics-header">
        <h1>📊 Analytics Dashboard</h1>
        <select 
          value={timeRange} 
          onChange={(e) => setTimeRange(e.target.value)}
          className="time-range-select"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">👥</div>
          <div className="metric-content">
            <h3>Total Customers</h3>
            <p className="metric-value">{stats.totalCustomers}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📦</div>
          <div className="metric-content">
            <h3>Total Products</h3>
            <p className="metric-value">{stats.totalProducts}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🛒</div>
          <div className="metric-content">
            <h3>Total Orders</h3>
            <p className="metric-value">{stats.totalOrders}</p>
          </div>
        </div>

        <div className="metric-card highlight">
          <div className="metric-icon">💰</div>
          <div className="metric-content">
            <h3>Total Revenue</h3>
            <p className="metric-value">${stats.totalRevenue.toFixed(2)}</p>
            <p className="metric-subtext">Avg: ${stats.avgOrderValue}</p>
          </div>
        </div>
      </div>

      {/* Order Status */}
      <div className="analytics-section">
        <h2>Order Status Overview</h2>
        <div className="status-cards">
          <div className="status-card pending">
            <div className="status-icon">⏳</div>
            <h4>Pending</h4>
            <p>{stats.pendingOrders}</p>
          </div>
          <div className="status-card completed">
            <div className="status-icon">✅</div>
            <h4>Completed</h4>
            <p>{stats.completedOrders}</p>
          </div>
          <div className="status-card cancelled">
            <div className="status-icon">❌</div>
            <h4>Cancelled</h4>
            <p>{stats.cancelledOrders}</p>
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="analytics-section">
        <h2>Top 5 Products</h2>
        <div className="top-products-table">
          <table>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Units Sold</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {stats.topProducts.map((product, index) => (
                <tr key={index}>
                  <td>{product.name}</td>
                  <td className="text-center">{product.quantity}</td>
                  <td className="text-right">${product.revenue.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="analytics-section">
        <h2>Recent Orders</h2>
        <div className="recent-orders-table">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((order, index) => (
                <tr key={index}>
                  <td className="order-id">#{order.id.slice(0, 8)}</td>
                  <td>{order.customerName}</td>
                  <td className="text-right font-bold">${order.total.toFixed(2)}</td>
                  <td>
                    <span className={`status-badge ${order.status}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
