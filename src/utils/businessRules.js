/**
 * Business Rules Engine
 * Central configuration for all business logic rules
 */

// ============================================================================
// INVENTORY RULES
// ============================================================================

export const inventoryRules = {
  // Stock level thresholds
  minStockLevel: 1,
  maxStockLevel: 10000,
  criticalStockPercentage: 25, // Alert when below 25% of reorder level
  
  // Reorder rules
  autoReorderThreshold: 10, // Auto-reorder when stock <= this
  defaultReorderQuantity: 50,
  minReorderQuantity: 5,
  maxReorderQuantity: 1000,
  
  // Rules
  rules: {
    stockCannotBeNegative: true,
    preventOverstock: false, // Allow overstocking if false
    autoGenerateReorderAlert: true,
    requireApprovalForLowStock: false,
    trackInventoryHistory: true,
  },
  
  // Validations
  validate: (data) => {
    const errors = [];
    if (data.stock < 0) errors.push('Stock cannot be negative');
    if (data.stock > inventoryRules.maxStockLevel) 
      errors.push(`Stock cannot exceed ${inventoryRules.maxStockLevel}`);
    if (data.reorderLevel < 1) errors.push('Reorder level must be at least 1');
    if (!data.sku || data.sku.trim() === '') errors.push('SKU is required');
    if (!data.name || data.name.trim() === '') errors.push('Product name is required');
    return errors;
  },
  
  // Check if reorder needed
  needsReorder: (currentStock, reorderLevel) => {
    return currentStock <= reorderLevel;
  },
  
  // Check if critical low stock
  isCriticalLowStock: (currentStock, reorderLevel) => {
    return currentStock <= (reorderLevel * inventoryRules.criticalStockPercentage / 100);
  },
  
  // Calculate reorder quantity
  calculateReorderQuantity: (currentStock, reorderLevel) => {
    return Math.max(
      inventoryRules.defaultReorderQuantity,
      reorderLevel - currentStock
    );
  }
};

// ============================================================================
// DISCOUNT RULES
// ============================================================================

export const discountRules = {
  // Code validation
  minCodeLength: 3,
  maxCodeLength: 20,
  allowSpecialCharacters: false,
  codeCaseSensitive: false,
  
  // Discount limits
  minDiscountPercent: 1,
  maxDiscountPercent: 100,
  minDiscountAmount: 0.01,
  maxDiscountAmount: 10000,
  
  // Rules
  rules: {
    requireApprovalForHighDiscounts: true, // > 50%
    preventDiscountStacking: true,
    requireMinimumPurchase: false,
    allowNegativeDiscounts: false,
    trackUsageByCustomer: true,
    autoExpireExpiredCodes: true,
  },
  
  // Thresholds
  highDiscountThreshold: 50, // % - requires approval
  minPurchaseForDiscount: 10, // $ - if enabled
  maxUsesPerCustomer: 1,
  
  // Validations
  validate: (data) => {
    const errors = [];
    if (!data.code || data.code.trim() === '') errors.push('Discount code is required');
    if (data.code.length < discountRules.minCodeLength) 
      errors.push(`Code must be at least ${discountRules.minCodeLength} characters`);
    if (data.code.length > discountRules.maxCodeLength)
      errors.push(`Code cannot exceed ${discountRules.maxCodeLength} characters`);
    if (data.type === 'percentage') {
      if (data.value < discountRules.minDiscountPercent || data.value > discountRules.maxDiscountPercent)
        errors.push(`Percentage must be between ${discountRules.minDiscountPercent} and ${discountRules.maxDiscountPercent}`);
    }
    if (data.type === 'fixed') {
      if (data.value < discountRules.minDiscountAmount || data.value > discountRules.maxDiscountAmount)
        errors.push(`Amount must be between $${discountRules.minDiscountAmount} and $${discountRules.maxDiscountAmount}`);
    }
    return errors;
  },
  
  // Check if discount is valid
  isValidForUse: (discount, currentUses) => {
    if (!discount.active) return false;
    if (discount.maxUses && currentUses >= discount.maxUses) return false;
    if (discount.expiryDate && new Date(discount.expiryDate) < new Date()) return false;
    return true;
  },
  
  // Calculate discount amount
  calculateDiscountAmount: (orderTotal, discount) => {
    if (discount.type === 'percentage') {
      return (orderTotal * discount.value) / 100;
    } else if (discount.type === 'fixed') {
      return Math.min(discount.value, orderTotal);
    }
    return 0;
  },
  
  // Check if requires approval
  requiresApproval: (discount) => {
    return discountRules.rules.requireApprovalForHighDiscounts && 
           discount.type === 'percentage' && 
           discount.value > discountRules.highDiscountThreshold;
  }
};

