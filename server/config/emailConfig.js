/**
 * Email Configuration and Templates
 * Configure your email service here (SendGrid, Nodemailer, etc.)
 */

// Email Templates
const emailTemplates = {
  orderConfirmation: {
    subject: 'Order Confirmation - #{orderId}',
    template: `
      <h2>Thank you for your order!</h2>
      <p>Dear {customerName},</p>
      <p>Your order has been received and is being processed.</p>
      <h3>Order Details:</h3>
      <p><strong>Order ID:</strong> {orderId}</p>
      <p><strong>Total Amount:</strong> ${'{orderTotal}'}</p>
      <p><strong>Status:</strong> {status}</p>
      <h4>Items:</h4>
      <ul>
        {itemsList}
      </ul>
      <p>We will send you another email when your order is shipped.</p>
      <p>Thank you for shopping with us!</p>
    `
  },
  
  welcome: {
    subject: 'Welcome to Our Business!',
    template: `
      <h2>Welcome!</h2>
      <p>Hi {customerName},</p>
      <p>Thank you for joining us. We're excited to have you as a customer!</p>
      <p>You can now browse our products and place orders anytime.</p>
      <p>If you have any questions, feel free to contact us.</p>
      <p>Best regards,<br>The Team</p>
    `
  },
  
  orderStatusUpdate: {
    subject: 'Order Update - {orderId}',
    template: `
      <h2>Order Status Update</h2>
      <p>Dear {customerName},</p>
      <p>{statusMessage}</p>
      <h3>Order Details:</h3>
      <p><strong>Order ID:</strong> {orderId}</p>
      <p><strong>Status:</strong> {status}</p>
      <p><strong>Total:</strong> ${'{orderTotal}'}</p>
      <p>Thank you for your business!</p>
    `
  },
  
  lowStockAlert: {
    subject: 'Low Stock Alert - {productName}',
    template: `
      <h2>Low Stock Alert</h2>
      <p>The following product is running low on stock:</p>
      <p><strong>Product:</strong> {productName}</p>
      <p><strong>Current Stock:</strong> {currentStock} units</p>
      <p><strong>Threshold:</strong> {threshold} units</p>
      <p>Please replenish stock as needed.</p>
    `
  }
};

/**
 * Replace template variables
 * @param {String} template - Email template
 * @param {Object} variables - Variables to replace
 * @returns {String} Rendered template
 */
const renderTemplate = (template, variables) => {
  let rendered = template;
  Object.keys(variables).forEach(key => {
    const regex = new RegExp(`{${key}}`, 'g');
    rendered = rendered.replace(regex, variables[key]);
  });
  return rendered;
};

/**
 * Format items list for email
 * @param {Array} items - Order items
 * @returns {String} Formatted HTML
 */
const formatItemsList = (items) => {
  return items.map(item => 
    `<li>${item.productName || 'Product'} - Qty: ${item.quantity} x $${item.price?.toFixed(2) || '0.00'}</li>`
  ).join('');
};

module.exports = {
  emailTemplates,
  renderTemplate,
  formatItemsList
};
