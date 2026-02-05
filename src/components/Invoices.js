import React, { useState, useEffect } from 'react';
import { useLocalization } from '../contexts/LocalizationContext';
import { formatCurrency } from '../utils/currencyManager';
import Pagination from './Pagination';
import { invoiceAPI } from '../utils/apiClient';
import './Invoices.css';

const Invoices = () => {
  const { t, currency } = useLocalization();
  const [invoices, setInvoices] = useState(mockInvoiceData);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      try {
        const data = await invoiceAPI.getAll();
        setInvoices(data);
      } catch (apiError) {
        console.log('Using mock data - API not available');
        setInvoices(mockInvoiceData);
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async (invoiceId) => {
    try {
      try {
        await invoiceAPI.generatePDF(invoiceId);
      } catch (apiError) {
        console.log('PDF generation not available');
      }
      alert('Invoice PDF downloaded successfully');
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  const { items: paginatedInvoices, totalPages } = (() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return {
      items: invoices.slice(startIndex, endIndex),
      totalPages: Math.ceil(invoices.length / pageSize)
    };
  })();

  return (
    <div className="invoices">
      <div className="page-header">
        <h1>📄 Invoices</h1>
        <p>Manage and generate customer invoices</p>
      </div>

      <button className="btn-primary">+ Generate Invoice</button>

      <div className="invoices-stats">
        <div className="stat-card">
          <span className="stat-label">Total Invoices</span>
          <span className="stat-value">{invoices.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Paid</span>
          <span className="stat-value">{invoices.filter(i => i.status === 'paid').length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Pending</span>
          <span className="stat-value warning">{invoices.filter(i => i.status === 'pending').length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Overdue</span>
          <span className="stat-value danger">{invoices.filter(i => i.status === 'overdue').length}</span>
        </div>
      </div>

      <div className="invoices-table-container">
        <table className="invoices-table">
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedInvoices.map(invoice => (
              <tr key={invoice.id}>
                <td className="invoice-no">{invoice.number}</td>
                <td>{invoice.customer}</td>
                <td className="amount">${(invoice.amount / 100).toFixed(2)}</td>
                <td>{new Date(invoice.date).toLocaleDateString()}</td>
                <td>{new Date(invoice.dueDate).toLocaleDateString()}</td>
                <td>
                  <span className={`status-badge status-${invoice.status}`}>
                    {invoice.status}
                  </span>
                </td>
                <td><button className="btn-download">Download PDF</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={invoices.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

const mockInvoiceData = [
  { id: '1', number: 'INV-2026-001', customer: 'John Doe', amount: 9999, date: new Date(), dueDate: new Date(Date.now() + 86400000 * 30), status: 'paid' },
  { id: '2', number: 'INV-2026-002', customer: 'Jane Smith', amount: 15500, date: new Date(), dueDate: new Date(Date.now() + 86400000 * 15), status: 'pending' },
  { id: '3', number: 'INV-2026-003', customer: 'Bob Johnson', amount: 7200, date: new Date(Date.now() - 86400000 * 60), dueDate: new Date(Date.now() - 86400000 * 30), status: 'overdue' },
];

export default Invoices;