// ============================================================================
// EMAIL CAMPAIGN RULES
// ============================================================================

export const campaignRules = {
  // Audience rules
  minRecipientsForSend: 1,
  maxRecipientsPerBatch: 5000,
  batchSizeForSending: 500,
  
  // Content rules
  minSubjectLength: 5,
  maxSubjectLength: 100,
  minBodyLength: 20,
  maxBodyLength: 50000,
  
  // Sending rules
  rules: {
    requireApprovalBeforeSend: true,
    requireUnsubscribeLink: true,
    trackOpenRates: true,
    trackClickRates: true,
    preventDuplicateSends: true,
    respectOptInStatus: true,
  },
  
  // Rate limiting
  maxCampaignsPerDay: 10,
  minTimeBetweenCampaigns: 60, // minutes
  dailySendLimit: 100000,
  
  // Quality thresholds
  minimumOpenRateTarget: 15, // %
  minimumClickRateTarget: 2, // %
  
  // Validations
  validate: (data) => {
    const errors = [];
    if (!data.subject || data.subject.trim() === '') errors.push('Subject is required');
    if (data.subject.length < campaignRules.minSubjectLength)
      errors.push(`Subject must be at least ${campaignRules.minSubjectLength} characters`);
    if (!data.body || data.body.trim() === '') errors.push('Body is required');
    if (data.recipients < campaignRules.minRecipientsForSend)
      errors.push(`Minimum ${campaignRules.minRecipientsForSend} recipient(s) required`);
    if (data.recipients > campaignRules.maxRecipientsPerBatch)
      errors.push(`Cannot send to more than ${campaignRules.maxRecipientsPerBatch} recipients at once`);
    return errors;
  },
  
  // Check if campaign can be sent
  canSendCampaign: (campaign, lastSentTime, sentTodayCount) => {
    if (sentTodayCount >= campaignRules.maxCampaignsPerDay) return false;
    if (lastSentTime) {
      const timeSinceLast = Date.now() - lastSentTime;
      if (timeSinceLast < campaignRules.minTimeBetweenCampaigns * 60 * 1000) return false;
    }
    return true;
  },
  
  // Calculate batches needed
  calculateBatches: (totalRecipients) => {
    return Math.ceil(totalRecipients / campaignRules.batchSizeForSending);
  }
};

// ============================================================================
// SHIPPING RULES
// ============================================================================

