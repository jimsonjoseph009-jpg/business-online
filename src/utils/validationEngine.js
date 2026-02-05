/**
 * Validation Engine
 * Handles all validation logic for business rules
 */

import {
  inventoryRules,
  discountRules,
  campaignRules,
  shippingRules,
  invoiceRules,
  reviewRules,
  messageRules,
  authorizationRules
} from './businessRules';

// Generic validation result
const createValidationResult = (isValid, errors = [], warnings = []) => ({
  isValid,
  errors,
  warnings,
  hasErrors: errors.length > 0,
  hasWarnings: warnings.length > 0
});

// ============================================================================
// INVENTORY VALIDATION
// ============================================================================

export const validateInventoryItem = (data) => {
  const errors = inventoryRules.validate(data);
  const warnings = [];
  
  // Additional checks
  if (data.stock > inventoryRules.maxStockLevel * 0.9) {
    warnings.push('Stock level approaching maximum limit');
  }
  
  return createValidationResult(errors.length === 0, errors, warnings);
};

export const checkInventoryLevels = (item) => {
  const alerts = [];
  
  if (inventoryRules.isCriticalLowStock(item.stock, item.reorderLevel)) {
    alerts.push({
      level: 'critical',
      message: `CRITICAL: ${item.name} stock is critically low`,
      action: 'reorder',
      suggestedQuantity: inventoryRules.calculateReorderQuantity(item.stock, item.reorderLevel)
    });
  } else if (inventoryRules.needsReorder(item.stock, item.reorderLevel)) {
    alerts.push({
      level: 'warning',
      message: `LOW STOCK: ${item.name} needs reordering`,
      action: 'reorder',
      suggestedQuantity: inventoryRules.calculateReorderQuantity(item.stock, item.reorderLevel)
    });
  }
  
  return alerts;
};

// ============================================================================
// DISCOUNT VALIDATION
// ============================================================================

export const validateDiscountCode = (data) => {
  const errors = discountRules.validate(data);
  const warnings = [];
  
  if (discountRules.requiresApproval(data)) {
    warnings.push('This high-value discount requires admin approval');
  }
  
  // Check code format
  if (discountRules.rules.allowSpecialCharacters === false) {
    if (!/^[A-Z0-9]+$/.test(data.code)) {
      errors.push('Code can only contain uppercase letters and numbers');
    }
  }
  
  return createValidationResult(errors.length === 0, errors, warnings);
};

export const validateDiscountUsage = (discount, userUsageCount) => {
  const errors = [];
  
  if (discount.maxUsesPerCustomer && userUsageCount >= discount.maxUsesPerCustomer) {
    errors.push(`You have already used this discount the maximum number of times (${discount.maxUsesPerCustomer})`);
  }
  
  if (!discountRules.isValidForUse(discount, userUsageCount)) {
    errors.push('This discount code is no longer valid');
  }
  
  return createValidationResult(errors.length === 0, errors);
};

// ============================================================================
// CAMPAIGN VALIDATION
// ============================================================================

export const validateEmailCampaign = (data) => {
  const errors = campaignRules.validate(data);
  const warnings = [];
  
  if (!data.body.includes('<')) {
    warnings.push('Consider adding HTML formatting to your email');
  }
  
  if (campaignRules.rules.requireUnsubscribeLink && !data.body.includes('unsubscribe')) {
    errors.push('Email must include an unsubscribe link');
  }
  
  return createValidationResult(errors.length === 0, errors, warnings);
};

export const canSendCampaign = (campaign, sendStats) => {
  const errors = [];
  const warnings = [];
  
  if (!campaignRules.canSendCampaign(
    campaign,
    sendStats.lastSentTime,
    sendStats.sentTodayCount
  )) {
    if (sendStats.sentTodayCount >= campaignRules.maxCampaignsPerDay) {
      errors.push(`Daily limit of ${campaignRules.maxCampaignsPerDay} campaigns reached`);
    } else {
      errors.push(`Must wait ${campaignRules.minTimeBetweenCampaigns} minutes between campaigns`);
    }
  }
  
  return createValidationResult(errors.length === 0, errors, warnings);
};

// ============================================================================
// SHIPPING VALIDATION
// ============================================================================

export const validateShipment = (data) => {
  const errors = shippingRules.validate(data);
  const warnings = [];
  
  return createValidationResult(errors.length === 0, errors, warnings);
};

export const validateShipmentStatusChange = (currentStatus, newStatus) => {
  const errors = [];
  
  if (!shippingRules.canTransitionStatus(currentStatus, newStatus)) {
    errors.push(`Cannot change status from ${currentStatus} to ${newStatus}`);
  }
  
  return createValidationResult(errors.length === 0, errors);
};

// ============================================================================
// INVOICE VALIDATION
// ============================================================================

export const validateInvoice = (data) => {
  const errors = invoiceRules.validate(data);
  const warnings = [];
  
  if (invoiceRules.rules.requirePONumber && !data.poNumber) {
    errors.push('PO Number is required');
  }
  
  return createValidationResult(errors.length === 0, errors, warnings);
};

