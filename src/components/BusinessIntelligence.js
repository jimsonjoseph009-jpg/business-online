import React, { useState } from 'react';
import { useLocalization } from '../contexts/LocalizationContext';
import { formatCurrency } from '../utils/currencyManager';
import './BusinessIntelligence.css';

const BusinessIntelligence = () => {
  const { t, currency } = useLocalization();
  const [reports, setReports] = useState([
    {
      id: 1,
      name: 'Monthly Sales Report',
      type: 'Sales',
      frequency: 'Monthly',
      lastRun: '2024-01-26',
      nextRun: '2024-02-26',
      format: 'PDF, CSV',
      recipients: ['admin@business.com'],
      active: true
    },
    {
      id: 2,
      name: 'Customer Acquisition Analysis',
      type: 'Marketing',
      frequency: 'Weekly',
      lastRun: '2024-01-23',
      nextRun: '2024-01-30',
      format: 'Excel',
      recipients: ['manager@business.com'],
      active: true
    },
    {
      id: 3,
      name: 'Inventory Status Report',
      type: 'Inventory',
      frequency: 'Daily',
      lastRun: '2024-01-26',
      nextRun: '2024-01-27',
      format: 'PDF',
      recipients: ['stock@business.com'],
      active: false
    },
  ]);

  const [dashboards, setDashboards] = useState([
    {
      id: 1,
      name: 'Executive Dashboard',
      metrics: 8,
      lastUpdated: '2024-01-26 14:30',
      shared: true,
      viewers: 5
    },
    {
      id: 2,
      name: 'Sales Performance',
      metrics: 12,
      lastUpdated: '2024-01-26 13:15',
      shared: false,
      viewers: 1
    },
    {
      id: 3,
      name: 'Customer Analytics',
      metrics: 10,
      lastUpdated: '2024-01-26 12:00',
      shared: true,
      viewers: 3
    },
  ]);

  const [selectedTab, setSelectedTab] = useState('reports');
  const [showModal, setShowModal] = useState(false);

  const chartData = [
    { label: 'Jan', value: 45 },
    { label: 'Feb', value: 52 },
    { label: 'Mar', value: 48 },
    { label: 'Apr', value: 61 },
    { label: 'May', value: 55 },
    { label: 'Jun', value: 67 },
  ];

  return (
    <div className="business-intelligence">
      <div className="page-header">
        <h1>📊 {t('bi', 'title')}</h1>
        <p>{t('bi', 'description')}</p>
      </div>

      {/* KPI Summary */}
      <div className="bi-kpis">
        <div className="kpi-box">
          <h3>{t('bi', 'totalReports')}</h3>
          <p className="value">{reports.length}</p>
        </div>
        <div className="kpi-box">
          <h3>{t('bi', 'activeDashboards')}</h3>
          <p className="value">{dashboards.length}</p>
        </div>
        <div className="kpi-box">
          <h3>{t('bi', 'dataQuality')}</h3>
          <p className="value">98%</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bi-tabs">
        <button
          className={`tab-btn ${selectedTab === 'reports' ? 'active' : ''}`}
          onClick={() => setSelectedTab('reports')}
        >
          {t('bi', 'reports')}
        </button>
        <button
          className={`tab-btn ${selectedTab === 'dashboards' ? 'active' : ''}`}
          onClick={() => setSelectedTab('dashboards')}
        >
          {t('bi', 'dashboards')}
        </button>
        <button
          className={`tab-btn ${selectedTab === 'visualization' ? 'active' : ''}`}
          onClick={() => setSelectedTab('visualization')}
        >
          {t('bi', 'dataVisualization')}
        </button>
      </div>

      {/* Reports Tab */}
      {selectedTab === 'reports' && (
        <div className="bi-content">
          <div className="reports-header">
            <h2>{t('bi', 'scheduledReports')}</h2>
            <button className="btn-primary" onClick={() => setShowModal(true)}>
              + {t('bi', 'customReport')}
            </button>
          </div>

          <div className="reports-list">
            {reports.map((report) => (
              <div key={report.id} className={`report-card ${report.active ? 'active' : 'inactive'}`}>
                <div className="report-info">
                  <h3>{report.name}</h3>
                  <div className="report-meta">
                    <span className="meta-item">📁 {report.type}</span>
                    <span className="meta-item">🔄 {report.frequency}</span>
                    <span className="meta-item">📄 {report.format}</span>
                  </div>
                  <p className="schedule-info">
                    {t('bi', 'lastRun')}: {report.lastRun} | {t('bi', 'nextRun')}: {report.nextRun}
                  </p>
                  <p className="recipients">
                    {t('bi', 'recipients')}: {report.recipients.join(', ')}
                  </p>
                </div>
                <div className="report-actions">
                  <button className="btn-small">{t('common', 'edit')}</button>
                  <button className="btn-small">{t('bi', 'viewReport')}</button>
                  <button className="btn-small">{t('bi', 'download')}</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dashboards Tab */}
      {selectedTab === 'dashboards' && (
        <div className="bi-content">
          <h2>{t('bi', 'dashboards')}</h2>
          <div className="dashboards-grid">
            {dashboards.map((dashboard) => (
              <div key={dashboard.id} className="dashboard-card">
                <div className="dashboard-header">
                  <h3>{dashboard.name}</h3>
                  <span className="metric-count">{dashboard.metrics} {t('bi', 'metrics')}</span>
                </div>
                <div className="dashboard-info">
                  <p>{t('bi', 'lastUpdated')}: {dashboard.lastUpdated}</p>
                  <p>{dashboard.shared ? '🔓 Shared' : '🔒 Private'} - {dashboard.viewers} {t('bi', 'viewers')}</p>
                </div>
                <div className="dashboard-actions">
                  <button className="btn-small">{t('common', 'view')}</button>
                  <button className="btn-small">{t('common', 'edit')}</button>
                  <button className="btn-small">{dashboard.shared ? 'Unshare' : 'Share'}</button>
                </div>
              </div>
            ))}
          </div>

          <button className="btn-primary">{t('bi', 'createDashboard')}</button>
        </div>
      )}

      {/* Data Visualization Tab */}
      {selectedTab === 'visualization' && (
        <div className="bi-content">
          <h2>{t('bi', 'dataVisualization')}</h2>

          <div className="visualization-container">
            {/* Line Chart */}
            <div className="chart-box">
              <h3>{t('bi', 'salesTrend')}</h3>
              <svg viewBox="0 0 400 200" className="line-chart">
                <polyline
                  points="0,150 60,100 120,110 180,50 240,80 300,20 360,40"
                  className="chart-line"
                />
                {chartData.map((item, idx) => (
                  <g key={idx}>
                    <circle cx={idx * 60} cy={150 - (item.value / 2)} r="3" className="chart-point" />
                    <text x={idx * 60} y="180" textAnchor="middle" className="chart-label">{item.label}</text>
                  </g>
                ))}
              </svg>
            </div>

            {/* Heatmap */}
            <div className="chart-box">
              <h3>{t('bi', 'heatmap')}</h3>
              <div className="heatmap">
                {[...Array(28)].map((_, i) => (
                  <div
                    key={i}
                    className="heatmap-cell"
                    style={{
                      backgroundColor: `rgba(76, 175, 80, ${Math.random() * 0.8 + 0.2})`
                    }}
                    title={`Day ${i + 1}: ${Math.floor(Math.random() * 100)} sales`}
                  />
                ))}
              </div>
            </div>

            {/* Bar Chart */}
            <div className="chart-box">
              <h3>{t('bi', 'topCategories')}</h3>
              <div className="bar-chart">
                {['Electronics', 'Clothing', 'Books', 'Home', 'Sports'].map((cat, idx) => (
                  <div key={cat} className="bar-row">
                    <span className="category-label">{cat}</span>
                    <div className="bar" style={{ width: `${(idx + 1) * 20}%`, backgroundColor: `hsl(${idx * 60}, 70%, 50%)` }} />
                    <span className="bar-value">{(idx + 1) * 20}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div className="chart-box full-width">
              <h3>{t('bi', 'timeline')}</h3>
              <div className="timeline">
                <div className="timeline-item">
                  <span className="timeline-date">Jan 1</span>
                  <span className="timeline-event">{t('bi', 'businessLaunched')}</span>
                </div>
                <div className="timeline-item">
                  <span className="timeline-date">Mar 15</span>
                  <span className="timeline-event">{t('bi', 'first1kSales')}</span>
                </div>
                <div className="timeline-item">
                  <span className="timeline-date">Jun 1</span>
                  <span className="timeline-event">{t('bi', 'multiChannelEnabled')}</span>
                </div>
                <div className="timeline-item">
                  <span className="timeline-date">Dec 15</span>
                  <span className="timeline-event">Year-End Goals Achieved</span>
                </div>
              </div>
            </div>
          </div>

          {/* Export Options */}
          <div className="export-options">
            <button className="btn-primary">{t('bi', 'exportPDF')}</button>
            <button className="btn-primary">{t('bi', 'exportCSV')}</button>
            <button className="btn-primary">{t('bi', 'exportImage')}</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessIntelligence;
