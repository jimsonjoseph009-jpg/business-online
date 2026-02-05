import React, { useState, useEffect } from 'react';
import { settingsAPI } from '../utils/apiClient';
import { useLocalization } from '../contexts/LocalizationContext';
import { formatCurrency } from '../utils/currencyManager';
import './Settings.css';

const Settings = () => {
  const { language, setLanguage, currency, setCurrency, t } = useLocalization();
  
  const [settings, setSettings] = useState({
    storeName: 'HEISWALKER_23 Online Shop',
    storeEmail: 'support@heiswalker23.com',
    storePhone: '+255 123 456 789',
    storeAddress: 'Dar es Salaam, Tanzania',
    taxRate: 8,
    shippingCost: 9.99,
    notificationsEmail: true,
    notificationsSMS: false,
    maintenanceMode: false,
    autoBackup: true
  });

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [previewCurrency, setPreviewCurrency] = useState(currency);

  // Load settings from localStorage on mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      
      // First, try to load from localStorage
      const savedSettings = localStorage.getItem('appSettings');
      if (savedSettings) {
        try {
          const parsedSettings = JSON.parse(savedSettings);
          setSettings(parsedSettings);
          setLoading(false);
          return;
        } catch (parseError) {
          console.log('Failed to parse localStorage settings');
        }
      }
      
      // If no localStorage, try API
      try {
        const data = await settingsAPI.get();
        setSettings(data);
      } catch (apiError) {
        console.log('Using default settings - API not available');
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handleCurrencyChange = (e) => {
    const newCurrency = e.target.value;
    setPreviewCurrency(newCurrency);
    setCurrency(newCurrency);
  };

  const handleSave = async () => {
    try {
      // Save to localStorage (temporary storage)
      localStorage.setItem('appSettings', JSON.stringify(settings));
      
      // Also try to save to API if available
      try {
        await settingsAPI.update(settings);
      } catch (apiError) {
        console.log('Settings saved to localStorage (API not available)');
      }
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  if (loading) {
    return (
      <div className="settings">
        <div className="settings-loader">
          <div className="spinner"></div>
          <p>Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="settings">
      <div className="page-header">
        <h1>⚙️ {t('settings', 'title')}</h1>
        <p>{t('settings', 'description')}</p>
      </div>

      {saved && <div className="success-message">✓ {t('settings', 'settingsSaved')}</div>}

      <div className="settings-container">
        {/* General Settings */}
        <div className="settings-section">
          <h3>📝 {t('settings', 'general')}</h3>
          
          <div className="form-group">
            <label>{t('settings', 'storeName')}</label>
            <input
              type="text"
              name="storeName"
              value={settings.storeName}
              onChange={handleChange}
              placeholder={t('settings', 'storeName')}
            />
          </div>

          <div className="form-group">
            <label>{t('settings', 'storeEmail')}</label>
            <input
              type="email"
              name="storeEmail"
              value={settings.storeEmail}
              onChange={handleChange}
              placeholder={t('settings', 'storeEmail')}
            />
          </div>

          <div className="form-group">
            <label>{t('settings', 'storePhone')}</label>
            <input
              type="tel"
              name="storePhone"
              value={settings.storePhone}
              onChange={handleChange}
              placeholder={t('settings', 'storePhone')}
            />
          </div>

          <div className="form-group">
            <label>{t('settings', 'storeAddress')}</label>
            <input
              type="text"
              name="storeAddress"
              value={settings.storeAddress}
              onChange={handleChange}
              placeholder={t('settings', 'storeAddress')}
            />
          </div>
        </div>

        {/* Language & Localization */}
        <div className="settings-section">
          <h3>🌍 {t('settings', 'languages')}</h3>
          
          <div className="form-group">
            <label>{t('settings', 'selectLanguage')}</label>
            <select value={language} onChange={handleLanguageChange} className="language-select">
              <option value="en">{t('settings', 'english')}</option>
              <option value="sw">{t('settings', 'swahili')}</option>
            </select>
            <small className="help-text">
              {language === 'en' 
                ? 'Current language: English' 
                : 'Lugha ya sasa: Kiswahili'}
            </small>
          </div>
        </div>

        {/* Currency & Financial */}
        <div className="settings-section">
          <h3>💰 {t('settings', 'currencies')}</h3>
          
          <div className="form-group">
            <label>{t('settings', 'selectCurrency')}</label>
            <select value={previewCurrency} onChange={handleCurrencyChange} className="currency-select">
              <option value="USD">{t('settings', 'usd')}</option>
              <option value="TZS">{t('settings', 'tzs')}</option>
              <option value="EUR">{t('settings', 'eur')}</option>
            </select>
            <small className="help-text">
              Currency preview: {formatCurrency(1000, previewCurrency)}
            </small>
          </div>

          <div className="form-group">
            <label>{t('settings', 'taxRate')} (%)</label>
            <input
              type="number"
              name="taxRate"
              value={settings.taxRate}
              onChange={handleChange}
              min="0"
              max="100"
              step="0.1"
              placeholder="8"
            />
          </div>

          <div className="form-group">
            <label>{t('settings', 'shippingSettings')} ({formatCurrency(settings.shippingCost, previewCurrency)})</label>
            <input
              type="number"
              name="shippingCost"
              value={settings.shippingCost}
              onChange={handleChange}
              min="0"
              step="0.01"
              placeholder="9.99"
            />
          </div>
        </div>

        {/* Notifications */}
        <div className="settings-section">
          <h3>🔔 {t('settings', 'notifications')}</h3>
          
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="notificationsEmail"
                checked={settings.notificationsEmail}
                onChange={handleChange}
              />
              <span>{t('settings', 'emailNotifications')}</span>
            </label>
          </div>

          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="notificationsSMS"
                checked={settings.notificationsSMS}
                onChange={handleChange}
              />
              <span>{t('settings', 'smsNotifications')}</span>
            </label>
          </div>
        </div>

        {/* System Settings */}
        <div className="settings-section">
          <h3>🛠️ {t('settings', 'security')}</h3>
          
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="maintenanceMode"
                checked={settings.maintenanceMode}
                onChange={handleChange}
              />
              <span>Maintenance Mode</span>
            </label>
          </div>

          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="autoBackup"
                checked={settings.autoBackup}
                onChange={handleChange}
              />
              <span>{t('settings', 'backup')}</span>
            </label>
          </div>
        </div>
      </div>

      <div className="settings-footer">
        <button className="btn-save" onClick={handleSave}>
          💾 {t('settings', 'saveSettings')}
        </button>
      </div>
    </div>
  );
};

export default Settings;
