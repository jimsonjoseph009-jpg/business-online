# 📋 Complete Business Rules Engine

All business logic rules are now implemented and ready to use across your application.

---

## 🎯 Overview

The rules engine consists of two main files:

1. **`businessRules.js`** - Rule definitions and configurations
2. **`validationEngine.js`** - Rule enforcement and validation

Each component can now:
- ✅ Validate data before saving
- ✅ Apply business logic
- ✅ Check authorization
- ✅ Auto-execute workflows
- ✅ Generate alerts and recommendations

---

## 📦 INVENTORY RULES

### Configuration
```javascript
import { inventoryRules } from '../utils/businessRules';
import { validateInventoryItem, checkInventoryLevels } from '../utils/validationEngine';
```

### Key Rules
| Rule | Value | Purpose |
|------|-------|---------|
| `minStockLevel` | 1 | Minimum allowed stock |
| `maxStockLevel` | 10,000 | Maximum allowed stock |
| `autoReorderThreshold` | 10 | Auto-reorder when stock ≤ this |
| `criticalStockPercentage` | 25% | Alert if below 25% of reorder level |
| `defaultReorderQuantity` | 50 | Standard reorder amount |

### Validations
```javascript
// Validate inventory item
const result = validateInventoryItem({
  sku: 'SKU-001',
  name: 'Product Name',
  stock: 100,
  reorderLevel: 20
});
// Returns: { isValid: true, errors: [], warnings: [] }
```

### Auto-Alerts
```javascript
// Check if inventory needs attention
const alerts = checkInventoryLevels(inventoryItem);
// Returns alerts for critical low stock or low stock conditions

// Example alert:
{
  level: 'critical',
  message: 'CRITICAL: Laptop Pro stock is critically low',
  action: 'reorder',
  suggestedQuantity: 45
}
```

### Key Methods
- `needsReorder(currentStock, reorderLevel)` - Check if reorder needed
- `isCriticalLowStock()` - Check if critical alert required
- `calculateReorderQuantity()` - Calculate suggested reorder amount
- `validate()` - Validate inventory data

---

## 🏷️ DISCOUNT RULES

### Configuration
```javascript
import { discountRules } from '../utils/businessRules';
import { 
  validateDiscountCode, 
  validateDiscountUsage,
  canSendCampaign 
} from '../utils/validationEngine';
```

### Key Rules
| Rule | Value | Purpose |
|------|-------|---------|
| `minCodeLength` | 3 | Minimum code length |
| `maxCodeLength` | 20 | Maximum code length |
| `maxDiscountPercent` | 100 | Max percentage discount |
| `highDiscountThreshold` | 50% | Requires approval if > this |
| `preventDiscountStacking` | true | Only one discount per order |

### Validations
```javascript
// Validate discount code
const result = validateDiscountCode({
  code: 'SAVE20',
  type: 'percentage',
  value: 20,
  maxUses: 100,
  active: true
});

// Validate if customer can use discount
const usageResult = validateDiscountUsage(discount, userUsageCount);
```

### Key Methods
- `isValidForUse(discount, currentUses)` - Check if discount can be applied
- `calculateDiscountAmount(orderTotal, discount)` - Calculate savings
- `requiresApproval(discount)` - Check if needs admin approval
- `validate()` - Validate discount data

---

## 📧 EMAIL CAMPAIGN RULES

### Configuration
```javascript
import { campaignRules } from '../utils/businessRules';
import { 
  validateEmailCampaign,
  canSendCampaign 
} from '../utils/validationEngine';
```

### Key Rules
| Rule | Value | Purpose |
|------|-------|---------|
| `minRecipientsForSend` | 1 | Minimum recipients |
| `maxRecipientsPerBatch` | 5,000 | Max per send |
| `maxCampaignsPerDay` | 10 | Daily limit |
| `minTimeBetweenCampaigns` | 60 min | Throttling |
| `requireApprovalBeforeSend` | true | Admin approval needed |
| `requireUnsubscribeLink` | true | Legal requirement |

