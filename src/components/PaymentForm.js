import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { processPayment, validatePaymentData } from '../utils/paymentUtils';
import './PaymentForm.css';

const PaymentForm = ({ orderId, amount, customerEmail, onPaymentSuccess, onPaymentError }) => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    billingAddress: '',
    billingCity: '',
    billingZip: '',
    billingCountry: 'US'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number with spaces
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
    }

    // Format expiry date
    if (name === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length >= 2) {
        formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2, 4);
      }
    }

    // Format CVV (numbers only)
    if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate payment data
      const validation = validatePaymentData(formData, amount);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      // Process payment
      const paymentResult = await processPayment({
        orderId,
        amount,
        customerEmail: customerEmail || currentUser?.email,
        cardholderName: formData.cardholderName,
        cardNumber: formData.cardNumber.replace(/\s/g, ''),
        expiryDate: formData.expiryDate,
        cvv: formData.cvv,
        billingAddress: formData.billingAddress,
        billingCity: formData.billingCity,
        billingZip: formData.billingZip,
        billingCountry: formData.billingCountry,
        userId: currentUser?.uid
      });

      if (paymentResult.success) {
        setSuccess(true);
        setFormData({
          cardholderName: '',
          cardNumber: '',
          expiryDate: '',
          cvv: '',
          billingAddress: '',
          billingCity: '',
          billingZip: '',
          billingCountry: 'US'
        });
        onPaymentSuccess?.(paymentResult);
      } else {
        throw new Error(paymentResult.message || 'Payment processing failed');
      }
    } catch (err) {
      const errorMessage = err.message || 'Payment failed. Please try again.';
      setError(errorMessage);
      onPaymentError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="payment-form payment-success">
        <div className="success-icon">✓</div>
        <h3>Payment Successful!</h3>
        <p>Your payment of ${(amount / 100).toFixed(2)} has been processed.</p>
        <p className="transaction-id">Transaction ID will be sent to your email.</p>
        <button 
          onClick={() => setSuccess(false)}
          className="button-primary"
        >
          Make Another Payment
        </button>
      </div>
    );
  }

  return (
    <div className="payment-form-container">
      <form onSubmit={handleSubmit} className="payment-form">
        <h2>💳 Payment Information</h2>
        
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label htmlFor="amount">Order Amount</label>
          <div className="amount-display">
            ${(amount / 100).toFixed(2)}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="cardholderName">Cardholder Name *</label>
          <input
            type="text"
            id="cardholderName"
            name="cardholderName"
            value={formData.cardholderName}
            onChange={handleInputChange}
            placeholder="John Doe"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="cardNumber">Card Number *</label>
          <input
            type="text"
            id="cardNumber"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleInputChange}
            placeholder="1234 5678 9012 3456"
            maxLength="19"
            required
          />
          <small>16-digit card number</small>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="expiryDate">Expiry Date *</label>
            <input
              type="text"
              id="expiryDate"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleInputChange}
              placeholder="MM/YY"
              maxLength="5"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="cvv">CVV *</label>
            <input
              type="text"
              id="cvv"
              name="cvv"
              value={formData.cvv}
              onChange={handleInputChange}
              placeholder="123"
              maxLength="4"
              required
            />
          </div>
        </div>

        <h3>Billing Address</h3>

        <div className="form-group">
          <label htmlFor="billingAddress">Street Address *</label>
          <input
            type="text"
            id="billingAddress"
            name="billingAddress"
            value={formData.billingAddress}
            onChange={handleInputChange}
            placeholder="123 Main Street"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="billingCity">City *</label>
            <input
              type="text"
              id="billingCity"
              name="billingCity"
              value={formData.billingCity}
              onChange={handleInputChange}
              placeholder="New York"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="billingZip">ZIP Code *</label>
            <input
              type="text"
              id="billingZip"
              name="billingZip"
              value={formData.billingZip}
              onChange={handleInputChange}
              placeholder="10001"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="billingCountry">Country *</label>
          <select
            id="billingCountry"
            name="billingCountry"
            value={formData.billingCountry}
            onChange={handleInputChange}
            required
          >
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="GB">United Kingdom</option>
            <option value="AU">Australia</option>
            <option value="DE">Germany</option>
            <option value="FR">France</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="security-notice">
          🔒 Your payment information is encrypted and secure
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="button-pay"
        >
          {loading ? 'Processing Payment...' : `Pay $${(amount / 100).toFixed(2)}`}
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;
