import React, { useState, useEffect } from 'react';
import { useLocalization } from '../contexts/LocalizationContext';
import { formatCurrency } from '../utils/currencyManager';
import Pagination from './Pagination';
import { campaignAPI } from '../utils/apiClient';
import './EmailCampaigns.css';

const EmailCampaigns = () => {
  const { t, currency } = useLocalization();
  const [campaigns, setCampaigns] = useState(mockCampaignData);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      try {
        const data = await campaignAPI.getAll();
        setCampaigns(data);
      } catch (apiError) {
        console.log('Using mock data - API not available');
        setCampaigns(mockCampaignData);
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const { items: paginatedCampaigns, totalPages } = (() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return {
      items: campaigns.slice(startIndex, endIndex),
      totalPages: Math.ceil(campaigns.length / pageSize)
    };
  })();

  return (
    <div className="email-campaigns">
      <div className="page-header">
        <h1>📧 Email Campaigns</h1>
        <p>Manage customer communication and newsletters</p>
      </div>

      <button className="btn-primary">+ New Campaign</button>

      <div className="campaigns-stats">
        <div className="stat-card">
          <span className="stat-label">Total Campaigns</span>
          <span className="stat-value">{campaigns.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Active</span>
          <span className="stat-value">{campaigns.filter(c => c.status === 'active').length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Avg Open Rate</span>
          <span className="stat-value">{(campaigns.reduce((sum, c) => sum + c.openRate, 0) / campaigns.length).toFixed(1)}%</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Sent</span>
          <span className="stat-value">{campaigns.reduce((sum, c) => sum + c.sent, 0)}</span>
        </div>
      </div>

      <div className="campaigns-table-container">
        <table className="campaigns-table">
          <thead>
            <tr>
              <th>Campaign Name</th>
              <th>Recipients</th>
              <th>Sent</th>
              <th>Open Rate</th>
              <th>Click Rate</th>
              <th>Status</th>
              <th>Created</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCampaigns.map(campaign => (
              <tr key={campaign.id}>
                <td className="name">{campaign.name}</td>
                <td>{campaign.recipients}</td>
                <td>{campaign.sent}</td>
                <td>{campaign.openRate}%</td>
                <td>{campaign.clickRate}%</td>
                <td>
                  <span className={`status-badge status-${campaign.status}`}>
                    {campaign.status}
                  </span>
                </td>
                <td>{new Date(campaign.createdAt).toLocaleDateString()}</td>
                <td><button className="btn-view">View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={campaigns.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

const mockCampaignData = [
  { id: '1', name: 'Summer Sale 2026', recipients: 5420, sent: 5200, openRate: 28, clickRate: 5, status: 'active', createdAt: new Date() },
  { id: '2', name: 'New Product Launch', recipients: 3100, sent: 3050, openRate: 35, clickRate: 8, status: 'completed', createdAt: new Date() },
  { id: '3', name: 'Newsletter Jan', recipients: 8900, sent: 8750, openRate: 22, clickRate: 3, status: 'completed', createdAt: new Date() },
];

export default EmailCampaigns;
