import React, { useState, useEffect } from 'react';
import { useLocalization } from '../contexts/LocalizationContext';
import { auth } from '../config/firebase';
import './Notifications.css';

const Notifications = () => {
  const { t } = useLocalization();
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    filterNotifications(filter);
  }, [notifications, filter]);

  const fetchNotifications = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const token = await user.getIdToken();
      const response = await fetch('/api/notifications', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setNotifications(data || []);
      setUnreadCount((data || []).filter(n => !n.read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const filterNotifications = (type) => {
    if (type === 'all') {
      setFilteredNotifications(notifications);
    } else {
      setFilteredNotifications(notifications.filter(n => n.type === type));
    }
    setFilter(type);
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const token = await user.getIdToken();
      await fetch(`/api/notifications/${notificationId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ read: true })
      });

      setNotifications(
        notifications.map(n =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const token = await user.getIdToken();
      await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      setNotifications(notifications.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const token = await user.getIdToken();
      const unreadIds = notifications.filter(n => !n.read).map(n => n.id);

      await Promise.all(
        unreadIds.map(id =>
          fetch(`/api/notifications/${id}`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ read: true })
          })
        )
      );

      setNotifications(
        notifications.map(n => ({ ...n, read: true }))
      );
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order':
        return '🛒';
      case 'payment':
        return '💳';
      case 'message':
        return '💬';
      case 'review':
        return '⭐';
      case 'customer':
        return '👥';
      case 'inventory':
        return '📦';
      default:
        return '🔔';
    }
  };

  const getNotificationTypeLabel = (type) => {
    const typeLabels = {
      order: 'orderNotification',
      payment: 'paymentNotification',
      message: 'messageNotification',
      review: 'reviewNotification',
      customer: 'customerNotification',
      inventory: 'inventoryNotification'
    };
    return t('notifications', typeLabels[type]) || type;
  };

  return (
    <div className="notifications">
      <div className="notifications-header">
        <h1 className="notifications-title">
          🔔 {t('notifications', 'title') || 'Notifications'}
        </h1>
        <div className="notifications-stats">
          <span className="unread-badge">{unreadCount}</span>
          <span className="stat-text">{t('notifications', 'unread') || 'Unread'}</span>
        </div>
      </div>

      <div className="notifications-container">
        {/* Filter Sidebar */}
        <div className="filter-panel">
          <div className="filter-header">
            <h3>{t('notifications', 'filter') || 'Filter'}</h3>
            {unreadCount > 0 && (
              <button
                className="btn-mark-all"
                onClick={handleMarkAllAsRead}
                title={t('notifications', 'markAllRead') || 'Mark all as read'}
              >
                ✓ {t('notifications', 'markAllRead') || 'Mark All Read'}
              </button>
            )}
          </div>

          <div className="filter-buttons">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => filterNotifications('all')}
            >
              🔔 {t('notifications', 'allNotifications') || 'All'}
              <span className="count">{notifications.length}</span>
            </button>
            <button
              className={`filter-btn ${filter === 'order' ? 'active' : ''}`}
              onClick={() => filterNotifications('order')}
            >
              🛒 {t('notifications', 'orders') || 'Orders'}
              <span className="count">{notifications.filter(n => n.type === 'order').length}</span>
            </button>
            <button
              className={`filter-btn ${filter === 'payment' ? 'active' : ''}`}
              onClick={() => filterNotifications('payment')}
            >
              💳 {t('notifications', 'payments') || 'Payments'}
              <span className="count">{notifications.filter(n => n.type === 'payment').length}</span>
            </button>
            <button
              className={`filter-btn ${filter === 'message' ? 'active' : ''}`}
              onClick={() => filterNotifications('message')}
            >
              💬 {t('notifications', 'messages') || 'Messages'}
              <span className="count">{notifications.filter(n => n.type === 'message').length}</span>
            </button>
            <button
              className={`filter-btn ${filter === 'review' ? 'active' : ''}`}
              onClick={() => filterNotifications('review')}
            >
              ⭐ {t('notifications', 'reviews') || 'Reviews'}
              <span className="count">{notifications.filter(n => n.type === 'review').length}</span>
            </button>
            <button
              className={`filter-btn ${filter === 'customer' ? 'active' : ''}`}
              onClick={() => filterNotifications('customer')}
            >
              👥 {t('notifications', 'customers') || 'Customers'}
              <span className="count">{notifications.filter(n => n.type === 'customer').length}</span>
            </button>
            <button
              className={`filter-btn ${filter === 'inventory' ? 'active' : ''}`}
              onClick={() => filterNotifications('inventory')}
            >
              📦 {t('notifications', 'inventory') || 'Inventory'}
              <span className="count">{notifications.filter(n => n.type === 'inventory').length}</span>
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="notifications-list">
          {filteredNotifications.length === 0 ? (
            <div className="empty-state">
              <p className="empty-emoji">🎉</p>
              <p className="empty-text">{t('notifications', 'noNotifications') || 'No notifications'}</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`notification-item ${!notification.read ? 'unread' : ''}`}
              >
                <div className="notification-icon">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="notification-content">
                  <div className="notification-header">
                    <h4 className="notification-title">{notification.title}</h4>
                    <span className="notification-type">
                      {getNotificationTypeLabel(notification.type)}
                    </span>
                  </div>
                  <p className="notification-message">{notification.message}</p>
                  <div className="notification-footer">
                    <span className="notification-time">
                      {new Date(notification.createdAt).toLocaleString()}
                    </span>
                    {notification.metadata && (
                      <span className="notification-meta">
                        ID: {notification.metadata}
                      </span>
                    )}
                  </div>
                </div>
                <div className="notification-actions">
                  {!notification.read && (
                    <button
                      className="action-btn read-btn"
                      onClick={() => handleMarkAsRead(notification.id)}
                      title={t('notifications', 'markAsRead') || 'Mark as read'}
                    >
                      ✓
                    </button>
                  )}
                  <button
                    className="action-btn delete-btn"
                    onClick={() => handleDeleteNotification(notification.id)}
                    title={t('notifications', 'delete') || 'Delete'}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