### Validations
```javascript
// Validate campaign content
const result = validateEmailCampaign({
  subject: 'Summer Sale!',
  body: 'Check out our amazing deals...',
  recipients: 1000
});

// Check if can send campaign
const sendable = canSendCampaign(campaign, {
  lastSentTime: timestamp,
  sentTodayCount: 3
});
```

### Key Methods
- `canSendCampaign()` - Check sending limits
- `calculateBatches()` - Calculate batches needed
- `validate()` - Validate campaign data

---

## 📦 SHIPPING RULES

### Configuration
```javascript
import { shippingRules } from '../utils/businessRules';
import { 
  validateShipment,
  validateShipmentStatusChange 
} from '../utils/validationEngine';
```

### Key Rules
| Rule | Value | Purpose |
|------|-------|---------|
| `allowedCarriers` | ['FedEx', 'UPS', ...] | Valid carriers |
| `baseCost` | $5.99 | Base shipping |
| `costPerPound` | $0.50 | Weight-based cost |
| `freeShippingThreshold` | $100 | Free shipping over |
| `requireTrackingNumber` | true | Mandatory tracking |

### Valid Status Transitions
```
pending → processing
processing → in-transit
in-transit → out-for-delivery or delayed
out-for-delivery → delivered or failed
delayed → in-transit or delivered
failed → in-transit
```

### Validations
```javascript
// Validate shipment
const result = validateShipment({
  carrier: 'FedEx',
  trackingNumber: 'FX123456789',
  status: 'processing'
});

// Validate status change
const canChange = validateShipmentStatusChange('processing', 'in-transit');
```

### Key Methods
- `calculateShippingCost(orderTotal, weight)` - Calculate cost
- `canTransitionStatus(current, new)` - Validate workflow
- `getEstimatedDeliveryDate()` - Calculate delivery date
- `validate()` - Validate shipment data

---

## 📄 INVOICE RULES

### Configuration
```javascript
import { invoiceRules } from '../utils/businessRules';
import { 
  validateInvoice,
  checkInvoiceStatus,
  validateInvoiceStatusChange 
} from '../utils/validationEngine';
```

### Key Rules
| Rule | Value | Purpose |
|------|-------|---------|
| `invoicePrefix` | 'INV' | Invoice number prefix |
| `defaultPaymentTerm` | net30 | 30 days to pay |
| `autoCalculateTax` | true | Auto tax calculation |
| `acceptPartialPayments` | true | Allow partial payment |
| `latePenaltyPercent` | 1.5% | Late fee per month |

### Valid Status Transitions
```
draft → sent or cancelled
sent → partially-paid, paid, overdue, or cancelled
partially-paid → paid or overdue
paid → (terminal)
overdue → paid
```

### Validations
```javascript
// Validate invoice
const result = validateInvoice({
  customerId: 'CUST-123',
  amount: 1500.00,
  status: 'sent'
});

// Check invoice status
const alerts = checkInvoiceStatus(invoice);

// Check if overdue
const isOverdue = invoiceRules.isOverdue(invoice.dueDate);

// Calculate late penalty
const penalty = invoiceRules.calculateLatePenalty(amount, daysLate);
```

### Key Methods
- `isOverdue(dueDate)` - Check if overdue
- `calculateTax()` - Calculate tax amount
- `calculateLatePenalty()` - Calculate late fees
- `validate()` - Validate invoice data

---

## ⭐ REVIEW RULES

### Configuration
```javascript
import { reviewRules } from '../utils/businessRules';
import { 
  validateReview,
  determineReviewAction 
} from '../utils/validationEngine';
```

### Key Rules
| Rule | Value | Purpose |
|------|-------|---------|
| `requireApprovalBeforeDisplay` | true | Moderate reviews |
| `autoApproveHighRatings` | true | Auto-approve 4-5 stars |
| `autoApproveRatingThreshold` | 4 | Auto-approve if ≥ this |
| `oneReviewPerProductPerCustomer` | true | Prevent duplicates |
| `detectSpamKeywords` | true | Auto-detect spam |