export const shippingRules = {
  // Carrier rules
  allowedCarriers: ['FedEx', 'UPS', 'DHL', 'USPS', 'Local'],
  preferredCarrier: 'FedEx',
  
  // Shipping cost rules
  baseCost: 5.99,
  costPerPound: 0.50,
  minCost: 0.01,
  maxCost: 1000,
  freeShippingThreshold: 100, // Order total
  
  // Rules
  rules: {
    requireTrackingNumber: true,
    autoGenerateTrackingNumber: true,
    notifyCustomerOnShip: true,
    notifyCustomerOnDelivery: true,
    requireSignature: false,
    insuranceAvailable: true,
    estimateDeliveryDate: true,
  },
  
  // Status workflow
  validStatusTransitions: {
    pending: ['processing'],
    processing: ['in-transit'],
    'in-transit': ['out-for-delivery', 'delayed'],
    'out-for-delivery': ['delivered', 'failed'],
    delivered: [],
    delayed: ['in-transit', 'delivered'],
    failed: ['in-transit']
  },
  
  // Delivery estimates (days)
  deliveryEstimates: {
    'FedEx': { standard: 3, express: 1 },
    'UPS': { standard: 5, express: 2 },
    'DHL': { standard: 5, express: 2 },
    'USPS': { standard: 7, priority: 3 },
    'Local': { standard: 1 }
  },
  
  // Validations
  validate: (data) => {
    const errors = [];
    if (!data.carrier || !shippingRules.allowedCarriers.includes(data.carrier))
      errors.push(`Invalid carrier. Allowed: ${shippingRules.allowedCarriers.join(', ')}`);
    if (!data.trackingNumber || data.trackingNumber.trim() === '')
      errors.push('Tracking number is required');
    if (!shippingRules.validStatusTransitions[data.status])
      errors.push('Invalid shipping status');
    return errors;
  },
  
  // Calculate shipping cost
  calculateShippingCost: (orderTotal, weight) => {
    if (orderTotal >= shippingRules.freeShippingThreshold) return 0;
    const cost = shippingRules.baseCost + (weight * shippingRules.costPerPound);
    return Math.max(shippingRules.minCost, Math.min(cost, shippingRules.maxCost));
  },
  
  // Check status transition validity
  canTransitionStatus: (currentStatus, newStatus) => {
    const allowed = shippingRules.validStatusTransitions[currentStatus] || [];
    return allowed.includes(newStatus);
  },
  
  // Get estimated delivery date
  getEstimatedDeliveryDate: (carrier, shippingType = 'standard') => {
    const estimates = shippingRules.deliveryEstimates[carrier];
    if (!estimates) return null;
    const days = estimates[shippingType] || estimates.standard;
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
  }
};

// ============================================================================
// DELIVERY TRACKING RULES
// ============================================================================

export const deliveryTrackingRules = {
  // Tracking display rules
  enableRealTimeTracking: true,
  enableCustomerTrackingPage: true,
  enableProactiveNotifications: true,
  enableDeliveryInstructions: true,
  
  // Notification triggers
  notificationEvents: [
    'picked-up',
    'in-transit',
    'out-for-delivery',
    'delivered',
    'failed',
    'delayed'
  ],
  
  // Notification channels
  notificationChannels: {
    sms: true,
    email: true,
    push: true,
    webhook: true
  },
  
  // Tracking update frequency
  updateFrequency: 'real-time', // real-time, hourly, manual
  maxRetries: 3,
  retryDelay: 300000, // 5 minutes
  
  // Delivery instruction rules
  rules: {
    allowCustomInstructions: true,
    maxInstructionLength: 500,
    requireDeliveryConfirmation: true,
    enableProofOfDelivery: true,
    enableSignatureCapture: false,
    enablePhotoCapture: false,
    allowDeliveryReschedule: true,
    maxRescheduleAttempts: 3,
    enableLiveTracking: true,
  },
  
  // Failed delivery handling
  failedDeliveryRules: {
    autoRetry: true,
    retryDays: 2,
    maxRetries: 3,
    notifyCustomer: true,
    allowCustomerReschedule: true,
    refundOnFailure: false,
  },
  
  // Delayed delivery rules
  delayedDeliveryRules: {
    delayThresholdHours: 24,
    notifyAfterHours: 12,
    autoCompensation: true,
    compensationAmount: 5, // dollars or percentage
    compensationType: 'credit', // credit, refund, discount
  },
  
  // Proof of delivery
  proofOfDeliveryRules: {
    requireSignature: false,
    requirePhoto: false,
    requireRecipientName: true,
    requireTimestamp: true,
    requireLocation: true,
    storageLocation: 'cloud',
  },
  
  // Status update validations
  validateStatusUpdate: (currentStatus, newStatus, updatedData) => {
    const errors = [];
    const validTransitions = {
      'pending': ['processing', 'cancelled'],
      'processing': ['in-transit', 'cancelled'],
      'in-transit': ['out-for-delivery', 'delayed'],
      'out-for-delivery': ['delivered', 'failed'],
      'delivered': [],
      'failed': ['in-transit'],
      'delayed': ['in-transit', 'delivered'],
      'cancelled': []
    };
    
    if (!validTransitions[currentStatus]?.includes(newStatus)) {
      errors.push(`Cannot transition from ${currentStatus} to ${newStatus}`);
    }
    
    if (newStatus === 'delivered' && !updatedData.deliveredAt) {
      errors.push('Delivery timestamp is required');
    }
    
    if (newStatus === 'failed' && !updatedData.failureReason) {
      errors.push('Failure reason is required');
    }
    
    return { isValid: errors.length === 0, errors };
  },
  
  // Calculate delivery progress percentage
  calculateProgress: (status) => {
    const statusProgress = {
      'pending': 10,
      'processing': 25,
      'in-transit': 50,
      'out-for-delivery': 75,
      'delivered': 100,
      'failed': 0,
      'delayed': 50,
      'cancelled': 0
    };
    return statusProgress[status] || 0;
  }
};

