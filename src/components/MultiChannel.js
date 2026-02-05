import React, { useState } from 'react';
import { useLocalization } from '../contexts/LocalizationContext';
import './MultiChannel.css';

const MultiChannel = () => {
  const { t } = useLocalization();
  const [channels, setChannels] = useState([
    {
      id: 1,
      name: 'Shopify',
      type: 'ecommerce',
      status: 'connected',
      logo: '🛍️',
      products: 245,
      orders: 1256,
      lastSync: '2024-01-26 14:32',
      apiKey: 'shp_***_***_abc123',
      inventorySync: true,
      orderSync: true
    },
    {
      id: 2,
      name: 'WooCommerce',
      type: 'ecommerce',
      status: 'connected',
      logo: '🏪',
      products: 189,
      orders: 854,
      lastSync: '2024-01-26 13:15',
      apiKey: 'woo_***_***_def456',
      inventorySync: true,
      orderSync: true
    },
    {
      id: 3,
      name: 'Amazon',
      type: 'marketplace',
      status: 'disconnected',
      logo: '📦',
      products: 0,
      orders: 0,
      lastSync: 'Never',
      apiKey: null,
      inventorySync: false,
      orderSync: false
    },
    {
      id: 4,
      name: 'Facebook Shop',
      type: 'social',
      status: 'connected',
      logo: '📱',
      products: 150,
      orders: 432,
      lastSync: '2024-01-26 14:00',
      apiKey: 'fb_***_***_ghi789',
      inventorySync: false,
      orderSync: true
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [syncStatus, setSyncStatus] = useState({});

  const handleSyncChannel = (channelId) => {
    setSyncStatus({ ...syncStatus, [channelId]: 'syncing' });
    setTimeout(() => {
      setSyncStatus({ ...syncStatus, [channelId]: 'success' });
      setTimeout(() => {
        setSyncStatus({ ...syncStatus, [channelId]: null });
      }, 3000);
    }, 2000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return '#4CAF50';
      case 'disconnected': return '#f44336';
      case 'error': return '#ff9800';
      default: return '#999';
    }
  };

  return (
    <div className="multi-channel">
      <div className="page-header">
        <h1>🌐 {t('multichannel', 'title')}</h1>
        <p>{t('multichannel', 'description')}</p>
      </div>

      {/* Channel Stats */}
      <div className="channel-stats">
        <div className="stat-card">
          <h3>{channels.filter(c => c.status === 'connected').length}</h3>
          <p>{t('multichannel', 'connectedChannels')}</p>
        </div>
        <div className="stat-card">
          <h3>{channels.reduce((sum, c) => sum + c.products, 0)}</h3>
          <p>{t('multichannel', 'totalProducts')}</p>
        </div>
        <div className="stat-card">
          <h3>{channels.reduce((sum, c) => sum + c.orders, 0)}</h3>
          <p>{t('multichannel', 'totalOrders')}</p>
        </div>
      </div>

      {/* Channels Grid */}
      <div className="channels-grid">
        {channels.map((channel) => (
          <div key={channel.id} className={`channel-card ${channel.status}`}>
            <div className="channel-header">
              <span className="channel-logo">{channel.logo}</span>
              <div className="channel-title">
                <h3>{channel.name}</h3>
                <span className="channel-type">{channel.type}</span>
              </div>
              <span className="status-indicator" style={{ backgroundColor: getStatusColor(channel.status) }} title={channel.status}>
                ●
              </span>
            </div>

            <div className="channel-details">
              <div className="detail-row">
                <span className="label">{t('multichannel', 'status')}:</span>
                <span className="value status">{channel.status}</span>
              </div>
              <div className="detail-row">
                <span className="label">{t('multichannel', 'products')}:</span>
                <span className="value">{channel.products}</span>
              </div>
              <div className="detail-row">
                <span className="label">{t('multichannel', 'orders')}:</span>
                <span className="value">{channel.orders}</span>
              </div>
              <div className="detail-row">
                <span className="label">{t('multichannel', 'lastSync')}:</span>
                <span className="value">{channel.lastSync}</span>
              </div>
            </div>

            <div className="channel-sync-status">
              {channel.inventorySync && (
                <span className="sync-badge inventory">📦 {t('multichannel', 'inventorySync')}</span>
              )}
              {channel.orderSync && (
                <span className="sync-badge order">🛒 {t('multichannel', 'orderSync')}</span>
              )}
            </div>

            <div className="channel-actions">
              <button
                className="btn-small"
                onClick={() => handleSyncChannel(channel.id)}
                disabled={syncStatus[channel.id] === 'syncing'}
              >
                {syncStatus[channel.id] === 'syncing' ? '⏳ Syncing...' : '🔄 Sync Now'}
              </button>
              {syncStatus[channel.id] === 'success' && <span className="sync-success">✓ Synced</span>}
              <button className="btn-small" onClick={() => {
                setSelectedChannel(channel);
                setShowModal(true);
              }}>
                {t('common', 'settings')}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Channel Section */}
      <div className="add-channel-section">
        <h3>{t('multichannel', 'availableChannels')}</h3>
        <div className="available-channels">
          <div className="available-channel">
            <h4>Etsy</h4>
            <p>Sell on Etsy marketplace</p>
            <button className="btn-small">{t('multichannel', 'connect')}</button>
          </div>
          <div className="available-channel">
            <h4>eBay</h4>
            <p>Connect eBay store</p>
            <button className="btn-small">{t('multichannel', 'connect')}</button>
          </div>
          <div className="available-channel">
            <h4>Instagram Shopping</h4>
            <p>Sell on Instagram</p>
            <button className="btn-small">{t('multichannel', 'connect')}</button>
          </div>
          <div className="available-channel">
            <h4>TikTok Shop</h4>
            <p>Set up TikTok Shop</p>
            <button className="btn-small">{t('multichannel', 'connect')}</button>
          </div>
        </div>
      </div>

      {/* Sync Overview */}
      <div className="sync-overview">
        <h3>{t('multichannel', 'syncOverview')}</h3>
        <div className="sync-timeline">
          <div className="sync-event">
            <span className="time">14:32</span>
            <span className="event">Shopify inventory synced (245 products)</span>
            <span className="status success">✓</span>
          </div>
          <div className="sync-event">
            <span className="time">13:15</span>
            <span className="event">WooCommerce orders imported (12 orders)</span>
            <span className="status success">✓</span>
          </div>
          <div className="sync-event">
            <span className="time">14:00</span>
            <span className="event">Facebook Shop product update (150 items)</span>
            <span className="status success">✓</span>
          </div>
          <div className="sync-event">
            <span className="time">12:45</span>
            <span className="event">Customer data consolidated</span>
            <span className="status success">✓</span>
          </div>
        </div>
      </div>

      {/* Channel Modal */}
      {showModal && selectedChannel && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{selectedChannel.name} {t('common', 'settings')}</h3>
            <ChannelSettingsForm
              channel={selectedChannel}
              onClose={() => setShowModal(false)}
              t={t}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const ChannelSettingsForm = ({ channel, onClose, t }) => {
  const [settings, setSettings] = useState({
    apiKey: channel.apiKey || '',
    inventorySync: channel.inventorySync,
    orderSync: channel.orderSync,
    autoUpdate: true,
    updateFrequency: 'hourly'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Settings saved successfully!');
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="channel-settings-form">
      <div className="form-group">
        <label>{t('multichannel', 'apiKey')}</label>
        <input
          type="password"
          value={settings.apiKey}
          onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
          placeholder="Enter your API key"
        />
      </div>

      <div className="form-group checkbox">
        <label>
          <input
            type="checkbox"
            checked={settings.inventorySync}
            onChange={(e) => setSettings({ ...settings, inventorySync: e.target.checked })}
          />
          {t('multichannel', 'inventorySync')}
        </label>
      </div>

      <div className="form-group checkbox">
        <label>
          <input
            type="checkbox"
            checked={settings.orderSync}
            onChange={(e) => setSettings({ ...settings, orderSync: e.target.checked })}
          />
          {t('multichannel', 'orderSync')}
        </label>
      </div>

      <div className="form-group">
        <label>{t('multichannel', 'updateFrequency')}</label>
        <select value={settings.updateFrequency} onChange={(e) => setSettings({ ...settings, updateFrequency: e.target.value })}>
          <option value="realtime">{t('multichannel', 'realtime')}</option>
          <option value="hourly">{t('multichannel', 'hourly')}</option>
          <option value="daily">{t('multichannel', 'daily')}</option>
        </select>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-primary">{t('common', 'save')}</button>
        <button type="button" className="btn-secondary" onClick={onClose}>{t('common', 'cancel')}</button>
      </div>
    </form>
  );
};

export default MultiChannel;
