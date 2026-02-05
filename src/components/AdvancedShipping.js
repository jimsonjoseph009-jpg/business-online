import React, { useState } from 'react';
import { useLocalization } from '../contexts/LocalizationContext';
import { formatCurrency } from '../utils/currencyManager';
import './AdvancedShipping.css';

const AdvancedShipping = () => {
  const { t, currency } = useLocalization();
  const [shipments, setShipments] = useState([
    {
      id: 'SHP001',
      orderId: 'ORD5001',
      destination: 'Dar es Salaam',
      carrier: 'FedEx',
      trackingNumber: 'FX123456789',
      weight: 2.5,
      cost: 45000,
      status: 'delivered',
      estimatedDelivery: '2024-01-26',
      actualDelivery: '2024-01-25',
      pod: 'Signed'
    },
    {
      id: 'SHP002',
      orderId: 'ORD5002',
      destination: 'Arusha',
      carrier: 'UPS',
      trackingNumber: 'UP987654321',
      weight: 1.8,
      cost: 35000,
      status: 'in_transit',
      estimatedDelivery: '2024-01-27',
      actualDelivery: null,
      pod: 'N/A'
    },
    {
      id: 'SHP003',
      orderId: 'ORD5003',
      destination: 'Mbeya',
      carrier: 'DHL',
      trackingNumber: 'DH456789123',
      weight: 3.2,
      cost: 55000,
      status: 'picked_up',
      estimatedDelivery: '2024-01-28',
      actualDelivery: null,
      pod: 'N/A'
    },
  ]);

  const [carriers, setCarriers] = useState([
    {
      id: 1,
      name: 'FedEx',
      logo: '📦',
      enabled: true,
      costPerKg: 12000,
      avgDeliveryTime: 2,
      coverage: 'Nationwide'
    },
    {
      id: 2,
      name: 'UPS',
      logo: '🚚',
      enabled: true,
      costPerKg: 10000,
      avgDeliveryTime: 3,
      coverage: 'Nationwide'
    },
    {
      id: 3,
      name: 'DHL',
      logo: '🚛',
      enabled: true,
      costPerKg: 11000,
      avgDeliveryTime: 2,
      coverage: 'Nationwide'
    },
  ]);

  const [selectedTab, setSelectedTab] = useState('shipments');
  const [showCostCalculator, setShowCostCalculator] = useState(false);
  const [calcWeight, setCalcWeight] = useState('');
  const [calcCarrier, setCalcCarrier] = useState('FedEx');

  const calculateShippingCost = () => {
    const carrier = carriers.find(c => c.name === calcCarrier);
    if (carrier && calcWeight) {
      return carrier.costPerKg * parseFloat(calcWeight);
    }
    return 0;
  };

  return (
    <div className="advanced-shipping">
      <div className="page-header">
        <h1>🚚 {t('shipping', 'title')}</h1>
        <p>{t('shipping', 'description')}</p>
      </div>

      {/* Shipping Stats */}
      <div className="shipping-stats">
        <div className="stat-card">
          <h3>{shipments.length}</h3>
          <p>{t('shipping', 'totalShipments')}</p>
        </div>
        <div className="stat-card">
          <h3>{shipments.filter(s => s.status === 'delivered').length}</h3>
          <p>{t('shipping', 'delivered')}</p>
        </div>
        <div className="stat-card">
          <h3>{formatCurrency(shipments.reduce((sum, s) => sum + s.cost, 0), currency)}</h3>
          <p>{t('shipping', 'totalShippingCost')}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="shipping-tabs">
        <button
          className={`tab-btn ${selectedTab === 'shipments' ? 'active' : ''}`}
          onClick={() => setSelectedTab('shipments')}
        >
          {t('shipping', 'shipments')}
        </button>
        <button
          className={`tab-btn ${selectedTab === 'carriers' ? 'active' : ''}`}
          onClick={() => setSelectedTab('carriers')}
        >
          {t('shipping', 'carriers')}
        </button>
        <button
          className={`tab-btn ${selectedTab === 'returns' ? 'active' : ''}`}
          onClick={() => setSelectedTab('returns')}
        >
          {t('shipping', 'returns')}
        </button>
      </div>

      {/* Shipments Tab */}
      {selectedTab === 'shipments' && (
        <div className="shipping-content">
          <div className="shipments-header">
            <h2>{t('shipping', 'shipments')}</h2>
            <button className="btn-primary" onClick={() => setShowCostCalculator(!showCostCalculator)}>
              {showCostCalculator ? '✕ Hide' : '📊 Cost Calculator'}
            </button>
          </div>

          {showCostCalculator && (
            <div className="cost-calculator">
              <h3>{t('shipping', 'calculateCost')}</h3>
              <div className="calculator-form">
                <div className="form-group">
                  <label>{t('shipping', 'weight')} (kg):</label>
                  <input
                    type="number"
                    value={calcWeight}
                    onChange={(e) => setCalcWeight(e.target.value)}
                    placeholder="Enter weight"
                  />
                </div>
                <div className="form-group">
                  <label>{t('shipping', 'carrier')}:</label>
                  <select value={calcCarrier} onChange={(e) => setCalcCarrier(e.target.value)}>
                    {carriers.map((carrier) => (
                      <option key={carrier.id} value={carrier.name}>{carrier.name}</option>
                    ))}
                  </select>
                </div>
                <div className="calculated-cost">
                  <p>{t('shipping', 'estimatedCost')}: <strong>{formatCurrency(calculateShippingCost(), currency)}</strong></p>
                </div>
              </div>
            </div>
          )}

          <table className="shipments-table">
            <thead>
              <tr>
                <th>{t('shipping', 'shipmentId')}</th>
                <th>{t('common', 'orderId')}</th>
                <th>{t('shipping', 'destination')}</th>
                <th>{t('shipping', 'carrier')}</th>
                <th>{t('shipping', 'trackingNumber')}</th>
                <th>{t('shipping', 'weight')}</th>
                <th>{t('shipping', 'cost')}</th>
                <th>{t('common', 'status')}</th>
                <th>{t('shipping', 'estimatedDelivery')}</th>
                <th>{t('common', 'actions')}</th>
              </tr>
            </thead>
            <tbody>
              {shipments.map((shipment) => (
                <tr key={shipment.id}>
                  <td className="shipment-id">{shipment.id}</td>
                  <td>{shipment.orderId}</td>
                  <td>{shipment.destination}</td>
                  <td>{shipment.carrier}</td>
                  <td className="tracking-number">
                    <a href="#" onClick={(e) => { e.preventDefault(); alert(`Tracking: ${shipment.trackingNumber}`); }}>
                      {shipment.trackingNumber}
                    </a>
                  </td>
                  <td>{shipment.weight} kg</td>
                  <td>{formatCurrency(shipment.cost, currency)}</td>
                  <td>
                    <span className={`status-badge ${shipment.status}`}>
                      {shipment.status === 'delivered' && '✓ Delivered'}
                      {shipment.status === 'in_transit' && '→ In Transit'}
                      {shipment.status === 'picked_up' && '📦 Picked Up'}
                    </span>
                  </td>
                  <td>{shipment.estimatedDelivery}</td>
                  <td>
                    <button className="btn-small">{t('common', 'details')}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Carriers Tab */}
      {selectedTab === 'carriers' && (
        <div className="shipping-content">
          <h2>{t('shipping', 'carriers')}</h2>
          <div className="carriers-grid">
            {carriers.map((carrier) => (
              <div key={carrier.id} className="carrier-card">
                <div className="carrier-header">
                  <span className="carrier-logo">{carrier.logo}</span>
                  <h3>{carrier.name}</h3>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked={carrier.enabled} />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <div className="carrier-details">
                  <p><strong>{t('shipping', 'costPerKg')}:</strong> {formatCurrency(carrier.costPerKg, currency)}</p>
                  <p><strong>{t('shipping', 'avgDeliveryTime')}:</strong> {carrier.avgDeliveryTime} days</p>
                  <p><strong>{t('shipping', 'coverage')}:</strong> {carrier.coverage}</p>
                </div>
                <button className="btn-small">{t('common', 'configure')}</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Returns Tab */}
      {selectedTab === 'returns' && (
        <div className="shipping-content">
          <h2>{t('shipping', 'returns')}</h2>
          <div className="returns-container">
            <div className="return-item">
              <h3>RMA-001: Order #5001</h3>
              <p>Customer: John Smith</p>
              <p>Reason: Defective Product</p>
              <p>Status: <span className="badge pending">Pending Inspection</span></p>
              <div className="rma-timeline">
                <div className="timeline-item completed">✓ Return Initiated</div>
                <div className="timeline-item completed">✓ Label Sent</div>
                <div className="timeline-item current">→ In Transit</div>
                <div className="timeline-item">Inspection</div>
                <div className="timeline-item">Refund</div>
              </div>
            </div>

            <div className="return-item">
              <h3>RMA-002: Order #5002</h3>
              <p>Customer: Sarah Johnson</p>
              <p>Reason: Wrong Size</p>
              <p>Status: <span className="badge completed">Completed</span></p>
              <div className="rma-timeline">
                <div className="timeline-item completed">✓ Return Initiated</div>
                <div className="timeline-item completed">✓ Label Sent</div>
                <div className="timeline-item completed">✓ Received</div>
                <div className="timeline-item completed">✓ Inspection</div>
                <div className="timeline-item completed">✓ Refund Processed</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedShipping;