// ============================================================================
// INVOICE RULES
// ============================================================================

export const invoiceRules = {
  // Invoice settings
  invoicePrefix: 'INV',
  invoiceNumberStart: 1000,
  autoGenerateInvoiceNumber: true,
  
  // Payment rules
  paymentTerms: {
    net30: 30,
    net60: 60,
    net90: 90,
    immediate: 0
  },
  defaultPaymentTerm: 'net30',
  
  // Rules
  rules: {
    requirePONumber: false,
    autoCalculateTax: true,
    acceptPartialPayments: true,
    sendPaymentReminders: true,
    penalizeLatePaid: false,
    requireApprovalBeforeSend: false,
  },
  
  // Tax rates
  taxRates: {
    standard: 0.08,
    food: 0.00,
    shipping: 0.00
  },
  
  // Late payment penalty
  latePenaltyPercent: 1.5, // % per month
  latePenaltyMaxPercent: 10, // Max total penalty
  
  // Status workflow
  validStatusTransitions: {
    draft: ['sent', 'cancelled'],
    sent: ['partially-paid', 'paid', 'overdue', 'cancelled'],
    'partially-paid': ['paid', 'overdue'],
    paid: [],
    overdue: ['paid'],
    cancelled: []
  },
  
  // Validations
  validate: (data) => {
    const errors = [];
    if (!data.customerId || data.customerId.trim() === '') errors.push('Customer ID is required');
    if (!data.amount || data.amount <= 0) errors.push('Amount must be greater than 0');
    if (!data.dueDate) errors.push('Due date is required');
    if (!invoiceRules.validStatusTransitions[data.status])
      errors.push('Invalid invoice status');
    return errors;
  },
  
  // Calculate tax
  calculateTax: (subtotal, taxType = 'standard') => {
    const rate = invoiceRules.taxRates[taxType] || invoiceRules.taxRates.standard;
    return subtotal * rate;
  },
  
  // Check if overdue
  isOverdue: (dueDate) => {
    return new Date(dueDate) < new Date();
  },
  
  // Calculate late payment penalty
  calculateLatePenalty: (amount, daysLate) => {
    const monthsLate = Math.ceil(daysLate / 30);
    const penaltyPercent = Math.min(
      (invoiceRules.latePenaltyPercent * monthsLate) / 100,
      invoiceRules.latePenaltyMaxPercent / 100
    );
    return amount * penaltyPercent;
  }
};

// ============================================================================
// REVIEW RULES
// ============================================================================

