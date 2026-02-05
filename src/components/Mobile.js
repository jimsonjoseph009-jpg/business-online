import React, { useState } from 'react';
import { useLocalization } from '../contexts/LocalizationContext';
import './Mobile.css';

const Mobile = () => {
  const { t } = useLocalization();
  const [buildStatus, setBuildStatus] = useState({
    ios: 'ready',
    android: 'ready',
    features: {
      qrScanning: true,
      pushNotifications: true,
      offlineMode: true,
      biometric: false,
      nfc: false
    }
  });

  const [appMetrics, setAppMetrics] = useState({
    downloads: 12500,
    activeUsers: 3200,
    avgRating: 4.7,
    reviews: 2340,
    bugReports: 12
  });

  const [features] = useState([
    {
      name: 'QR Code Scanning',
      description: 'Scan product QR codes for quick access to inventory',
      enabled: true,
      platform: 'iOS & Android'
    },
    {
      name: 'Push Notifications',
      description: 'Real-time alerts for orders, inventory, and promotions',
      enabled: true,
      platform: 'iOS & Android'
    },
    {
      name: 'Offline Mode',
      description: 'Browse and manage basic functions without internet',
      enabled: true,
      platform: 'iOS & Android'
    },
    {
      name: 'Biometric Authentication',
      description: 'Fingerprint and face recognition for secure login',
      enabled: false,
      platform: 'iOS & Android'
    },
    {
      name: 'NFC Payments',
      description: 'Accept payments via NFC card readers',
      enabled: false,
      platform: 'Android'
    },
  ]);

  const [releases, setReleases] = useState([
    {
      version: '1.2.0',
      date: '2024-01-26',
      status: 'released',
      features: ['QR scanning improvements', 'Performance optimization', 'Bug fixes'],
      downloadUrl: '#'
    },
    {
      version: '1.1.0',
      date: '2024-01-15',
      status: 'released',
      features: ['Offline mode', 'Push notifications', 'UI redesign'],
      downloadUrl: '#'
    },
    {
      version: '1.3.0',
      date: '2024-02-15',
      status: 'in_development',
      features: ['Biometric auth', 'Enhanced security', 'New dashboard'],
      downloadUrl: null
    },
  ]);

  const handleBuild = (platform) => {
    alert(`Building ${platform} app...`);
  };

  return (
    <div className="mobile-app">
      <div className="page-header">
        <h1>📱 {t('mobile', 'title')}</h1>
        <p>{t('mobile', 'description')}</p>
      </div>

      {/* Download Section */}
      <div className="download-section">
        <h2>{t('mobile', 'downloadApp')}</h2>
        <div className="download-buttons">
          <a href="#" className="download-btn ios">
            <span className="icon">🍎</span>
            <div className="btn-content">
              <p>Download for</p>
              <strong>iOS</strong>
            </div>
          </a>
          <a href="#" className="download-btn android">
            <span className="icon">🤖</span>
            <div className="btn-content">
              <p>Download for</p>
              <strong>Android</strong>
            </div>
          </a>
        </div>
      </div>

      {/* App Metrics */}
      <div className="app-metrics">
        <div className="metric-card">
          <h3>{appMetrics.downloads.toLocaleString()}</h3>
          <p>{t('mobile', 'downloads')}</p>
        </div>
        <div className="metric-card">
          <h3>{appMetrics.activeUsers.toLocaleString()}</h3>
          <p>{t('mobile', 'activeUsers')}</p>
        </div>
        <div className="metric-card">
          <h3>⭐ {appMetrics.avgRating}</h3>
          <p>{appMetrics.reviews.toLocaleString()} {t('mobile', 'reviews')}</p>
        </div>
        <div className="metric-card">
          <h3>{appMetrics.bugReports}</h3>
          <p>{t('mobile', 'bugReports')}</p>
        </div>
      </div>

      {/* Features */}
      <div className="mobile-features">
        <h2>🎯 {t('mobile', 'features')}</h2>
        <div className="features-grid">
          {features.map((feature, idx) => (
            <div key={idx} className={`feature-card ${feature.enabled ? 'enabled' : 'disabled'}`}>
              <div className="feature-header">
                <h3>{feature.name}</h3>
                <span className={`status-badge ${feature.enabled ? 'enabled' : 'coming'}`}>
                  {feature.enabled ? '✓ Available' : '🔜 Coming'}
                </span>
              </div>
              <p className="feature-description">{feature.description}</p>
              <p className="feature-platform">{t('mobile', 'platforms')}: {feature.platform}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Build Management */}
      <div className="build-management">
        <h2>🛠️ {t('mobile', 'buildManagement')}</h2>
        <div className="build-controls">
          <div className="build-card">
            <h3>iOS Build</h3>
            <p>{t('mobile', 'status')}: <span className={`status ${buildStatus.ios}`}>{buildStatus.ios}</span></p>
            <button className="btn-primary" onClick={() => handleBuild('iOS')}>
              {t('mobile', 'buildNow')}
            </button>
          </div>

          <div className="build-card">
            <h3>Android Build</h3>
            <p>{t('mobile', 'status')}: <span className={`status ${buildStatus.android}`}>{buildStatus.android}</span></p>
            <button className="btn-primary" onClick={() => handleBuild('Android')}>
              {t('mobile', 'buildNow')}
            </button>
          </div>
        </div>
      </div>

      {/* Release Timeline */}
      <div className="release-timeline">
        <h2>📅 {t('mobile', 'releaseHistory')}</h2>
        <div className="releases-list">
          {releases.map((release, idx) => (
            <div key={idx} className={`release-item ${release.status}`}>
              <div className="release-info">
                <h3>v{release.version}</h3>
                <p className="release-date">{release.date}</p>
                <p className="release-status">{t('mobile', `status${release.status.charAt(0).toUpperCase() + release.status.slice(1)}`)}</p>
              </div>

              <div className="release-features">
                <h4>{t('mobile', 'features')}:</h4>
                <ul>
                  {release.features.map((feature, i) => (
                    <li key={i}>{feature}</li>
                  ))}
                </ul>
              </div>

              {release.downloadUrl && (
                <a href={release.downloadUrl} className="btn-small download">
                  {t('mobile', 'download')}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Documentation */}
      <div className="mobile-documentation">
        <h2>📖 {t('mobile', 'documentation')}</h2>
        <div className="docs-grid">
          <div className="doc-card">
            <h3>{t('mobile', 'gettingStarted')}</h3>
            <p>Installation and setup guide for the mobile app</p>
            <a href="#" className="btn-small">Read →</a>
          </div>
          <div className="doc-card">
            <h3>{t('mobile', 'apiReference')}</h3>
            <p>Complete API documentation for mobile development</p>
            <a href="#" className="btn-small">Read →</a>
          </div>
          <div className="doc-card">
            <h3>{t('mobile', 'troubleshooting')}</h3>
            <p>Common issues and solutions</p>
            <a href="#" className="btn-small">Read →</a>
          </div>
        </div>
      </div>

      {/* Developer Resources */}
      <div className="developer-resources">
        <h2>👨‍💻 {t('mobile', 'developerResources')}</h2>
        <p>React Native application for iOS and Android platforms</p>
        <div className="resource-links">
          <a href="#" className="resource-link">GitHub Repository →</a>
          <a href="#" className="resource-link">Development Guide →</a>
          <a href="#" className="resource-link">API Keys & Configuration →</a>
        </div>
      </div>
    </div>
  );
};

export default Mobile;
