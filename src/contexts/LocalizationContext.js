import React, { createContext, useState, useEffect } from 'react';
import { getTranslation } from '../utils/localization';

export const LocalizationContext = createContext();

export const LocalizationProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });

  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('currency') || 'USD';
  });

  // Save language preference
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Save currency preference
  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  const t = (section, key) => {
    return getTranslation(language, section, key);
  };

  const value = {
    language,
    setLanguage,
    currency,
    setCurrency,
    t,
  };

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = () => {
  const context = React.useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalization must be used within LocalizationProvider');
  }
  return context;
};

export default LocalizationContext;