export const reviewRules = {
  // Rating rules
  minRating: 1,
  maxRating: 5,
  
  // Content rules
  minReviewLength: 10,
  maxReviewLength: 5000,
  
  // Rules
  rules: {
    requireApprovalBeforeDisplay: true,
    autoApproveHighRatings: true,
    autoRejectLowRatings: false,
    preventDuplicateReviews: true,
    oneReviewPerProductPerCustomer: true,
    requireVerifiedPurchase: false,
    detectSpamKeywords: true,
  },
  
  // Auto-approval thresholds
  autoApproveRatingThreshold: 4, // Auto-approve if >= this
  autoRejectRatingThreshold: 1, // Auto-reject if <= this (disabled)
  
  // Spam detection keywords
  spamKeywords: ['viagra', 'casino', 'lottery', 'click here', 'cheap', 'buy now'],
  minSpamScore: 0.7, // Spam if score >= this
  
  // Validations
  validate: (data) => {
    const errors = [];
    if (!data.rating || data.rating < reviewRules.minRating || data.rating > reviewRules.maxRating)
      errors.push(`Rating must be between ${reviewRules.minRating} and ${reviewRules.maxRating}`);
    if (!data.comment || data.comment.trim().length < reviewRules.minReviewLength)
      errors.push(`Review must be at least ${reviewRules.minReviewLength} characters`);
    if (data.comment.length > reviewRules.maxReviewLength)
      errors.push(`Review cannot exceed ${reviewRules.maxReviewLength} characters`);
    return errors;
  },
  
  // Check if should auto-approve
  shouldAutoApprove: (review) => {
    return reviewRules.rules.autoApproveHighRatings && 
           review.rating >= reviewRules.autoApproveRatingThreshold;
  },
  
  // Check if should auto-reject
  shouldAutoReject: (review) => {
    if (!reviewRules.rules.autoRejectLowRatings) return false;
    if (review.rating <= reviewRules.autoRejectRatingThreshold) return true;
    if (reviewRules.detectSpam(review.comment) > reviewRules.minSpamScore) return true;
    return false;
  },
  
  // Detect spam in review
  detectSpam: (comment) => {
    let spamCount = 0;
    const lowerComment = comment.toLowerCase();
    reviewRules.spamKeywords.forEach(keyword => {
      if (lowerComment.includes(keyword)) spamCount++;
    });
    return spamCount / reviewRules.spamKeywords.length;
  }
};

// ============================================================================
// MESSAGE/SUPPORT RULES
// ============================================================================

export const messageRules = {
  // Priority levels
  priorityLevels: ['low', 'normal', 'high', 'urgent'],
  defaultPriority: 'normal',
  
  // Rules
  rules: {
    autoAssignToAgent: true,
    autoRoutePriority: true,
    sendAcknowledgment: true,
    setResponseTimeTarget: true,
    autoResolveAfterInactivity: true,
    requireResolutionSurvey: false,
  },
  
  // Response time targets (hours)
  responseTimeTargets: {
    low: 24,
    normal: 8,
    high: 4,
    urgent: 1
  },
  
  // Auto-resolve settings
  autoResolveAfterDays: 7,
  autoResolveWarningAfterDays: 5,
  
  // Auto-prioritize keywords
  priorityKeywords: {
    urgent: ['urgent', 'asap', 'emergency', 'critical'],
    high: ['problem', 'issue', 'broken', 'not working', 'complaint'],
    low: ['question', 'inquiry', 'information', 'feedback']
  },
  
  // Validations
  validate: (data) => {
    const errors = [];
    if (!data.subject || data.subject.trim() === '') errors.push('Subject is required');
    if (!data.message || data.message.trim() === '') errors.push('Message is required');
    if (data.priority && !messageRules.priorityLevels.includes(data.priority))
      errors.push(`Priority must be one of: ${messageRules.priorityLevels.join(', ')}`);
    return errors;
  },
  
  // Determine priority automatically
  determinePriority: (subject, message) => {
    const text = `${subject} ${message}`.toLowerCase();
    for (let priority of ['urgent', 'high', 'low']) {
      const keywords = messageRules.priorityKeywords[priority];
      if (keywords.some(keyword => text.includes(keyword))) {
        return priority;
      }
    }
    return messageRules.defaultPriority;
  },
  
  // Check if message is overdue response
  isResponseOverdue: (createdAt, priority) => {
    const targetHours = messageRules.responseTimeTargets[priority];
    const now = new Date();
    const created = new Date(createdAt);
    const hoursElapsed = (now - created) / (1000 * 60 * 60);
    return hoursElapsed > targetHours;
  }
};

// ============================================================================
// AUTHORIZATION RULES (RBAC)
// ============================================================================

