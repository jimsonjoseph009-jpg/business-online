// Payment utility functions for processing, validation, and formatting

/**
 * Validate payment data before processing
 */
export const validatePaymentData = (data, amount) => {
  if (!data.cardholderName || data.cardholderName.trim().length < 2) {
    return { valid: false, error: 'Cardholder name must be at least 2 characters' };
  }

  const cardNumber = data.cardNumber.replace(/\s/g, '');
  if (!/^\d{16}$/.test(cardNumber)) {
    return { valid: false, error: 'Card number must be 16 digits' };
  }

  // Luhn algorithm for card validation
  if (!luhnCheck(cardNumber)) {
    return { valid: false, error: 'Invalid card number' };
  }

  const [month, year] = data.expiryDate.split('/');
  if (!month || !year || month < 1 || month > 12) {
    return { valid: false, error: 'Invalid expiry date' };
  }

  const expiryYear = parseInt('20' + year);
  const expiryMonth = parseInt(month);
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  if (expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth)) {
    return { valid: false, error: 'Card has expired' };
  }

  if (!/^\d{3,4}$/.test(data.cvv)) {
    return { valid: false, error: 'CVV must be 3 or 4 digits' };
  }

  if (!data.billingAddress || data.billingAddress.trim().length < 5) {
    return { valid: false, error: 'Valid billing address required' };
  }

  if (!data.billingCity || data.billingCity.trim().length < 2) {
    return { valid: false, error: 'City is required' };
  }

  if (!data.billingZip || data.billingZip.trim().length < 3) {
    return { valid: false, error: 'Valid ZIP code required' };
  }

  if (amount <= 0) {
    return { valid: false, error: 'Amount must be greater than 0' };
  }

  return { valid: true };
};

/**
 * Luhn Algorithm for credit card validation
 */
export const luhnCheck = (cardNumber) => {
  let sum = 0;
  let isEven = false;

  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber.charAt(i), 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

/**
 * Process payment - calls backend API
 */
export const processPayment = async (paymentData) => {
  try {
    const response = await fetch('/api/payments/process', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify({
        orderId: paymentData.orderId,
        amount: paymentData.amount,
        customerEmail: paymentData.customerEmail,
        cardholderName: paymentData.cardholderName,
        cardNumber: maskCardNumber(paymentData.cardNumber),
        expiryDate: paymentData.expiryDate,
        cvv: paymentData.cvv,
        billingAddress: paymentData.billingAddress,
        billingCity: paymentData.billingCity,
        billingZip: paymentData.billingZip,
        billingCountry: paymentData.billingCountry,
        userId: paymentData.userId
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Payment processing failed');
    }

    const result = await response.json();
    return {
      success: true,
      transactionId: result.transactionId,
      message: 'Payment processed successfully',
      ...result
    };
  } catch (error) {
    console.error('Payment processing error:', error);
    return {
      success: false,
      message: error.message || 'Payment processing failed'
    };
  }
};

/**
 * Mask credit card number for security
 */
export const maskCardNumber = (cardNumber) => {
  const clean = cardNumber.replace(/\s/g, '');
  return `****-****-****-${clean.slice(-4)}`;
};

/**
 * Format currency for display
 */
export const formatCurrency = (cents) => {
  return `$${(cents / 100).toFixed(2)}`;
};

/**
 * Format currency without symbol
 */
export const formatCurrencyValue = (cents) => {
  return (cents / 100).toFixed(2);
};

/**
 * Convert currency string to cents
 */
export const currencyTocents = (dollarAmount) => {
  return Math.round(parseFloat(dollarAmount) * 100);
};

/**
 * Calculate payment total with tax
 */
export const calculatePaymentTotal = (subtotal, taxRate = 0.08) => {
  const tax = subtotal * taxRate;
  const total = subtotal + tax;
  return {
    subtotal,
    tax: Math.round(tax),
    total: Math.round(total)
  };
};

/**
 * Generate transaction ID
 */
export const generateTransactionId = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 9);
  return `TXN-${timestamp}-${random}`.toUpperCase();
};

/**
 * Validate email format
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Check if card is expiring soon (within 3 months)
 */
export const isCardExpiringSoon = (expiryDate) => {
  const [month, year] = expiryDate.split('/');
  const expiryYear = parseInt('20' + year);
  const expiryMonth = parseInt(month);
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  if (expiryYear > currentYear) return false;
  if (expiryYear < currentYear) return true;

  return (expiryMonth - currentMonth) <= 3 && (expiryMonth - currentMonth) >= 0;
};

/**
 * Get card type from card number
 */
export const getCardType = (cardNumber) => {
  const number = cardNumber.replace(/\s/g, '');
  
  if (/^4[0-9]{12}(?:[0-9]{3})?$/.test(number)) return 'Visa';
  if (/^5[1-5][0-9]{14}$/.test(number)) return 'Mastercard';
  if (/^3[47][0-9]{13}$/.test(number)) return 'American Express';
  if (/^6(?:011|5[0-9]{2})[0-9]{12}$/.test(number)) return 'Discover';
  
  return 'Unknown';
};

/**
 * Calculate payment schedule for installments
 */
export const calculateInstallments = (totalAmount, numberOfPayments) => {
  const paymentAmount = Math.round(totalAmount / numberOfPayments);
  const payments = [];

  for (let i = 0; i < numberOfPayments; i++) {
    const dueDate = new Date();
    dueDate.setMonth(dueDate.getMonth() + i);
    
    payments.push({
      installmentNumber: i + 1,
      amount: i === numberOfPayments - 1 ? totalAmount - (paymentAmount * i) : paymentAmount,
      dueDate: dueDate.toISOString(),
      status: i === 0 ? 'paid' : 'pending'
    });
  }

  return payments;
};

/**
 * Format payment receipt data
 */
export const formatPaymentReceipt = (payment) => {
  return {
    transactionId: payment.transactionId,
    date: new Date(payment.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    amount: formatCurrency(payment.amount),
    method: payment.method,
    status: payment.status,
    orderId: payment.orderId,
    lastFourDigits: payment.cardLastFour || '****'
  };
};
