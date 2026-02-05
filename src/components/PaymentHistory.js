import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Pagination from './Pagination';
import SearchFilterBar from './SearchFilterBar';
import { getPaginatedItems } from '../utils/paginationUtils';
import { searchItems, applyFilters } from '../utils/searchUtils';
import './PaymentHistory.css';

const PaymentHistory = () => {
  const { currentUser } = useAuth();
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    dateRange: { startDate: '', endDate: '' }
  });
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');

  // Fetch payments on component mount
  useEffect(() => {
    fetchPayments();
  }, [currentUser?.uid]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError('');
      
      // In real app, fetch from API
      const response = await fetch(`/api/payments?userId=${currentUser?.uid}`);
      if (response.ok) {
        const data = await response.json();
        setPayments(data);
        setFilteredPayments(data);
      } else {
        // Mock data for demo
        setPayments(mockPaymentData);
        setFilteredPayments(mockPaymentData);
      }
    } catch (err) {
      console.log('Using mock payment data');
      setPayments(mockPaymentData);
      setFilteredPayments(mockPaymentData);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters and search
  useEffect(() => {
    let results = [...payments];

    // Search
    if (searchTerm) {
      results = searchItems(results, searchTerm, ['transactionId', 'orderId', 'method']);
    }

    // Status filter
    if (filters.status) {
      results = results.filter(p => p.status === filters.status);
    }

    // Date range filter
    if (filters.dateRange.startDate && filters.dateRange.endDate) {
      const start = new Date(filters.dateRange.startDate);
      const end = new Date(filters.dateRange.endDate);
      results = results.filter(p => {
        const paymentDate = new Date(p.createdAt);
        return paymentDate >= start && paymentDate <= end;
      });
    }

    // Sort
    results.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredPayments(results);
    setCurrentPage(1);
  }, [searchTerm, filters, sortField, sortDirection, payments]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFilter = (filterObj) => {
    setFilters(prev => ({
      ...prev,
      ...filterObj
    }));
  };

  const handleSort = (field, direction) => {
    setSortField(field);
    setSortDirection(direction);
  };

  const { items: paginatedPayments, totalPages } = getPaginatedItems(
    filteredPayments,
    currentPage,
    pageSize
  );

  const getStatusBadge = (status) => {
    const statusClasses = {
      'completed': 'badge-success',
      'pending': 'badge-warning',
      'failed': 'badge-danger',
      'refunded': 'badge-info'
    };
    return statusClasses[status] || 'badge-default';
  };

  const formatCurrency = (cents) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="payment-history"><div className="loader">Loading payments...</div></div>;
  }

  return (
    <div className="payment-history">
      <div className="page-header">
        <h1>💳 Payment History</h1>
        <p>Track all your transactions and payment status</p>
      </div>

      {error && <div className="error-alert">{error}</div>}

      <SearchFilterBar
        onSearch={handleSearch}
        onFilter={handleFilter}
        onSort={handleSort}
        showStatus={true}
        showDateRange={true}
        statuses={['completed', 'pending', 'failed', 'refunded']}
        sortFields={[
          { value: 'createdAt', label: 'Date' },
          { value: 'amount', label: 'Amount' },
          { value: 'status', label: 'Status' }
        ]}
      />

      <div className="payments-summary">
        <div className="summary-card">
          <span className="summary-label">Total Payments</span>
          <span className="summary-value">{payments.length}</span>
        </div>
        <div className="summary-card">
          <span className="summary-label">Total Amount Paid</span>
          <span className="summary-value">
            {formatCurrency(
              payments
                .filter(p => p.status === 'completed')
                .reduce((sum, p) => sum + p.amount, 0)
            )}
          </span>
        </div>
        <div className="summary-card">
          <span className="summary-label">Pending</span>
          <span className="summary-value pending">
            {payments.filter(p => p.status === 'pending').length}
          </span>
        </div>
      </div>

      {paginatedPayments.length > 0 ? (
        <>
          <div className="payments-table-container">
            <table className="payments-table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Order ID</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPayments.map(payment => (
                  <tr key={payment.id} className={`row-${payment.status}`}>
                    <td className="code">{payment.transactionId}</td>
                    <td>{payment.orderId}</td>
                    <td className="amount">{formatCurrency(payment.amount)}</td>
                    <td>
                      <span className="method-badge">{payment.method}</span>
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusBadge(payment.status)}`}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </td>
                    <td className="date">{formatDate(payment.createdAt)}</td>
                    <td>
                      <button className="btn-receipt">View Receipt</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredPayments.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No payments found</h3>
          <p>You don't have any payment history yet.</p>
        </div>
      )}
    </div>
  );
};

// Mock data for demo
const mockPaymentData = [
  {
    id: '1',
    transactionId: 'TXN-2025-001',
    orderId: 'ORD-001',
    amount: 9999,
    method: 'Credit Card',
    status: 'completed',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    transactionId: 'TXN-2025-002',
    orderId: 'ORD-002',
    amount: 5500,
    method: 'Debit Card',
    status: 'completed',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: '3',
    transactionId: 'TXN-2025-003',
    orderId: 'ORD-003',
    amount: 15000,
    method: 'PayPal',
    status: 'pending',
    createdAt: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: '4',
    transactionId: 'TXN-2025-004',
    orderId: 'ORD-004',
    amount: 7200,
    method: 'Credit Card',
    status: 'completed',
    createdAt: new Date(Date.now() - 259200000).toISOString()
  }
];

export default PaymentHistory;