export const authorizationRules = {
  // Role definitions
  roles: {
    admin: { level: 100, label: 'Administrator' },
    manager: { level: 50, label: 'Manager' },
    staff: { level: 25, label: 'Staff' },
    customer: { level: 10, label: 'Customer' }
  },
  
  // Feature permissions by role
  permissions: {
    inventory: {
      view: ['admin', 'manager', 'staff'],
      create: ['admin', 'manager'],
      edit: ['admin', 'manager'],
      delete: ['admin'],
      bulkUpdate: ['admin']
    },
    discounts: {
      view: ['admin', 'manager', 'staff', 'customer'],
      create: ['admin', 'manager'],
      edit: ['admin'],
      delete: ['admin'],
      approve: ['admin']
    },
    campaigns: {
      view: ['admin', 'manager'],
      create: ['admin', 'manager'],
      send: ['admin'],
      edit: ['admin', 'manager'],
      delete: ['admin']
    },
    shipping: {
      view: ['admin', 'manager', 'staff', 'customer'],
      create: ['admin', 'manager'],
      edit: ['admin', 'manager'],
      track: ['admin', 'manager', 'customer']
    },
    invoices: {
      view: ['admin', 'manager', 'customer'],
      create: ['admin', 'manager'],
      edit: ['admin'],
      delete: ['admin'],
      download: ['admin', 'manager', 'customer']
    },
    reviews: {
      view: ['admin', 'manager', 'staff', 'customer'],
      create: ['customer'],
      approve: ['admin', 'manager'],
      reject: ['admin', 'manager'],
      delete: ['admin']
    },
    messages: {
      view: ['admin', 'manager', 'staff', 'customer'],
      create: ['admin', 'manager', 'staff', 'customer'],
      resolve: ['admin', 'manager', 'staff'],
      reply: ['admin', 'manager', 'staff', 'customer']
    },
    settings: {
      view: ['admin', 'manager'],
      edit: ['admin'],
      delete: ['admin']
    },
    reports: {
      view: ['admin', 'manager'],
      generate: ['admin'],
      export: ['admin', 'manager'],
      delete: ['admin']
    }
  },
  
  // Check if user has permission
  hasPermission: (userRole, feature, action) => {
    if (!authorizationRules.permissions[feature]) return false;
    if (!authorizationRules.permissions[feature][action]) return false;
    return authorizationRules.permissions[feature][action].includes(userRole);
  },
  
  // Get role level
  getRoleLevel: (role) => {
    return authorizationRules.roles[role]?.level || 0;
  }
};

// ============================================================================
// WORKFLOW RULES (Automation)
// ============================================================================

export const workflowRules = {
  // Auto-actions
  automation: {
    autoApproveReviewsAbove4Stars: true,
    autoGenerateInvoiceOnOrderComplete: true,
    autoSendShippingNotification: true,
    autoResolveTicketsAfter7Days: true,
    autoExpireDiscountCodes: true,
    autoAlertOnLowInventory: true,
    autoGenerateReorderAlerts: true,
    autoCalculateTaxOnInvoices: true,
  },
  
  // Event-triggered actions
  events: {
    'order.completed': ['generateInvoice', 'sendShippingEmail', 'updateInventory'],
    'review.created': ['checkSpam', 'autoApprove', 'notifyModerator'],
    'message.created': ['autoAssign', 'sendAcknowledgment', 'prioritize'],
    'inventory.low': ['sendAlert', 'generateReorderAlert', 'notifyManager'],
    'invoice.created': ['calculateTax', 'sendEmail'],
    'shipment.created': ['generateTracking', 'sendNotification'],
    'discount.created': ['validateCode', 'requestApproval'],
    'campaign.sent': ['trackOpen', 'trackClick']
  },
  
  // Time-based triggers
  timeTriggers: {
    'hourly': ['checkOverdueInvoices', 'checkResponseTimes', 'checkAutoResolveCriteria'],
    'daily': ['generateReports', 'expireDiscounts', 'sendReminders'],
    'weekly': ['cleanupArchivedData', 'generateWeeklyReport'],
    'monthly': ['generateMonthlyReport', 'archiveOldData']
  }
};

// ============================================================================
// EXPORT ALL RULES
// ============================================================================

export const allRules = {
  inventoryRules,
  discountRules,
  campaignRules,
  shippingRules,
  invoiceRules,
  reviewRules,
  messageRules,
  authorizationRules,
  workflowRules
};

export default allRules;
