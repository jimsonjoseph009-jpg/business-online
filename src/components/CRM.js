import React, { useState, useEffect } from 'react';
import { useLocalization } from '../contexts/LocalizationContext';
import { formatCurrency } from '../utils/currencyManager';
import './CRM.css';

const CRM = () => {
  const { t, currency } = useLocalization();
  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: 'John Smith',
      email: 'john@example.com',
      phone: '+255 654 321 000',
      segment: 'VIP',
      lifetime: 15600,
      orders: 24,
      lastOrder: '2024-01-15',
      status: 'active'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+255 765 432 100',
      segment: 'Regular',
      lifetime: 4500,
      orders: 8,
      lastOrder: '2024-01-20',
      status: 'active'
    },
    {
      id: 3,
      name: 'Mike Wilson',
      email: 'mike@example.com',
      phone: '+255 876 543 210',
      segment: 'New',
      lifetime: 890,
      orders: 1,
      lastOrder: '2024-01-25',
      status: 'active'
    },
  ]);

  const [selectedSegment, setSelectedSegment] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const segments = [
    { name: 'VIP', color: '#FFD700', customers: 12 },
    { name: 'Regular', color: '#4CAF50', customers: 45 },
    { name: 'New', color: '#2196F3', customers: 23 },
  ];

  const filteredCustomers = selectedSegment === 'all'
    ? customers
    : customers.filter(c => c.segment === selectedSegment);

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
    setShowModal(true);
  };

  const handleSaveCustomer = (updatedCustomer) => {
    if (editingCustomer) {
      setCustomers(customers.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
    } else {
      setCustomers([...customers, { ...updatedCustomer, id: Date.now() }]);
    }
    setShowModal(false);
    setEditingCustomer(null);
  };

  const getSegmentColor = (segment) => {
    const found = segments.find(s => s.name === segment);
    return found?.color || '#999';
  };

  return (
    <div className="crm">
      <div className="page-header">
        <h1>👥 {t('crm', 'title')}</h1>
        <p>{t('crm', 'description')}</p>
      </div>

      {/* Segment Overview */}
      <div className="segment-overview">
        <div className="segment-card all-customers">
          <h3>{t('crm', 'allCustomers')}</h3>
          <p className="count">{customers.length}</p>
        </div>
        {segments.map((segment) => (
          <div key={segment.name} className="segment-card" style={{ borderLeft: `4px solid ${segment.color}` }}>
            <h3>{segment.name}</h3>
            <p className="count">{segment.customers}</p>
            <small>{t('crm', 'customers')}</small>
          </div>
        ))}
      </div>

      {/* Filters and Actions */}
      <div className="crm-controls">
        <div className="segment-filter">
          <label>{t('crm', 'filterBySegment')}:</label>
          <select value={selectedSegment} onChange={(e) => setSelectedSegment(e.target.value)}>
            <option value="all">{t('common', 'all')}</option>
            {segments.map((seg) => (
              <option key={seg.name} value={seg.name}>{seg.name}</option>
            ))}
          </select>
        </div>
        <button className="btn-primary" onClick={() => {
          setEditingCustomer(null);
          setShowModal(true);
        }}>
          + {t('crm', 'addCustomer')}
        </button>
      </div>

      {/* Customer Table */}
      <div className="crm-table-container">
        <table className="crm-table">
          <thead>
            <tr>
              <th>{t('common', 'name')}</th>
              <th>{t('common', 'email')}</th>
              <th>{t('common', 'phone')}</th>
              <th>{t('crm', 'segment')}</th>
              <th>{t('crm', 'lifetimeValue')}</th>
              <th>{t('crm', 'orders')}</th>
              <th>{t('crm', 'lastOrder')}</th>
              <th>{t('common', 'actions')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((customer) => (
              <tr key={customer.id}>
                <td className="customer-name">{customer.name}</td>
                <td>{customer.email}</td>
                <td>{customer.phone}</td>
                <td>
                  <span className="segment-badge" style={{ backgroundColor: getSegmentColor(customer.segment) }}>
                    {customer.segment}
                  </span>
                </td>
                <td className="amount">{formatCurrency(customer.lifetime, currency)}</td>
                <td>{customer.orders}</td>
                <td>{new Date(customer.lastOrder).toLocaleDateString()}</td>
                <td>
                  <button className="btn-action" onClick={() => handleEditCustomer(customer)}>
                    {t('common', 'edit')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Loyalty Program Section */}
      <div className="loyalty-program">
        <h3>🎁 {t('crm', 'loyaltyProgram')}</h3>
        <div className="loyalty-cards">
          <div className="loyalty-tier">
            <h4>{t('crm', 'tierGold')}</h4>
            <p>{t('crm', 'tierGoldDesc')}</p>
            <ul>
              <li>10% {t('crm', 'discount')}</li>
              <li>1.5x {t('crm', 'points')}</li>
              <li>{t('crm', 'freeShipping')}</li>
            </ul>
          </div>
          <div className="loyalty-tier">
            <h4>{t('crm', 'tierSilver')}</h4>
            <p>{t('crm', 'tierSilverDesc')}</p>
            <ul>
              <li>5% {t('crm', 'discount')}</li>
              <li>1x {t('crm', 'points')}</li>
              <li>{t('crm', 'prioritySupport')}</li>
            </ul>
          </div>
          <div className="loyalty-tier">
            <h4>{t('crm', 'tierBronze')}</h4>
            <p>{t('crm', 'tierBronzeDesc')}</p>
            <ul>
              <li>2% {t('crm', 'discount')}</li>
              <li>0.5x {t('crm', 'points')}</li>
              <li>{t('crm', 'memberBenefits')}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Customer Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{editingCustomer ? t('common', 'edit') : t('crm', 'addCustomer')}</h3>
            <CustomerForm
              customer={editingCustomer}
              onSave={handleSaveCustomer}
              onCancel={() => setShowModal(false)}
              t={t}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const CustomerForm = ({ customer, onSave, onCancel, t }) => {
  const [formData, setFormData] = useState(
    customer || {
      name: '',
      email: '',
      phone: '',
      segment: 'New',
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="customer-form">
      <div className="form-group">
        <label>{t('common', 'name')}</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div className="form-group">
        <label>{t('common', 'email')}</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>
      <div className="form-group">
        <label>{t('common', 'phone')}</label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </div>
      <div className="form-group">
        <label>{t('crm', 'segment')}</label>
        <select value={formData.segment} onChange={(e) => setFormData({ ...formData, segment: e.target.value })}>
          <option>VIP</option>
          <option>Regular</option>
          <option>New</option>
        </select>
      </div>
      <div className="form-actions">
        <button type="submit" className="btn-primary">{t('common', 'save')}</button>
        <button type="button" className="btn-secondary" onClick={onCancel}>{t('common', 'cancel')}</button>
      </div>
    </form>
  );
};

export default CRM;
