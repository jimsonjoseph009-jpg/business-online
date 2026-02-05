import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLocalization } from '../contexts/LocalizationContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import DraggableLogo from './DraggableLogo';
import './Layout.css';

const Layout = ({ children }) => {
  const { currentUser, logout } = useAuth();
  const { t } = useLocalization();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const navItems = [
    { path: '/dashboard', label: t('sidebar', 'dashboard') || 'Dashboard', icon: '📊' },
    { path: '/demo', label: '✨ Demo Data', icon: '✨' },
    { path: '/mobile-qr', label: '📱 Mobile QR Code', icon: '📱' },
    { path: '/admin', label: '🛠️ Admin Panel', icon: '🛠️' },
    { path: '/calendar', label: t('calendar', 'title') || 'Calendar', icon: '📅' },
    { path: '/analytics', label: t('analytics', 'title') || 'Analytics', icon: '📈' },
    { path: '/customers', label: t('sidebar', 'customers') || 'Customers', icon: '👥' },
    { path: '/crm', label: t('crm', 'title') || 'CRM', icon: '💼' },
    { path: '/products', label: t('sidebar', 'products') || 'Products', icon: '📦' },
    { path: '/orders', label: t('sidebar', 'orders') || 'Orders', icon: '🛒' },
    { path: '/payments', label: t('sidebar', 'payments') || 'Payments', icon: '💳' },
    { path: '/advanced-payments', label: t('payments', 'title') || 'Advanced Payments', icon: '💰' },
    { path: '/inventory', label: t('inventory', 'title') || 'Inventory', icon: '📋' },
    { path: '/forecasting', label: t('forecasting', 'title') || 'Forecasting', icon: '🔮' },
    { path: '/discounts', label: t('discounts', 'title') || 'Discounts', icon: '🏷️' },
    { path: '/email-campaigns', label: t('campaigns', 'title') || 'Campaigns', icon: '📧' },
    { path: '/shipping', label: t('shipping', 'title') || 'Shipping', icon: '🚚' },
    { path: '/advanced-shipping', label: t('shipping', 'title') + ' (Advanced)' || 'Advanced Shipping', icon: '🚛' },
    { path: '/invoices', label: t('invoices', 'title') || 'Invoices', icon: '📄' },
    { path: '/reviews', label: t('reviews', 'title') || 'Reviews', icon: '⭐' },
    { path: '/messages', label: t('messages', 'title') || 'Messages', icon: '💬' },
    { path: '/live-chat', label: t('liveChat', 'title') || 'Live Chat', icon: '💬' },
    { path: '/notifications', label: t('notifications', 'title') || 'Notifications', icon: '🔔' },
    { path: '/search-analytics', label: t('searchAnalytics', 'title') || 'Search Analytics', icon: '🔍' },
    { path: '/workflows', label: t('workflows', 'title') || 'Workflows', icon: '⚙️' },
    { path: '/rbac', label: t('rbac', 'title') || 'Access Control', icon: '🔐' },
    { path: '/business-intelligence', label: t('bi', 'title') || 'Business Intelligence', icon: '🎯' },
    { path: '/multi-channel', label: t('multichannel', 'title') || 'Multi-Channel', icon: '🌐' },
    { path: '/mobile', label: t('mobile', 'title') || 'Mobile App', icon: '📱' },
    { path: '/settings', label: t('common', 'settings') || 'Settings', icon: '⚙️' },
    { path: '/reports', label: t('reports', 'title') || 'Reports', icon: '📊' }
  ];

  return (
    <div className="layout">
      <DraggableLogo />
      <nav className="navbar">
        <div className="nav-content">
          <div className="logo-section">
            <img src="/heiswalker-logo.svg" alt="HEISWALKER_304 Logo" className="navbar-logo" />
            <h1 className="nav-logo">HEISWALKER_304 ONLINE SHOP</h1>
          </div>
          <div className="nav-right">
            <span className="user-email">{currentUser?.email}</span>
            <button onClick={handleLogout} className="logout-button">
              {t('common', 'logout')}
            </button>
          </div>
        </div>
      </nav>
      
      <div className="layout-container">
        <aside className="sidebar">
          <nav className="sidebar-nav">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>
        
        <main className="layout-body">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
