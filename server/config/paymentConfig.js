// Payment configuration and routes for Express backend

module.exports = {
  // Stripe configuration
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || 'sk_test_demo',
    publicKey: process.env.STRIPE_PUBLIC_KEY || 'pk_test_demo',
    webhook: {
      secret: process.env.STRIPE_WEBHOOK_SECRET || 'whsec_demo'
    }
  },

  // PayPal configuration (optional)
  paypal: {
    clientId: process.env.PAYPAL_CLIENT_ID || '',
    secret: process.env.PAYPAL_SECRET || '',
    mode: process.env.PAYPAL_MODE || 'sandbox'
  },

  // Payment settings
  settings: {
    // Supported payment methods
    paymentMethods: ['credit_card', 'debit_card', 'paypal', 'apple_pay', 'google_pay'],

    // Processing fees (in percentage + fixed amount in cents)
    fees: {
      credit_card: { percentage: 2.9, fixed: 30 },
      debit_card: { percentage: 2.9, fixed: 30 },
      paypal: { percentage: 3.49, fixed: 30 }
    },

    // Currency settings
    currency: 'USD',
    defaultCurrency: 'USD',
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD'],

    // Payment processing limits
    limits: {
      minAmount: 50, // $0.50 in cents
      maxAmount: 999999999 // $9,999,999.99 in cents
    },

    // Retry settings
    retry: {
      maxAttempts: 3,
      delayMs: 1000
    },

    // Timeout settings
    timeout: {
      paymentProcessing: 30000, // 30 seconds
      refund: 30000 // 30 seconds
    }
  },

  // Status definitions
  paymentStatus: {
    PENDING: 'pending',
    PROCESSING: 'processing',
    COMPLETED: 'completed',
    FAILED: 'failed',
    REFUNDED: 'refunded',
    CANCELLED: 'cancelled'
  },

  // Email templates for payments
  emailTemplates: {
    paymentConfirmation: {
      subject: 'Payment Confirmation - Order #{orderId}',
      html: `
        <h2>Payment Received!</h2>
        <p>Thank you for your payment.</p>
        <ul>
          <li>Order ID: {orderId}</li>
          <li>Transaction ID: {transactionId}</li>
          <li>Amount: ${'{amount}'}</li>
          <li>Date: {date}</li>
          <li>Status: {status}</li>
        </ul>
        <p>Your order is now being processed.</p>
      `
    },
    refundNotification: {
      subject: 'Refund Processed - Order #{orderId}',
      html: `
        <h2>Refund Processed</h2>
        <p>Your refund has been processed successfully.</p>
        <ul>
          <li>Order ID: {orderId}</li>
          <li>Refund Amount: ${'{amount}'}</li>
          <li>Transaction ID: {transactionId}</li>
          <li>Date: {date}</li>
        </ul>
        <p>The refund should appear in your account within 3-5 business days.</p>
      `
    },
    paymentFailed: {
      subject: 'Payment Failed - Action Required',
      html: `
        <h2>Payment Failed</h2>
        <p>Your payment could not be processed.</p>
        <ul>
          <li>Order ID: {orderId}</li>
          <li>Reason: {reason}</li>
        </ul>
        <p><a href="{retryLink}">Retry Payment</a></p>
      `
    }
  },

  // Webhook events to handle
  webhookEvents: [
    'payment_intent.succeeded',
    'payment_intent.payment_failed',
    'charge.refunded',
    'charge.dispute.created',
    'customer.subscription.updated',
    'customer.subscription.deleted'
  ],

  // Card validation rules
  cardValidation: {
    allowInternational: true,
    allowExpiredCards: false,
    cvvRequired: true,
    avsCheck: true
  },

  // 3D Secure settings
  threeDS: {
    enabled: true,
    enforcementLevel: 'recommended', // 'off', 'recommended', 'required'
    exemptions: ['low_risk']
  }
};

/**
 * Initialize payment gateway
 */
exports.initializePaymentGateway = (app, config) => {
  const stripe = require('stripe')(config.stripe.secretKey);

  // Health check endpoint
  app.get('/api/payments/health', (req, res) => {
    res.json({ status: 'payment-service-active' });
  });

  // Create payment intent
  app.post('/api/payments/create-intent', async (req, res) => {
    try {
      const { amount, orderId, userId, email, metadata } = req.body;

      if (!amount || amount < config.settings.limits.minAmount) {
        return res.status(400).json({ error: 'Invalid amount' });
      }

      const intent = await stripe.paymentIntents.create({
        amount,
        currency: config.settings.currency.toLowerCase(),
        metadata: {
          orderId,
          userId,
          ...metadata
        },
        receipt_email: email
      });

      res.json({
        clientSecret: intent.client_secret,
        publishableKey: config.stripe.publicKey
      });
    } catch (error) {
      console.error('Payment intent error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Process payment
  app.post('/api/payments/process', async (req, res) => {
    try {
      const { orderId, amount, customerEmail, userId } = req.body;

      // Validate payment
      if (!orderId || !amount || !customerEmail) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Create charge
      const charge = await stripe.charges.create({
        amount,
        currency: config.settings.currency.toLowerCase(),
        source: 'tok_visa', // In real app, use token from frontend
        description: `Order ${orderId}`,
        receipt_email: customerEmail,
        metadata: { orderId, userId }
      });

      // Return success response
      res.json({
        success: true,
        transactionId: charge.id,
        amount: charge.amount,
        status: 'completed',
        message: 'Payment processed successfully'
      });
    } catch (error) {
      console.error('Payment processing error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // Refund payment
  app.post('/api/payments/refund', async (req, res) => {
    try {
      const { transactionId, amount, reason } = req.body;

      if (!transactionId) {
        return res.status(400).json({ error: 'Transaction ID required' });
      }

      const refund = await stripe.refunds.create({
        charge: transactionId,
        amount: amount || undefined,
        reason: reason || 'requested_by_customer'
      });

      res.json({
        success: true,
        refundId: refund.id,
        amount: refund.amount,
        status: refund.status
      });
    } catch (error) {
      console.error('Refund error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get payment methods
  app.get('/api/payments/methods', async (req, res) => {
    try {
      const { userId } = req.query;
      
      if (!userId) {
        return res.status(400).json({ error: 'User ID required' });
      }

      // In real app, fetch from database
      const methods = [];

      res.json(methods);
    } catch (error) {
      console.error('Fetch methods error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Save payment method
  app.post('/api/payments/save-method', async (req, res) => {
    try {
      const { userId, paymentMethodId } = req.body;

      if (!userId || !paymentMethodId) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // In real app, save to database
      res.json({
        success: true,
        message: 'Payment method saved'
      });
    } catch (error) {
      console.error('Save method error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Delete payment method
  app.delete('/api/payments/delete-method', async (req, res) => {
    try {
      const { userId, paymentMethodId } = req.body;

      if (!userId || !paymentMethodId) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // In real app, delete from database
      res.json({
        success: true,
        message: 'Payment method deleted'
      });
    } catch (error) {
      console.error('Delete method error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Handle webhook
  app.post('/api/payments/webhook', (req, res) => {
    const sig = req.headers['stripe-signature'];
    
    try {
      const event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        config.stripe.webhook.secret
      );

      // Handle event
      switch (event.type) {
        case 'payment_intent.succeeded':
          console.log('Payment succeeded:', event.data.object);
          break;
        case 'payment_intent.payment_failed':
          console.log('Payment failed:', event.data.object);
          break;
        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      res.json({ received: true });
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(400).send(`Webhook Error: ${error.message}`);
    }
  });

  return stripe;
};
