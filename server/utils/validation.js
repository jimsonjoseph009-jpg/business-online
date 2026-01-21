const validateCustomer = (data) => {
  const errors = [];

  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    errors.push('Name is required and must be a non-empty string');
  }

  if (!data.email || typeof data.email !== 'string' || !isValidEmail(data.email)) {
    errors.push('Valid email is required');
  }

  if (data.phone && typeof data.phone !== 'string') {
    errors.push('Phone must be a string');
  }

  if (data.address && typeof data.address !== 'string') {
    errors.push('Address must be a string');
  }

  return errors;
};

const validateProduct = (data) => {
  const errors = [];

  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    errors.push('Name is required and must be a non-empty string');
  }

  if (data.price === undefined || data.price === null || isNaN(parseFloat(data.price))) {
    errors.push('Price is required and must be a number');
  }

  if (parseFloat(data.price) < 0) {
    errors.push('Price must be a positive number');
  }

  if (data.stock === undefined || data.stock === null || isNaN(parseInt(data.stock))) {
    errors.push('Stock is required and must be a number');
  }

  if (parseInt(data.stock) < 0) {
    errors.push('Stock must be a positive number');
  }

  return errors;
};

const validateOrder = (data) => {
  const errors = [];

  if (!data.customerId || typeof data.customerId !== 'string' || data.customerId.trim().length === 0) {
    errors.push('Customer ID is required');
  }

  if (!Array.isArray(data.items) || data.items.length === 0) {
    errors.push('Order must have at least one item');
  }

  if (Array.isArray(data.items)) {
    data.items.forEach((item, idx) => {
      if (!item.productId) {
        errors.push(`Item ${idx + 1}: Product ID is required`);
      }
      if (!item.quantity || item.quantity < 1) {
        errors.push(`Item ${idx + 1}: Quantity must be at least 1`);
      }
      if (item.price === undefined || item.price < 0) {
        errors.push(`Item ${idx + 1}: Price is required and must be non-negative`);
      }
    });
  }

  if (data.status && !['pending', 'completed', 'cancelled'].includes(data.status)) {
    errors.push('Invalid order status. Must be pending, completed, or cancelled');
  }

  return errors;
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

module.exports = {
  validateCustomer,
  validateProduct,
  validateOrder,
  isValidEmail
};