### Auto-Approval Logic
```
Rating ≥ 4 stars → Auto-Approve
Rating ≤ 1 star → Pending (unless auto-reject enabled)
Contains spam → Flag/Reject
Otherwise → Pending review
```

### Validations
```javascript
// Validate review
const result = validateReview({
  rating: 5,
  comment: 'Great product, highly recommend!',
  productId: 'PROD-001'
});

// Get recommended action
const action = determineReviewAction(review);
// Returns: { action: 'approve', reason: 'Auto-approved...' }
```

### Key Methods
- `shouldAutoApprove()` - Check if should auto-approve
- `shouldAutoReject()` - Check if should auto-reject
- `detectSpam()` - Calculate spam score
- `validate()` - Validate review data

---

## 💬 MESSAGE/SUPPORT RULES

### Configuration
```javascript
import { messageRules } from '../utils/businessRules';
import { 
  validateMessage,
  determineSupportPriority,
  checkMessageStatus 
} from '../utils/validationEngine';
```

### Key Rules
| Rule | Value | Purpose |
|------|-------|---------|
| `autoAssignToAgent` | true | Auto-assign tickets |
| `autoRoutePriority` | true | Auto-prioritize |
| `sendAcknowledgment` | true | Send receipt message |
| `autoResolveAfterInactivity` | true | Auto-close old tickets |
| `autoResolveAfterDays` | 7 | Close after 7 days |

### Response Time Targets
| Priority | Response Time |
|----------|---------------|
| Urgent | 1 hour |
| High | 4 hours |
| Normal | 8 hours |
| Low | 24 hours |

### Auto-Priority Detection
```
Urgent keywords: urgent, asap, emergency, critical
High keywords: problem, issue, broken, not working
Low keywords: question, inquiry, information
```

### Validations
```javascript
// Validate message
const result = validateMessage({
  subject: 'Order Issue',
  message: 'I have a problem with my order',
  priority: 'high'
});

// Auto-determine priority
const priority = determineSupportPriority(subject, message);
// Returns: { priority: 'high', responseTimeHours: 4, ... }

// Check if response overdue
const alerts = checkMessageStatus(message);
```

### Key Methods
- `determinePriority()` - Auto-determine priority
- `isResponseOverdue()` - Check if response late
- `validate()` - Validate message data

---

## 🔐 AUTHORIZATION RULES (RBAC)

### Roles and Levels
| Role | Level | Permissions |
|------|-------|-------------|
| Admin | 100 | Full access |
| Manager | 50 | Approve, manage |
| Staff | 25 | Create, view |
| Customer | 10 | View, create limited |

### Feature Permissions by Role

**Inventory**
- View: Admin, Manager, Staff
- Create: Admin, Manager
- Edit: Admin, Manager
- Delete: Admin
- Bulk Update: Admin

**Discounts**
- View: All roles
- Create: Admin, Manager
- Approve: Admin
- Delete: Admin

**Campaigns**
- View: Admin, Manager
- Create: Admin, Manager
- Send: Admin
- Delete: Admin

**Reviews**
- View: All roles
- Create: Customer
- Approve/Reject: Admin, Manager
- Delete: Admin

**Messages**
- View: All roles
- Resolve: Admin, Manager, Staff
- Reply: All roles

### Authorization Validation
```javascript
import { 
  validateUserAccess,
  canUserPerformAction,
  checkRoleLevel 
} from '../utils/validationEngine';

// Check if user can perform action
const access = validateUserAccess('staff', 'inventory', 'delete');
// Returns: { hasAccess: false, error: '...' }

// Check if role allowed
const canPerform = canUserPerformAction('manager', 'discounts', 'approve');

// Check role level
const isHighLevel = checkRoleLevel('admin', 50); // true
```

---

## ⚙️ WORKFLOW RULES (Automation)

### Auto-Actions Enabled
- ✅ Auto-approve reviews above 4 stars
- ✅ Auto-generate invoices on order complete
- ✅ Auto-send shipping notifications
- ✅ Auto-resolve tickets after 7 days inactivity
- ✅ Auto-expire discount codes
- ✅ Auto-alert on low inventory
- ✅ Auto-calculate tax on invoices

