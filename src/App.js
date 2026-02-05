import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LocalizationProvider } from './contexts/LocalizationContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Customers from './components/Customers';
import Products from './components/Products';
import Orders from './components/Orders';
import PaymentHistory from './components/PaymentHistory';
import Inventory from './components/Inventory';
import Discounts from './components/Discounts';
import EmailCampaigns from './components/EmailCampaigns';
import Shipping from './components/Shipping';
import Invoices from './components/Invoices';
import Reviews from './components/Reviews';
import Messages from './components/Messages';
import Settings from './components/Settings';
import Reports from './components/Reports';
import Analytics from './components/Analytics';
import CRM from './components/CRM';
import RBAC from './components/RBAC';
import Workflows from './components/Workflows';
import Forecasting from './components/Forecasting';
import AdvancedPayments from './components/AdvancedPayments';
import AdvancedShipping from './components/AdvancedShipping';
import BusinessIntelligence from './components/BusinessIntelligence';
import MultiChannel from './components/MultiChannel';
import Mobile from './components/Mobile';
import Calendar from './components/Calendar';
import LiveChat from './components/LiveChat';
import Notifications from './components/Notifications';
import SearchAnalytics from './components/SearchAnalytics';
import AdminPanel from './components/AdminPanel';
import MobileQRCode from './components/MobileQRCode';
import DemoDataLoader from './components/DemoDataLoader';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <LocalizationProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/customers"
            element={
              <PrivateRoute>
                <Layout>
                  <Customers />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/products"
            element={
              <PrivateRoute>
                <Layout>
                  <Products />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <PrivateRoute>
                <Layout>
                  <Orders />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/payments"
            element={
              <PrivateRoute>
                <Layout>
                  <PaymentHistory />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/inventory"
            element={
              <PrivateRoute>
                <Layout>
                  <Inventory />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/discounts"
            element={
              <PrivateRoute>
                <Layout>
                  <Discounts />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/email-campaigns"
            element={
              <PrivateRoute>
                <Layout>
                  <EmailCampaigns />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/shipping"
            element={
              <PrivateRoute>
                <Layout>
                  <Shipping />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/invoices"
            element={
              <PrivateRoute>
                <Layout>
                  <Invoices />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/reviews"
            element={
              <PrivateRoute>
                <Layout>
                  <Reviews />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <PrivateRoute>
                <Layout>
                  <Messages />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <Layout>
                  <Settings />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <PrivateRoute>
                <Layout>
                  <Reports />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <PrivateRoute>
                <Layout>
                  <Analytics />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/crm"
            element={
              <PrivateRoute>
                <Layout>
                  <CRM />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/rbac"
            element={
              <PrivateRoute>
                <Layout>
                  <RBAC />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/workflows"
            element={
              <PrivateRoute>
                <Layout>
                  <Workflows />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/forecasting"
            element={
              <PrivateRoute>
                <Layout>
                  <Forecasting />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/advanced-payments"
            element={
              <PrivateRoute>
                <Layout>
                  <AdvancedPayments />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/advanced-shipping"
            element={
              <PrivateRoute>
                <Layout>
                  <AdvancedShipping />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/business-intelligence"
            element={
              <PrivateRoute>
                <Layout>
                  <BusinessIntelligence />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/multi-channel"
            element={
              <PrivateRoute>
                <Layout>
                  <MultiChannel />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/mobile"
            element={
              <PrivateRoute>
                <Layout>
                  <Mobile />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <PrivateRoute>
                <Layout>
                  <Calendar />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/live-chat"
            element={
              <PrivateRoute>
                <Layout>
                  <LiveChat />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <PrivateRoute>
                <Layout>
                  <Notifications />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/search-analytics"
            element={
              <PrivateRoute>
                <Layout>
                  <SearchAnalytics />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <Layout>
                  <AdminPanel />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/mobile-qr"
            element={<MobileQRCode />}
          />
          <Route
            path="/demo"
            element={<DemoDataLoader />}
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
        </LocalizationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
