// API utilities for backend communication
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Generic API call handler
const apiCall = async (endpoint, method = 'GET', data = null) => {
  const token = localStorage.getItem('authToken');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };

  const config = {
    method,
    headers
  };

  if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Inventory APIs
export const inventoryAPI = {
  getAll: () => apiCall('/inventory'),
  getById: (id) => apiCall(`/inventory/${id}`),
  create: (data) => apiCall('/inventory', 'POST', data),
  update: (id, data) => apiCall(`/inventory/${id}`, 'PUT', data),
  delete: (id) => apiCall(`/inventory/${id}`, 'DELETE'),
  updateStock: (id, quantity) => apiCall(`/inventory/${id}/stock`, 'PATCH', { quantity }),
  bulkUpdate: (updates) => apiCall('/inventory/bulk', 'POST', { updates })
};

// Discount APIs
export const discountAPI = {
  getAll: () => apiCall('/discounts'),
  getById: (id) => apiCall(`/discounts/${id}`),
  create: (data) => apiCall('/discounts', 'POST', data),
  update: (id, data) => apiCall(`/discounts/${id}`, 'PUT', data),
  delete: (id) => apiCall(`/discounts/${id}`, 'DELETE'),
  validateCode: (code) => apiCall(`/discounts/validate/${code}`, 'GET'),
  getStats: () => apiCall('/discounts/stats', 'GET')
};

// Email Campaign APIs
export const campaignAPI = {
  getAll: () => apiCall('/campaigns'),
  getById: (id) => apiCall(`/campaigns/${id}`),
  create: (data) => apiCall('/campaigns', 'POST', data),
  update: (id, data) => apiCall(`/campaigns/${id}`, 'PUT', data),
  delete: (id) => apiCall(`/campaigns/${id}`, 'DELETE'),
  send: (id) => apiCall(`/campaigns/${id}/send`, 'POST'),
  getStats: (id) => apiCall(`/campaigns/${id}/stats`, 'GET'),
  getAnalytics: () => apiCall('/campaigns/analytics', 'GET')
};

// Shipping APIs
export const shippingAPI = {
  getAll: () => apiCall('/shipments'),
  getById: (id) => apiCall(`/shipments/${id}`),
  create: (data) => apiCall('/shipments', 'POST', data),
  update: (id, data) => apiCall(`/shipments/${id}`, 'PUT', data),
  delete: (id) => apiCall(`/shipments/${id}`, 'DELETE'),
  track: (trackingNumber) => apiCall(`/shipments/track/${trackingNumber}`, 'GET'),
  updateStatus: (id, status) => apiCall(`/shipments/${id}/status`, 'PATCH', { status })
};

// Invoice APIs
export const invoiceAPI = {
  getAll: () => apiCall('/invoices'),
  getById: (id) => apiCall(`/invoices/${id}`),
  create: (data) => apiCall('/invoices', 'POST', data),
  update: (id, data) => apiCall(`/invoices/${id}`, 'PUT', data),
  delete: (id) => apiCall(`/invoices/${id}`, 'DELETE'),
  generatePDF: (id) => apiCall(`/invoices/${id}/pdf`, 'GET'),
  updatePaymentStatus: (id, status) => apiCall(`/invoices/${id}/payment`, 'PATCH', { status })
};

// Review APIs
export const reviewAPI = {
  getAll: () => apiCall('/reviews'),
  getById: (id) => apiCall(`/reviews/${id}`),
  create: (data) => apiCall('/reviews', 'POST', data),
  update: (id, data) => apiCall(`/reviews/${id}`, 'PUT', data),
  delete: (id) => apiCall(`/reviews/${id}`, 'DELETE'),
  approve: (id) => apiCall(`/reviews/${id}/approve`, 'PATCH'),
  reject: (id) => apiCall(`/reviews/${id}/reject`, 'PATCH'),
  getStats: () => apiCall('/reviews/stats', 'GET')
};

// Message APIs
export const messageAPI = {
  getAll: () => apiCall('/messages'),
  getById: (id) => apiCall(`/messages/${id}`),
  create: (data) => apiCall('/messages', 'POST', data),
  markAsRead: (id) => apiCall(`/messages/${id}/read`, 'PATCH'),
  resolve: (id) => apiCall(`/messages/${id}/resolve`, 'PATCH'),
  reply: (id, reply) => apiCall(`/messages/${id}/reply`, 'POST', { reply }),
  delete: (id) => apiCall(`/messages/${id}`, 'DELETE')
};

// Settings APIs
export const settingsAPI = {
  get: () => apiCall('/settings'),
  update: (data) => apiCall('/settings', 'PUT', data),
  getStoreInfo: () => apiCall('/settings/store', 'GET'),
  updateStoreInfo: (data) => apiCall('/settings/store', 'PUT', data),
  getNotifications: () => apiCall('/settings/notifications', 'GET'),
  updateNotifications: (data) => apiCall('/settings/notifications', 'PUT', data)
};

// Report APIs
export const reportAPI = {
  getAll: () => apiCall('/reports'),
  getById: (id) => apiCall(`/reports/${id}`),
  generate: (type, dateRange) => apiCall('/reports/generate', 'POST', { type, dateRange }),
  getSalesReport: (startDate, endDate) => apiCall('/reports/sales', 'GET', { startDate, endDate }),
  getCustomerReport: () => apiCall('/reports/customers', 'GET'),
  getProductReport: () => apiCall('/reports/products', 'GET'),
  export: (id, format) => apiCall(`/reports/${id}/export`, 'GET', { format }),
  downloadCSV: (id) => apiCall(`/reports/${id}/download`, 'GET')
};

export default {
  inventoryAPI,
  discountAPI,
  campaignAPI,
  shippingAPI,
  invoiceAPI,
  reviewAPI,
  messageAPI,
  settingsAPI,
  reportAPI
};