export const validateInvoiceStatusChange = (currentStatus, newStatus) => {
  const errors = [];
  
  if (!invoiceRules.validStatusTransitions[currentStatus]?.includes(newStatus)) {
    errors.push(`Cannot change status from ${currentStatus} to ${newStatus}`);
  }
  
  return createValidationResult(errors.length === 0, errors);
};

export const checkInvoiceStatus = (invoice) => {
  const alerts = [];
  
  if (invoiceRules.isOverdue(invoice.dueDate) && invoice.status !== 'paid') {
    const now = new Date();
    const dueDate = new Date(invoice.dueDate);
    const daysOverdue = Math.floor((now - dueDate) / (1000 * 60 * 60 * 24));
    
    alerts.push({
      level: 'warning',
      message: `Invoice is ${daysOverdue} days overdue`,
      daysOverdue,
      penalty: invoiceRules.rules.penalizeLatePaid ? 
        invoiceRules.calculateLatePenalty(invoice.amount, daysOverdue) : 0
    });
  }
  
  return alerts;
};

// ============================================================================
// REVIEW VALIDATION
// ============================================================================

export const validateReview = (data) => {
  const errors = reviewRules.validate(data);
  const warnings = [];
  
  // Check for spam
  const spamScore = reviewRules.detectSpam(data.comment || '');
  if (spamScore > 0.3) {
    warnings.push('Review contains potential spam keywords');
  }
  
  return createValidationResult(errors.length === 0, errors, warnings);
};

export const determineReviewAction = (review) => {
  if (reviewRules.shouldAutoReject(review)) {
    return { action: 'reject', reason: 'Auto-rejected due to spam or low rating' };
  }
  if (reviewRules.shouldAutoApprove(review)) {
    return { action: 'approve', reason: 'Auto-approved due to high rating' };
  }
  return { action: 'pending', reason: 'Requires manual review' };
};

// ============================================================================
// MESSAGE VALIDATION
// ============================================================================

export const validateMessage = (data) => {
  const errors = messageRules.validate(data);
  const warnings = [];
  
  return createValidationResult(errors.length === 0, errors, warnings);
};

export const determineSupportPriority = (subject, message) => {
  const priority = messageRules.determinePriority(subject, message);
  const responseTarget = messageRules.responseTimeTargets[priority];
  
  return {
    priority,
    responseTimeHours: responseTarget,
    responseDueTime: new Date(Date.now() + responseTarget * 60 * 60 * 1000)
  };
};

export const checkMessageStatus = (message) => {
  const alerts = [];
  
  if (messageRules.isResponseOverdue(message.createdAt, message.priority)) {
    alerts.push({
      level: 'warning',
      message: `Response time for ${message.priority} priority exceeded`,
      priority: message.priority,
      overdue: true
    });
  }
  
  return alerts;
};

// ============================================================================
// AUTHORIZATION VALIDATION
// ============================================================================

export const validateUserAccess = (userRole, feature, action) => {
  const hasAccess = authorizationRules.hasPermission(userRole, feature, action);
  
  return {
    hasAccess,
    userRole,
    feature,
    action,
    error: !hasAccess ? `User role '${userRole}' is not authorized for ${action} on ${feature}` : null
  };
};

export const canUserPerformAction = (userRole, requiredRoles) => {
  if (!Array.isArray(requiredRoles)) {
    requiredRoles = [requiredRoles];
  }
  return requiredRoles.includes(userRole);
};

export const checkRoleLevel = (userRole, minimumRoleLevel) => {
  const userLevel = authorizationRules.getRoleLevel(userRole);
  return userLevel >= minimumRoleLevel;
};

// ============================================================================
// BATCH VALIDATION
// ============================================================================

export const validateBatch = (items, validator) => {
  const results = {
    valid: [],
    invalid: [],
    warnings: []
  };
  
  items.forEach((item, index) => {
    const validation = validator(item);
    if (validation.isValid) {
      results.valid.push({ index, item });
    } else {
      results.invalid.push({ index, item, errors: validation.errors });
    }
    if (validation.hasWarnings) {
      results.warnings.push({ index, item, warnings: validation.warnings });
    }
  });
  
  return results;
};

// ============================================================================
// EXPORT VALIDATOR REGISTRY
// ============================================================================

export const validators = {
  inventory: validateInventoryItem,
  discount: validateDiscountCode,
  campaign: validateEmailCampaign,
  shipment: validateShipment,
  invoice: validateInvoice,
  review: validateReview,
  message: validateMessage
};

export default {
  validateInventoryItem,
  validateDiscountCode,
  validateEmailCampaign,
  validateShipment,
  validateInvoice,
  validateReview,
  validateMessage,
  validateUserAccess,
  validateBatch,
  checkInventoryLevels,
  checkInvoiceStatus,
  checkMessageStatus,
  canSendCampaign,
  determineSupportPriority,
  determineReviewAction,
  validateShipmentStatusChange,
  validateInvoiceStatusChange,
  validateDiscountUsage,
  canUserPerformAction,
  checkRoleLevel
};
