// Stripe service for payment processing
// Install stripe with: npm install stripe stripe-js

import { loadStripe } from '@stripe/js';

const STRIPE_PUBLIC_KEY = process.env.REACT_APP_STRIPE_PUBLIC_KEY || 'pk_test_demo';

let stripePromise;

/**
 * Get Stripe instance
 */
export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLIC_KEY);
  }
  return stripePromise;
};

/**
 * Create payment intent on backend
 */
export const createPaymentIntent = async (amount, orderId, userId) => {
  try {
    const response = await fetch('/api/payments/create-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify({
        amount,
        orderId,
        userId
      })
    });

    if (!response.ok) {
      throw new Error('Failed to create payment intent');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};

/**
 * Confirm card payment
 */
export const confirmCardPayment = async (clientSecret, cardElement, paymentData) => {
  try {
    const stripe = await getStripe();
    if (!stripe) {
      throw new Error('Stripe not loaded');
    }

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: paymentData.cardholderName,
          email: paymentData.email,
          address: {
            line1: paymentData.billingAddress,
            city: paymentData.billingCity,
            postal_code: paymentData.billingZip,
            country: paymentData.billingCountry
          }
        }
      }
    });

    return result;
  } catch (error) {
    console.error('Error confirming payment:', error);
    throw error;
  }
};

/**
 * Confirm card setup (for future payments)
 */
export const confirmCardSetup = async (clientSecret, cardElement, paymentData) => {
  try {
    const stripe = await getStripe();
    if (!stripe) {
      throw new Error('Stripe not loaded');
    }

    const result = await stripe.confirmCardSetup(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: paymentData.cardholderName,
          email: paymentData.email
        }
      }
    });

    return result;
  } catch (error) {
    console.error('Error setting up card:', error);
    throw error;
  }
};

/**
 * Handle 3D Secure authentication if needed
 */
export const handle3DSecure = async (clientSecret) => {
  try {
    const stripe = await getStripe();
    if (!stripe) {
      throw new Error('Stripe not loaded');
    }

    const result = await stripe.retrievePaymentIntent(clientSecret);
    return result;
  } catch (error) {
    console.error('Error handling 3D Secure:', error);
    throw error;
  }
};

/**
 * Process refund
 */
export const processRefund = async (transactionId, amount, reason = '') => {
  try {
    const response = await fetch('/api/payments/refund', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify({
        transactionId,
        amount,
        reason
      })
    });

    if (!response.ok) {
      throw new Error('Refund failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Error processing refund:', error);
    throw error;
  }
};

/**
 * Get payment methods for user
 */
export const getPaymentMethods = async (userId) => {
  try {
    const response = await fetch(`/api/payments/methods?userId=${userId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch payment methods');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    throw error;
  }
};

/**
 * Save payment method for future use
 */
export const savePaymentMethod = async (userId, paymentMethodId) => {
  try {
    const response = await fetch('/api/payments/save-method', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify({
        userId,
        paymentMethodId
      })
    });

    if (!response.ok) {
      throw new Error('Failed to save payment method');
    }

    return await response.json();
  } catch (error) {
    console.error('Error saving payment method:', error);
    throw error;
  }
};

/**
 * Delete saved payment method
 */
export const deletePaymentMethod = async (userId, paymentMethodId) => {
  try {
    const response = await fetch('/api/payments/delete-method', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify({
        userId,
        paymentMethodId
      })
    });

    if (!response.ok) {
      throw new Error('Failed to delete payment method');
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting payment method:', error);
    throw error;
  }
};

/**
 * Calculate processing fee
 */
export const calculateProcessingFee = (amount, feePercentage = 2.9, fixedFee = 30) => {
  // Standard Stripe fee: 2.9% + $0.30
  const percentageFee = amount * (feePercentage / 100);
  const totalFee = Math.round(percentageFee + fixedFee);
  return totalFee;
};

/**
 * Validate card element (Stripe)
 */
export const validateCardElement = async (cardElement) => {
  try {
    const stripe = await getStripe();
    if (!stripe) {
      throw new Error('Stripe not loaded');
    }

    // Trigger validation
    const { error } = await stripe.createToken(cardElement);
    return { error };
  } catch (error) {
    console.error('Error validating card:', error);
    return { error };
  }
};

/**
 * Format error message
 */
export const formatStripeError = (error) => {
  if (error.type === 'card_error') {
    return `Card error: ${error.message}`;
  } else if (error.type === 'validation_error') {
    return `Validation error: ${error.message}`;
  } else {
    return 'An unexpected error occurred';
  }
};
