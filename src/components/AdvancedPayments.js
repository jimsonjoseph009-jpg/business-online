import React, { useState } from 'react';
import { useLocalization } from '../contexts/LocalizationContext';
import { formatCurrency } from '../utils/currencyManager';
import './Payments.css';

const Payments = () => {
  const { t, currency } = useLocalization();
  const [transactions, setTransactions] = useState([
    {
      id: 'TXN001',
      reference: 'INV-5001',
      amount: 45000,
      method: 'M-Pesa',
      status: 'completed',
      timestamp: '2024-01-26 14:32:00',
      customer: 'John Smith'
    },
    {
      id: 'TXN002',
      reference: 'INV-5002',
      amount: 12500,
      method: 'HaloPesa',
      status: 'completed',
      timestamp: '2024-01-26 13:45:00',
      customer: 'Sarah Johnson'
    },
    {
      id: 'TXN003',
      reference: 'INV-5003',
      amount: 8900,
      method: 'Airtel Money',
      status: 'pending',
      timestamp: '2024-01-26 12:15:00',
      customer: 'Mike Wilson'
    },
    {
      id: 'TXN004',
      reference: 'INV-5004',
      amount: 35000,
      method: 'NMB Bank',
      status: 'completed',
      timestamp: '2024-01-26 11:20:00',
      customer: 'Emily Brown'
    },
    {
      id: 'TXN005',
      reference: 'INV-5005',
      amount: 22500,
      method: 'CRDB Bank',
      status: 'completed',
      timestamp: '2024-01-26 10:15:00',
      customer: 'David Lee'
    },
    {
      id: 'TXN006',
      reference: 'INV-5006',
      amount: 15800,
      method: 'NBC Bank',
      status: 'completed',
      timestamp: '2024-01-26 09:30:00',
      customer: 'Lisa Anderson'
    },
    {
      id: 'TXN007',
      reference: 'INV-5007',
      amount: 28900,
      method: 'Yas',
      status: 'completed',
      timestamp: '2024-01-26 08:45:00',
      customer: 'James Taylor'
    },
    {
      id: 'TXN008',
      reference: 'INV-5008',
      amount: 42000,
      method: 'Stripe',
      status: 'completed',
      timestamp: '2024-01-26 07:20:00',
      customer: 'Rachel White'
    },
    {
      id: 'TXN009',
      reference: 'INV-5009',
      amount: 19500,
      method: 'PayPal',
      status: 'pending',
      timestamp: '2024-01-26 06:10:00',
      customer: 'Kevin Martin'
    },
  ]);

  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      name: 'M-Pesa',
      type: 'mobile_money',
      enabled: true,
      logo: '📱',
      transactions: 156,
      revenue: 3450000,
      country: 'Tanzania'
    },
    {
      id: 2,
      name: 'HaloPesa',
      type: 'mobile_money',
      enabled: true,
      logo: '💚',
      transactions: 89,
      revenue: 1850000,
      country: 'Tanzania'
    },
    {
      id: 3,
      name: 'Airtel Money',
      type: 'mobile_money',
      enabled: true,
      logo: '🔴',
      transactions: 67,
      revenue: 1200000,
      country: 'Tanzania'
    },
    {
      id: 4,
      name: 'Yas',
      type: 'mobile_money',
      enabled: true,
      logo: '📲',
      transactions: 45,
      revenue: 890000,
      country: 'Tanzania'
    },
    {
      id: 5,
      name: 'NMB Bank',
      type: 'bank_transfer',
      enabled: true,
      logo: '🏦',
      transactions: 52,
      revenue: 2100000,
      country: 'Tanzania'
    },
    {
      id: 6,
      name: 'CRDB Bank',
      type: 'bank_transfer',
      enabled: true,
      logo: '🏛️',
      transactions: 38,
      revenue: 1650000,
      country: 'Tanzania'
    },
    {
      id: 7,
      name: 'NBC Bank',
      type: 'bank_transfer',
      enabled: true,
      logo: '🏢',
      transactions: 29,
      revenue: 950000,
      country: 'Tanzania'
    },
    {
      id: 8,
      name: 'Stripe',
      type: 'card',
      enabled: true,
      logo: '💳',
      transactions: 89,
      revenue: 1250000,
      country: 'International'
    },
    {
      id: 9,
      name: 'PayPal',
      type: 'wallet',
      enabled: true,
      logo: '🅿️',
      transactions: 45,
      revenue: 890000,
      country: 'International'
    },
  ]);

  const [selectedTab, setSelectedTab] = useState('transactions');
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="payments">
      <div className="page-header">
        <h1>💳 {t('payments', 'title')}</h1>
        <p>{t('payments', 'description')}</p>
      </div>

      {/* Payment Stats */}
      <div className="payment-stats">
        <div className="stat-card">
          <h3>{formatCurrency(transactions.reduce((sum, t) => sum + t.amount, 0), currency)}</h3>
          <p>{t('payments', 'totalTransactions')}</p>
        </div>
        <div className="stat-card">
          <h3>{transactions.filter(t => t.status === 'completed').length}</h3>
          <p>{t('payments', 'successfulPayments')}</p>
        </div>
        <div className="stat-card">
          <h3>{transactions.filter(t => t.status === 'pending').length}</h3>
          <p>{t('payments', 'pendingPayments')}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="payment-tabs">
        <button
          className={`tab-btn ${selectedTab === 'transactions' ? 'active' : ''}`}
          onClick={() => setSelectedTab('transactions')}
        >
          {t('payments', 'transactions')}
        </button>
        <button
          className={`tab-btn ${selectedTab === 'methods' ? 'active' : ''}`}
          onClick={() => setSelectedTab('methods')}
        >
          {t('payments', 'paymentMethods')}
        </button>
        <button
          className={`tab-btn ${selectedTab === 'subscriptions' ? 'active' : ''}`}
          onClick={() => setSelectedTab('subscriptions')}
        >
          {t('payments', 'subscriptions')}
        </button>
        <button
          className={`tab-btn ${selectedTab === 'reconciliation' ? 'active' : ''}`}
          onClick={() => setSelectedTab('reconciliation')}
        >
          {t('payments', 'reconciliation')}
        </button>
      </div>

      {/* Transactions Tab */}
      {selectedTab === 'transactions' && (
        <div className="payment-content">
          <h2>{t('payments', 'recentTransactions')}</h2>
          <table className="transactions-table">
            <thead>
              <tr>
                <th>{t('payments', 'transactionId')}</th>
                <th>{t('common', 'reference')}</th>
                <th>{t('payments', 'amount')}</th>
                <th>{t('payments', 'method')}</th>
                <th>{t('payments', 'customer')}</th>
                <th>{t('common', 'status')}</th>
                <th>{t('common', 'date')}</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn) => (
                <tr key={txn.id}>
                  <td className="txn-id">{txn.id}</td>
                  <td>{txn.reference}</td>
                  <td className="amount">{formatCurrency(txn.amount, currency)}</td>
                  <td>{txn.method}</td>
                  <td>{txn.customer}</td>
                  <td>
                    <span className={`status-badge ${txn.status}`}>
                      {txn.status === 'completed' ? '✓' : '⏳'} {txn.status}
                    </span>
                  </td>
                  <td>{txn.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Payment Methods Tab */}
      {selectedTab === 'methods' && (
        <div className="payment-content">
          <h2>{t('payments', 'paymentMethods')}</h2>
          <div className="payment-methods-grid">
            {paymentMethods.map((method) => (
              <div key={method.id} className="payment-method-card">
                <div className="method-header">
                  <span className="method-logo">{method.logo}</span>
                  <div className="method-info">
                    <h3>{method.name}</h3>
                    <span className="method-type">{method.type.replace('_', ' ')} • {method.country}</span>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked={method.enabled} />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <div className="method-stats">
                  <div className="stat">
                    <span className="label">{t('payments', 'transactions')}:</span>
                    <span className="value">{method.transactions}</span>
                  </div>
                  <div className="stat">
                    <span className="label">{t('payments', 'revenue')}:</span>
                    <span className="value">{formatCurrency(method.revenue, currency)}</span>
                  </div>
                </div>
                <button className="btn-small">{t('common', 'configure')}</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subscriptions Tab */}
      {selectedTab === 'subscriptions' && (
        <div className="payment-content">
          <h2>{t('payments', 'subscriptions')}</h2>
          <div className="subscriptions-container">
            <div className="subscription-card">
              <h3>Premium Plan</h3>
              <p className="price">{formatCurrency(99, currency)}/month</p>
              <ul className="features">
                <li>✓ Unlimited products</li>
                <li>✓ Advanced analytics</li>
                <li>✓ Priority support</li>
                <li>✓ API access</li>
              </ul>
              <button className="btn-small">{t('common', 'manage')}</button>
            </div>

            <div className="subscription-card">
              <h3>Professional Plan</h3>
              <p className="price">{formatCurrency(49, currency)}/month</p>
              <ul className="features">
                <li>✓ Up to 100 products</li>
                <li>✓ Basic analytics</li>
                <li>✓ Email support</li>
              </ul>
              <button className="btn-small">{t('common', 'manage')}</button>
            </div>

            <div className="subscription-card">
              <h3>Starter Plan</h3>
              <p className="price">{t('payments', 'free')}</p>
              <ul className="features">
                <li>✓ Up to 10 products</li>
                <li>✓ Basic features</li>
                <li>✓ Community support</li>
              </ul>
              <button className="btn-small">{t('common', 'manage')}</button>
            </div>
          </div>
        </div>
      )}

      {/* Reconciliation Tab */}
      {selectedTab === 'reconciliation' && (
        <div className="payment-content">
          <h2>{t('payments', 'reconciliation')}</h2>
          <div className="reconciliation-container">
            <div className="reconciliation-item">
              <h3>M-Pesa Settlement</h3>
              <p>Last reconciled: 2024-01-25</p>
              <div className="reconciliation-details">
                <p>Transactions: 156</p>
                <p>Total: {formatCurrency(3450000, currency)}</p>
                <p className="status success">✓ Reconciled</p>
              </div>
              <button className="btn-small">{t('payments', 'reconcile')}</button>
            </div>

            <div className="reconciliation-item">
              <h3>Stripe Settlement</h3>
              <p>Last reconciled: 2024-01-24</p>
              <div className="reconciliation-details">
                <p>Transactions: 89</p>
                <p>Total: {formatCurrency(1250000, currency)}</p>
                <p className="status warning">⏳ Pending</p>
              </div>
              <button className="btn-small">{t('payments', 'reconcile')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;
