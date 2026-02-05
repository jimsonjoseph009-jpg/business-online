import React, { useState } from 'react';
import { useLocalization } from '../contexts/LocalizationContext';
import { formatCurrency } from '../utils/currencyManager';
import './Forecasting.css';

const Forecasting = () => {
  const { t, currency } = useLocalization();
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Laptop Pro',
      currentStock: 15,
      safetyStock: 10,
      avgMonthlyDemand: 45,
      predictedDemand: 52,
      recommendedOrder: 37,
      leadTime: 14,
      reorderPoint: 48,
      status: 'low'
    },
    {
      id: 2,
      name: 'Wireless Mouse',
      currentStock: 120,
      safetyStock: 20,
      avgMonthlyDemand: 80,
      predictedDemand: 95,
      recommendedOrder: -25,
      leadTime: 7,
      reorderPoint: 35,
      status: 'normal'
    },
    {
      id: 3,
      name: 'USB-C Cable',
      currentStock: 45,
      safetyStock: 30,
      avgMonthlyDemand: 150,
      predictedDemand: 180,
      recommendedOrder: 165,
      leadTime: 21,
      reorderPoint: 60,
      status: 'critical'
    },
  ]);

  const [timeframe, setTimeframe] = useState('30');
  const [selectedLocation, setSelectedLocation] = useState('all');

  const locations = [
    { id: 'all', name: 'All Locations' },
    { id: 'dar', name: 'Dar es Salaam' },
    { id: 'dodoma', name: 'Dodoma' },
    { id: 'arusha', name: 'Arusha' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'critical': return '#d32f2f';
      case 'low': return '#f57c00';
      case 'normal': return '#388e3c';
      default: return '#1976d2';
    }
  };

  return (
    <div className="forecasting">
      <div className="page-header">
        <h1>🔮 {t('forecasting', 'title')}</h1>
        <p>{t('forecasting', 'description')}</p>
      </div>

      {/* Forecast Stats */}
      <div className="forecast-stats">
        <div className="stat-card">
          <h3>{Math.round(products.reduce((sum, p) => sum + p.avgMonthlyDemand, 0) / products.length)}</h3>
          <p>{t('forecasting', 'avgMonthlyDemand')}</p>
        </div>
        <div className="stat-card">
          <h3>{products.filter(p => p.status === 'critical').length}</h3>
          <p>{t('forecasting', 'criticalItems')}</p>
        </div>
        <div className="stat-card">
          <h3>{products.reduce((sum, p) => sum + (p.recommendedOrder > 0 ? p.recommendedOrder : 0), 0)}</h3>
          <p>{t('forecasting', 'totalToOrder')}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="forecast-controls">
        <div className="control-group">
          <label>{t('forecasting', 'timeframe')}:</label>
          <select value={timeframe} onChange={(e) => setTimeframe(e.target.value)}>
            <option value="7">7 {t('forecasting', 'days')}</option>
            <option value="30">30 {t('forecasting', 'days')}</option>
            <option value="90">90 {t('forecasting', 'days')}</option>
          </select>
        </div>
        <div className="control-group">
          <label>{t('forecasting', 'location')}:</label>
          <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>{loc.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Forecast Table */}
      <div className="forecast-table-container">
        <table className="forecast-table">
          <thead>
            <tr>
              <th>{t('inventory', 'productName')}</th>
              <th>{t('forecasting', 'currentStock')}</th>
              <th>{t('forecasting', 'safetyStock')}</th>
              <th>{t('forecasting', 'avgMonthlyDemand')}</th>
              <th>{t('forecasting', 'predictedDemand')}</th>
              <th>{t('forecasting', 'recommendedOrder')}</th>
              <th>{t('forecasting', 'reorderPoint')}</th>
              <th>{t('forecasting', 'leadTime')}</th>
              <th>{t('common', 'status')}</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td className="product-name">{product.name}</td>
                <td>{product.currentStock}</td>
                <td>{product.safetyStock}</td>
                <td>{product.avgMonthlyDemand}</td>
                <td className="highlight">{product.predictedDemand}</td>
                <td className={product.recommendedOrder > 0 ? 'action-needed' : ''}>
                  {product.recommendedOrder > 0 ? product.recommendedOrder : '-'}
                </td>
                <td>{product.reorderPoint}</td>
                <td>{product.leadTime} {t('forecasting', 'days')}</td>
                <td>
                  <span className="status-badge" style={{ backgroundColor: getStatusColor(product.status) }}>
                    {product.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Recommendations */}
      <div className="recommendations">
        <h3>📋 {t('forecasting', 'recommendations')}</h3>
        <div className="recommendations-list">
          {products.filter(p => p.recommendedOrder > 0).map((product) => (
            <div key={product.id} className="recommendation-item">
              <div className="recommendation-content">
                <h4>{product.name}</h4>
                <p>
                  {t('forecasting', 'orderQuantity')}: <strong>{product.recommendedOrder} {t('common', 'units')}</strong>
                </p>
                <p className="recommendation-reason">
                  {t('forecasting', 'leadTime')}: {product.leadTime} days | {t('forecasting', 'predictedDemand')}: {product.predictedDemand}
                </p>
              </div>
              <button className="btn-small">{t('forecasting', 'createPurchaseOrder')}</button>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insights */}
      <div className="ai-insights">
        <h3>🤖 {t('forecasting', 'aiInsights')}</h3>
        <div className="insight-boxes">
          <div className="insight-box warning">
            <h4>⚠️ {t('forecasting', 'highDemandAlert')}</h4>
            <p>USB-C Cable shows a 20% increase in predicted demand. Consider increasing safety stock.</p>
          </div>
          <div className="insight-box info">
            <h4>ℹ️ {t('forecasting', 'inventoryOptimization')}</h4>
            <p>Wireless Mouse is well-stocked. Consider reducing reorder frequency to save on storage costs.</p>
          </div>
          <div className="insight-box success">
            <h4>✓ {t('forecasting', 'recommendedAction')}</h4>
            <p>Create purchase orders for 3 products to maintain optimal inventory levels.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forecasting;
