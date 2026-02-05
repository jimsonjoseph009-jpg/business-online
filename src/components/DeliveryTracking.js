import React, { useState, useEffect } from 'react';
import './DeliveryTracking.css';

const DeliveryTracking = ({ shipmentId, onClose }) => {
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [notifications, setNotifications] = useState({
    sms: true,
    email: true,
    push: true
  });

  // Mock shipment data - Replace with API call
  const mockShipments = {
    'SHIP-001': {
      id: 'SHIP-001',
      orderId: 'ORD-12345',
      carrier: 'FedEx',
      trackingNumber: '794698570128',
      status: 'in-transit',
      currentLocation: 'Memphis, TN',
      estimatedDelivery: '2026-01-24',
      estimatedDeliveryTime: '2:00 PM - 6:00 PM',
      shippedDate: '2026-01-20',
      weight: '2.5 lbs',
      cost: '$12.99',
      recipient: {
        name: 'John Doe',
        address: '123 Main St, Springfield, IL 62701',
        phone: '555-0123'
      },
      timeline: [
        {
          status: 'picked-up',
          timestamp: '2026-01-20 08:30',
          location: 'Chicago, IL',
          description: 'Package picked up from warehouse',
          icon: '📦'
        },
        {
          status: 'in-transit',
          timestamp: '2026-01-21 14:00',
          location: 'Memphis, TN',
          description: 'In transit to destination',
          icon: '🚚'
        },
        {
          status: 'out-for-delivery',
          timestamp: null,
          location: 'Springfield, IL',
          description: 'Out for delivery today',
          icon: '🚗'
        },
        {
          status: 'delivered',
          timestamp: null,
          location: null,
          description: 'Delivered',
          icon: '✅'
        }
      ],
      updates: [
        {
          time: '2 hours ago',
          message: 'Package arrived at distribution center in Memphis',
          type: 'info'
        },
        {
          time: '8 hours ago',
          message: 'Package scanned in Chicago facility',
          type: 'info'
        },
        {
          time: '1 day ago',
          message: 'Shipping label created',
          type: 'info'
        }
      ]
    },
    'SHIP-002': {
      id: 'SHIP-002',
      orderId: 'ORD-12346',
      carrier: 'UPS',
      trackingNumber: '1Z999AA10123456784',
      status: 'delivered',
      currentLocation: 'Delivered',
      estimatedDelivery: '2026-01-22',
      estimatedDeliveryTime: 'Delivered',
      shippedDate: '2026-01-18',
      weight: '1.8 lbs',
      cost: '$8.99',
      recipient: {
        name: 'Jane Smith',
        address: '456 Oak Ave, Portland, OR 97201',
        phone: '555-0456'
      },
      timeline: [
        {
          status: 'picked-up',
          timestamp: '2026-01-18 09:00',
          location: 'Seattle, WA',
          description: 'Package picked up',
          icon: '📦'
        },
        {
          status: 'in-transit',
          timestamp: '2026-01-19 16:30',
          location: 'Portland, OR',
          description: 'In transit',
          icon: '🚚'
        },
        {
          status: 'out-for-delivery',
          timestamp: '2026-01-22 08:15',
          location: 'Portland, OR',
          description: 'Out for delivery',
          icon: '🚗'
        },
        {
          status: 'delivered',
          timestamp: '2026-01-22 14:45',
          location: 'Portland, OR',
          description: 'Delivered to recipient',
          icon: '✅'
        }
      ],
      updates: [
        {
          time: '2 days ago',
          message: 'Package delivered and signed for',
          type: 'success'
        },
        {
          time: '2 days ago',
          message: 'Out for delivery',
          type: 'info'
        }
      ],
      signedBy: 'J. Smith',
      proofOfDelivery: 'Signature on file'
    }
  };

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    const timer = setTimeout(() => {
      const data = mockShipments[shipmentId] || mockShipments['SHIP-001'];
      setShipment(data);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [shipmentId]);

  const calculateDaysUntilDelivery = () => {
    const delivery = new Date(shipment.estimatedDelivery);
    const today = new Date();
    const days = Math.ceil((delivery - today) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return '#10b981';
      case 'out-for-delivery':
        return '#f59e0b';
      case 'in-transit':
        return '#3b82f6';
      case 'picked-up':
        return '#8b5cf6';
      default:
        return '#6b7280';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'picked-up':
        return 'Picked Up';
      case 'in-transit':
        return 'In Transit';
      case 'out-for-delivery':
        return 'Out for Delivery';
      case 'delivered':
        return 'Delivered';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="delivery-tracking-modal">
        <div className="tracking-loader">
          <div className="spinner"></div>
          <p>Loading tracking information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="delivery-tracking-modal">
      <div className="tracking-container">
        {/* Header */}
        <div className="tracking-header">
          <div className="header-content">
            <h2>📦 Delivery Tracking</h2>
            <p className="tracking-number">
              Tracking: <strong>{shipment.trackingNumber}</strong>
            </p>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Status Bar */}
        <div className="status-bar">
          <div className="status-card status-primary">
            <div className="status-icon">📍</div>
            <div className="status-info">
              <div className="status-label">Current Status</div>
              <div className="status-value">{getStatusLabel(shipment.status)}</div>
              <div className="status-location">{shipment.currentLocation}</div>
            </div>
          </div>

          <div className="status-card">
            <div className="status-icon">🚚</div>
            <div className="status-info">
              <div className="status-label">Carrier</div>
              <div className="status-value">{shipment.carrier}</div>
              <div className="status-meta">Weight: {shipment.weight}</div>
            </div>
          </div>

          <div className="status-card">
            <div className="status-icon">📅</div>
            <div className="status-info">
              <div className="status-label">Estimated Delivery</div>
              <div className="status-value">{shipment.estimatedDelivery}</div>
              <div className="status-meta">{shipment.estimatedDeliveryTime}</div>
            </div>
          </div>
        </div>

        <div className="tracking-content">
          {/* Timeline */}
          <div className="tracking-section">
            <h3>📍 Delivery Timeline</h3>
            <div className="timeline">
              {shipment.timeline.map((event, idx) => (
                <div key={idx} className="timeline-event">
                  <div
                    className="timeline-dot"
                    style={{
                      backgroundColor: getStatusColor(event.status),
                      borderColor: getStatusColor(event.status)
                    }}
                  >
                    <span className="timeline-icon">{event.icon}</span>
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-status">{getStatusLabel(event.status)}</div>
                    <div className="timeline-location">{event.location}</div>
                    <div className="timeline-description">{event.description}</div>
                    {event.timestamp && (
                      <div className="timeline-time">{event.timestamp}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Updates */}
          <div className="tracking-section">
            <h3>📬 Recent Updates</h3>
            <div className="updates-list">
              {shipment.updates.map((update, idx) => (
                <div key={idx} className={`update-item update-${update.type}`}>
                  <div className="update-time">{update.time}</div>
                  <div className="update-message">{update.message}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recipient Info */}
          <div className="tracking-section">
            <h3>👤 Recipient Information</h3>
            <div className="recipient-card">
              <div className="recipient-name">{shipment.recipient.name}</div>
              <div className="recipient-address">{shipment.recipient.address}</div>
              <div className="recipient-phone">{shipment.recipient.phone}</div>
            </div>
          </div>

          {/* Delivery Instructions */}
          <div className="tracking-section">
            <h3>📝 Delivery Instructions</h3>
            <textarea
              className="delivery-instructions"
              placeholder="Add special instructions for delivery (e.g., Leave at door, Ring twice, Contact before delivery)"
              value={deliveryInstructions}
              onChange={(e) => setDeliveryInstructions(e.target.value)}
              rows="3"
            />
            <button className="instruction-save-btn">💾 Save Instructions</button>
          </div>

          {/* Notifications */}
          <div className="tracking-section">
            <h3>🔔 Notifications</h3>
            <div className="notifications-grid">
              <label className="notification-checkbox">
                <input
                  type="checkbox"
                  checked={notifications.sms}
                  onChange={(e) =>
                    setNotifications({ ...notifications, sms: e.target.checked })
                  }
                />
                <span>📱 SMS Updates</span>
              </label>
              <label className="notification-checkbox">
                <input
                  type="checkbox"
                  checked={notifications.email}
                  onChange={(e) =>
                    setNotifications({ ...notifications, email: e.target.checked })
                  }
                />
                <span>📧 Email Updates</span>
              </label>
              <label className="notification-checkbox">
                <input
                  type="checkbox"
                  checked={notifications.push}
                  onChange={(e) =>
                    setNotifications({ ...notifications, push: e.target.checked })
                  }
                />
                <span>🔔 Push Notifications</span>
              </label>
            </div>
          </div>

          {/* Proof of Delivery */}
          {shipment.status === 'delivered' && (
            <div className="tracking-section delivery-complete">
              <h3>✅ Delivery Complete</h3>
              <div className="proof-of-delivery">
                <div className="proof-item">
                  <div className="proof-label">Signed by:</div>
                  <div className="proof-value">{shipment.signedBy}</div>
                </div>
                <div className="proof-item">
                  <div className="proof-label">Proof of Delivery:</div>
                  <div className="proof-value">{shipment.proofOfDelivery}</div>
                </div>
                <button className="proof-btn">📸 View Proof Photos</button>
              </div>
            </div>
          )}

          {/* Countdown */}
          {shipment.status !== 'delivered' && (
            <div className="delivery-countdown">
              <div className="countdown-label">Arriving in:</div>
              <div className="countdown-value">{calculateDaysUntilDelivery()} days</div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="tracking-footer">
          <button className="contact-carrier-btn">📞 Contact {shipment.carrier}</button>
          <button className="report-issue-btn">⚠️ Report Issue</button>
          <button className="reschedule-btn">⏰ Reschedule Delivery</button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryTracking;
