/**
 * Email Notification Service
 * Handles sending emails via backend API
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

/**
 * Send order confirmation email
 * @param {Object} order - Order object
 * @param {Object} customer - Customer object
 * @returns {Promise}
 */
export const sendOrderConfirmationEmail = async (order, customer) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/emails/order-confirmation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify({
        to: customer.email,
        customerName: customer.name,
        orderId: order.id,
        orderTotal: order.total,
        items: order.items,
        status: order.status
      })
    });

    if (!response.ok) {
      throw new Error('Failed to send order confirmation email');
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    throw error;
  }
};

/**
 * Send customer welcome email
 * @param {Object} customer - Customer object
 * @returns {Promise}
 */
export const sendWelcomeEmail = async (customer) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/emails/welcome`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify({
        to: customer.email,
        customerName: customer.name
      })
    });

    if (!response.ok) {
      throw new Error('Failed to send welcome email');
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
};

/**
 * Send order status update email
 * @param {Object} order - Order object
 * @param {Object} customer - Customer object
 * @returns {Promise}
 */
export const sendOrderStatusUpdateEmail = async (order, customer) => {
  try {
    const statusMessages = {
      pending: 'Your order is being prepared',
      completed: 'Your order has been completed and is ready for pickup',
      cancelled: 'Your order has been cancelled'
    };

    const response = await fetch(`${API_BASE_URL}/api/emails/order-status-update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify({
        to: customer.email,
        customerName: customer.name,
        orderId: order.id,
        status: order.status,
        statusMessage: statusMessages[order.status],
        orderTotal: order.total
      })
    });

    if (!response.ok) {
      throw new Error('Failed to send order status update email');
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending order status update email:', error);
    throw error;
  }
};

/**
 * Send low stock alert email
 * @param {Object} product - Product object
 * @returns {Promise}
 */
export const sendLowStockAlertEmail = async (product) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/emails/low-stock-alert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify({
        productId: product.id,
        productName: product.name,
        currentStock: product.stock,
        threshold: 10
      })
    });

    if (!response.ok) {
      throw new Error('Failed to send low stock alert email');
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending low stock alert email:', error);
    throw error;
  }
};

/**
 * Send custom notification email
 * @param {Object} emailData - Email data object
 * @returns {Promise}
 */
export const sendCustomNotificationEmail = async (emailData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/emails/custom`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify(emailData)
    });

    if (!response.ok) {
      throw new Error('Failed to send custom notification email');
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending custom notification email:', error);
    throw error;
  }
};
