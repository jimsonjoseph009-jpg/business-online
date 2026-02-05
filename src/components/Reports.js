import React, { useState, useEffect } from 'react';
import { useLocalization } from '../contexts/LocalizationContext';
import { formatCurrency } from '../utils/currencyManager';
import { reportAPI } from '../utils/apiClient';
import '../components/Reports.css';
import Pagination from './Pagination';
import SearchFilterBar from './SearchFilterBar';

const Reports = () => {
  const { t, currency } = useLocalization();
  const [reports, setReports] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      try {
        const data = await reportAPI.getAll();
        setReports(data);
      } catch (apiError) {
        console.log('Using mock data - API not available');
        setReports(allReports);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const allReports = [
    {
      id: 1,
      name: 'Monthly Sales Report',
      date: '2026-01-31',
      sales: 45250.80,
      orders: 342,
      avgOrder: 132.40,
      growth: 12.5,
      status: 'Completed'
    },
    {
      id: 2,
      name: 'Customer Analytics',
      date: '2026-01-28',
      sales: 32100.50,
      orders: 215,
      avgOrder: 149.30,
      growth: 8.3,
      status: 'Completed'
    },
    {
      id: 3,
      name: 'Product Performance',
      date: '2026-01-25',
      sales: 28900.00,
      orders: 189,
      avgOrder: 152.90,
      growth: -2.1,
      status: 'Completed'
    },
    {
      id: 4,
      name: 'Inventory Report',
      date: '2026-01-20',
      sales: 18750.25,
      orders: 125,
      avgOrder: 150.00,
      growth: 5.2,
      status: 'In Progress'
    },
    {
      id: 5,
      name: 'Shipping Analysis',
      date: '2026-01-18',
      sales: 12500.00,
      orders: 87,
      avgOrder: 143.68,
      growth: 3.8,
      status: 'Completed'
    },
    {
      id: 6,
      name: 'Customer Retention',
      date: '2026-01-15',
      sales: 55000.00,
      orders: 401,
      avgOrder: 137.16,
      growth: 15.7,
      status: 'Completed'
    }
  ];

  const filteredReports = allReports.filter(report =>
    report.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReports = filteredReports.slice(startIndex, startIndex + itemsPerPage);

  const totalSales = allReports.reduce((sum, r) => sum + r.sales, 0);
  const totalOrders = allReports.reduce((sum, r) => sum + r.orders, 0);
  const avgGrowth = (allReports.reduce((sum, r) => sum + r.growth, 0) / allReports.length).toFixed(1);
  const completedCount = allReports.filter(r => r.status === 'Completed').length;

  const downloadReport = (reportId) => {
    const report = allReports.find(r => r.id === reportId);
    const csv = `Report: ${report.name}\nDate: ${report.date}\nTotal Sales: $${report.sales.toFixed(2)}\nOrders: ${report.orders}\nAvg Order: $${report.avgOrder.toFixed(2)}\nGrowth: ${report.growth}%`;
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(csv));
    element.setAttribute('download', `${report.name.replace(/\s+/g, '_')}.csv`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="reports">
      <div className="page-header">
        <h1>📊 Reports & Analytics</h1>
        <p>Generate and review comprehensive business reports</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">${(totalSales / 1000).toFixed(0)}K</div>
          <div className="stat-label">Total Revenue</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{totalOrders}</div>
          <div className="stat-label">Total Orders</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{completedCount}</div>
          <div className="stat-label">Completed Reports</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{avgGrowth}%</div>
          <div className="stat-label">Avg Growth</div>
        </div>
      </div>

      <div className="reports-section">
        <div className="section-header">
          <h2>Recent Reports</h2>
          <SearchFilterBar 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            placeholder="Search reports..."
          />
        </div>

        <table className="reports-table">
          <thead>
            <tr>
              <th>Report Name</th>
              <th>Date</th>
              <th>Sales</th>
              <th>Orders</th>
              <th>Avg Order</th>
              <th>Growth</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedReports.map(report => (
              <tr key={report.id}>
                <td>{report.name}</td>
                <td>{new Date(report.date).toLocaleDateString()}</td>
                <td>${report.sales.toFixed(2)}</td>
                <td>{report.orders}</td>
                <td>${report.avgOrder.toFixed(2)}</td>
                <td className={report.growth >= 0 ? 'positive' : 'negative'}>
                  {report.growth >= 0 ? '+' : ''}{report.growth}%
                </td>
                <td>
                  <span className={`status-badge status-${report.status.toLowerCase().replace(' ', '-')}`}>
                    {report.status}
                  </span>
                </td>
                <td>
                  <button 
                    className="action-btn download-btn"
                    onClick={() => downloadReport(report.id)}
                    title="Download Report"
                  >
                    ⬇️ Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {paginatedReports.length === 0 && (
          <div className="no-data">No reports found</div>
        )}

        {totalPages > 1 && (
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
};

export default Reports;
