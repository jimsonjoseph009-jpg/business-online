import React, { useState, useEffect } from 'react';
import { useLocalization } from '../contexts/LocalizationContext';
import { formatCurrency } from '../utils/currencyManager';
import Pagination from './Pagination';
import DeliveryTracking from './DeliveryTracking';
import { shippingAPI } from '../utils/apiClient';
import './Shipping.css';

const Shipping = () => {
  const { t, currency } = useLocalization();
  const [shipments, setShipments] = useState(mockShipmentData);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [selectedShipmentId, setSelectedShipmentId] = useState(null);

  useEffect(() => {
    fetchShipments();
  }, []);

  const fetchShipments = async () => {
    try {
      setLoading(true);
      try {
        const data = await shippingAPI.getAll();
        setShipments(data);
      } catch (apiError) {
        console.log('Using mock data - API not available');
        setShipments(mockShipmentData);
      }
    } catch (error) {
      console.error('Error fetching shipments:', error);
    } finally {
      setLoading(false);
    }
  };

  const { items: paginatedShipments, totalPages } = (() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return {
      items: shipments.slice(startIndex, endIndex),
      totalPages: Math.ceil(shipments.length / pageSize)
    };
  })();

  return (
    <div className="shipping">
      <div className="page-header">
        <h1>📦 Shipping & Delivery</h1>
        <p>Track shipments and manage delivery</p>
      </div>

      <div className="shipping-stats">
        <div className="stat-card">
          <span className="stat-label">Total Shipments</span>
          <span className="stat-value">{shipments.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">In Transit</span>
          <span className="stat-value">{shipments.filter(s => s.status === 'in-transit').length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Delivered</span>
          <span className="stat-value">{shipments.filter(s => s.status === 'delivered').length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Issues</span>
          <span className="stat-value danger">{shipments.filter(s => s.status === 'delayed').length}</span>
        </div>
      </div>

      <div className="shipments-table-container">
        <table className="shipments-table">
          <thead>
            <tr>
              <th>Tracking #</th>
              <th>Order ID</th>
              <th>Carrier</th>
              <th>Status</th>
              <th>Est. Delivery</th>
              <th>Shipped</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedShipments.map(shipment => (
              <tr key={shipment.id} className={`status-${shipment.status}`}>
                <td className="tracking">{shipment.tracking}</td>
                <td>{shipment.orderId}</td>
                <td>{shipment.carrier}</td>
                <td>
                  <span className={`status-badge status-${shipment.status}`}>
                    {shipment.status}
                  </span>
                </td>
                <td>{new Date(shipment.estDelivery).toLocaleDateString()}</td>
                <td>{new Date(shipment.shippedDate).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn-track"
                    onClick={() => setSelectedShipmentId(shipment.id)}
                  >
                    Track
                  </button>
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
          totalItems={shipments.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      )}

      {selectedShipmentId && (
        <DeliveryTracking
          shipmentId={`SHIP-${selectedShipmentId.padStart(3, '0')}`}
          onClose={() => setSelectedShipmentId(null)}
        />
      )}
    </div>
  );
};

const mockShipmentData = [
  { id: '1', tracking: 'TRK-2025-001', orderId: 'ORD-001', carrier: 'FedEx', status: 'delivered', estDelivery: new Date(), shippedDate: new Date(Date.now() - 86400000 * 3) },
  { id: '2', tracking: 'TRK-2025-002', orderId: 'ORD-002', carrier: 'UPS', status: 'in-transit', estDelivery: new Date(Date.now() + 86400000 * 2), shippedDate: new Date(Date.now() - 86400000) },
  { id: '3', tracking: 'TRK-2025-003', orderId: 'ORD-003', carrier: 'DHL', status: 'delayed', estDelivery: new Date(Date.now() - 86400000), shippedDate: new Date(Date.now() - 86400000 * 5) },
];

export default Shipping;