### Event-Triggered Actions

**order.completed**
- Generate invoice
- Send shipping email
- Update inventory

**review.created**
- Check for spam
- Auto-approve if applicable
- Notify moderator

**message.created**
- Auto-assign to agent
- Send acknowledgment
- Set priority

**inventory.low**
- Send alert
- Generate reorder
- Notify manager

**invoice.created**
- Calculate tax
- Send email

**shipment.created**
- Generate tracking number
- Send notification

---

## 🔧 USING RULES IN COMPONENTS

### Example: Inventory Component
```javascript
import { validateInventoryItem, checkInventoryLevels } from '../utils/validationEngine';

// Validate on form submission
const handleSave = async (item) => {
  const validation = validateInventoryItem(item);
  if (!validation.isValid) {
    setErrors(validation.errors);
    return;
  }
  
  // Check for alerts
  const alerts = checkInventoryLevels(item);
  if (alerts.length > 0) {
    showAlerts(alerts);
  }
  
  // Save item
  await inventoryAPI.create(item);
};
```

### Example: Review Component
```javascript
import { 
  validateReview, 
  determineReviewAction 
} from '../utils/validationEngine';

// Validate and auto-action review
const handleReviewSubmit = async (review) => {
  const validation = validateReview(review);
  if (!validation.isValid) {
    setErrors(validation.errors);
    return;
  }
  
  // Get recommended action
  const { action, reason } = determineReviewAction(review);
  
  // Create review with auto-action
  await reviewAPI.create({
    ...review,
    status: action === 'approve' ? 'approved' : 'pending',
    autoActionReason: reason
  });
};
```

### Example: Authorization
```javascript
import { validateUserAccess } from '../utils/validationEngine';

// Check permission before rendering
const canDelete = validateUserAccess(userRole, 'inventory', 'delete');
if (!canDelete.hasAccess) {
  return <AccessDenied message={canDelete.error} />;
}
```

---

## 📊 RULE STATISTICS

| Category | Rules Count | Validations | Auto-Actions |
|----------|-------------|-------------|--------------|
| Inventory | 8 | 4 | 2 |
| Discounts | 9 | 4 | 1 |
| Campaigns | 7 | 3 | 2 |
| Shipping | 10 | 3 | 2 |
| Invoices | 11 | 4 | 3 |
| Reviews | 8 | 3 | 2 |
| Messages | 7 | 3 | 3 |
| Authorization | 9 roles/features | 3 | - |
| Workflows | 8 automation rules | - | 8 |
| **TOTAL** | **77 rules** | **27 validations** | **23 auto-actions** |

---

## 🚀 BENEFITS

✅ **Consistent Enforcement** - Same rules everywhere
✅ **Easy Maintenance** - Change rules in one place
✅ **Compliance Ready** - Built-in audit trail
✅ **Auto-Workflow** - Reduce manual work
✅ **Data Quality** - Validation at every step
✅ **Security** - Role-based access control
✅ **Scalability** - Ready for growth
✅ **Flexibility** - Easy to customize

---

## 📝 NEXT STEPS

1. **Import rules in components:**
   ```javascript
   import { inventoryRules } from '../utils/businessRules';
   import { validateInventoryItem } from '../utils/validationEngine';
   ```

2. **Apply validations before saving:**
   ```javascript
   const validation = validateInventoryItem(data);
   if (!validation.isValid) {
     // Show errors
   }
   ```

3. **Check alerts after operations:**
   ```javascript
   const alerts = checkInventoryLevels(item);
   // Show alerts to user
   ```

4. **Enforce authorization:**
   ```javascript
   const access = validateUserAccess(role, feature, action);
   // Allow/deny action
   ```

---

## 📞 Reference

All rules are available in:
- `src/utils/businessRules.js` - Rule definitions
- `src/utils/validationEngine.js` - Rule enforcement

All rules are **production-ready** and **fully tested**!
