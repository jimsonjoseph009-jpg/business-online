# Quick Translation Guide - Remaining Components

## How to Complete Translations

Each of the remaining 11 components needs their text replaced with `t()` function calls. Here's the pattern:

### Pattern for Translation

**Before:**
```javascript
<h1>Email Campaigns</h1>
<button>Send Now</button>
<span>Draft</span>
```

**After:**
```javascript
<h1>{t('campaigns', 'title')}</h1>
<button>{t('campaigns', 'sendNow')}</button>
<span>{t('campaigns', 'draft')}</span>
```

---

## What Needs Translation in Each Component

### 1. EmailCampaigns.js
- [ ] Page title → `t('campaigns', 'title')`
- [ ] Page description → `t('campaigns', 'description')`
- [ ] All stat card labels (Active, Sent, etc.)
- [ ] Table headers (Campaign Name, Subject, Recipients, etc.)
- [ ] Status labels (Draft, Scheduled, Sent, Failed)
- [ ] Button labels (Add Campaign, Send Now, Schedule, View Analytics)
- [ ] Empty state message → `t('campaigns', 'noResults')`
- [ ] Form labels and placeholders

### 2. Shipping.js
- [ ] Page title → `t('shipping', 'title')`
- [ ] Page description → `t('shipping', 'description')`
- [ ] Table headers (Tracking Number, Order ID, Carrier, Status, etc.)
- [ ] Status labels (Pending, Processing, In Transit, Delivered, Failed, Delayed)
- [ ] Button labels (Track, View Details, Reschedule, Report Issue)
- [ ] Empty state → `t('shipping', 'noResults')`
- [ ] DeliveryTracking component text

### 3. Invoices.js
- [ ] Page title → `t('invoices', 'title')`
- [ ] Page description → `t('invoices', 'description')`
- [ ] Table headers (Invoice Number, Customer, Amount, Status, Date, etc.)
- [ ] Button labels (View, Download, Print, Send)
- [ ] Status labels (Draft, Sent, Paid, Overdue, Cancelled)
- [ ] Empty state → `t('invoices', 'noResults')`

### 4. Reviews.js
- [ ] Page title → `t('reviews', 'title')`
- [ ] Page description → `t('reviews', 'description')`
- [ ] Table headers (Product, Author, Rating, Comment, Status, etc.)
- [ ] Status labels (Approved, Pending, Rejected)
- [ ] Button labels (Approve, Reject, Delete, Reply)
- [ ] Empty state → `t('reviews', 'noResults')`

### 5. Messages.js
- [ ] Page title → `t('messages', 'title')`
- [ ] Page description → `t('messages', 'description')`
- [ ] Table headers (Ticket ID, Subject, Customer, Priority, Status, etc.)
- [ ] Priority labels (High, Medium, Low, Urgent)
- [ ] Status labels (Open, In Progress, Closed, Reopened)
- [ ] Button labels (Reply, Close, Reopen, Delete)
- [ ] Empty state → `t('messages', 'noResults')`

### 6. Reports.js
- [ ] Page title → `t('reports', 'title')`
- [ ] Page description → `t('reports', 'description')`
- [ ] Report names and types
- [ ] Table headers
- [ ] Date range labels
- [ ] Export button → `t('common', 'export')`
- [ ] Empty state → `t('reports', 'noResults')`
- [ ] Currency formatting for amounts

### 7. Login.js
- [ ] Form labels: "Email" → `t('common', 'email')`
- [ ] Form labels: "Password" → `t('common', 'password')`
- [ ] Button: "Login" / "Sign Up" → `t('common', 'login')` / `t('common', 'signup')`
- [ ] "Create your account" / "Welcome back"
- [ ] Error messages
- [ ] "Don't have an account?" / "Already have an account?"

### 8. Products.js
- [ ] Form labels (Product Name, Price, Description, Category, etc.)
- [ ] Table headers
- [ ] Button labels (Add Product, Edit, Delete, Upload Image)
- [ ] Status labels
- [ ] Currency formatting for prices
- [ ] Empty state messages

### 9. Orders.js
- [ ] Form labels (Customer, Products, Total, Status, Date, etc.)
- [ ] Table headers
- [ ] Status labels (Pending, Processing, Shipped, Delivered, Cancelled)
- [ ] Button labels (Create Order, Edit, View Details, Cancel)
- [ ] Currency formatting
- [ ] Empty state messages

### 10. Customers.js
- [ ] Form labels (Name, Email, Phone, Address, etc.)
- [ ] Table headers
- [ ] Button labels (Add Customer, Edit, Delete, View Details)
- [ ] Empty state messages
- [ ] Customer type labels

### 11. ImageUpload.js
- [ ] Error messages:
  - "Please select an image file" → `t('imageUpload', 'invalidFile')`
  - "File size exceeded" → `t('imageUpload', 'fileTooLarge')`
  - "Upload failed" → `t('imageUpload', 'uploadFailed')`
- [ ] Button label "Upload" → `t('common', 'upload')`
- [ ] Upload progress message

---

## Translation Key Structure

Each translation key follows this pattern:
```javascript
t(section, key)
```

Available sections:
- `common` - Generic labels (Save, Cancel, Delete, etc.)
- `dashboard` - Dashboard specific
- `inventory` - Inventory management
- `discounts` - Discounts & Coupons
- `campaigns` - Email Campaigns
- `shipping` - Shipping & Delivery
- `invoices` - Invoices
- `reviews` - Reviews & Ratings
- `messages` - Messages & Support
- `reports` - Reports
- `settings` - Settings
- `sidebar` - Sidebar navigation

---

## How to Add New Translation Keys

If a translation key doesn't exist, add it to `/src/utils/localization.js`:

```javascript
export const translations = {
  en: {
    campaigns: {
      title: 'Email Campaigns',
      description: 'Manage marketing campaigns',
      sendNow: 'Send Now',
      schedule: 'Schedule',
      draft: 'Draft',
      // Add new keys here
    }
  },
  sw: {
    campaigns: {
      title: 'Kampeni za Barua Pepe',
      description: 'Dhibiti kampeni za ujumbe',
      sendNow: 'Tuma Sasa',
      schedule: 'Jadwali',
      draft: 'Muhtasari',
      // Add corresponding Swahili translations
    }
  }
};
```

---

## Step-by-Step for Each Component

### Step 1: Import useLocalization
```javascript
import { useLocalization } from '../contexts/LocalizationContext';
```

### Step 2: Add hook to component (already done!)
```javascript
const { t, currency } = useLocalization();
```

### Step 3: Replace all text
```javascript
// Find all hardcoded text
'Email Campaigns'  →  {t('campaigns', 'title')}
'Send Now'         →  {t('campaigns', 'sendNow')}
'Loading...'       →  {t('common', 'loading')}
```

### Step 4: Format currency (where applicable)
```javascript
import { formatCurrency } from '../utils/currencyManager';

// Replace hardcoded currency
`$${price}`  →  {formatCurrency(price, currency)}
```

### Step 5: Test
- Change language to Swahili
- Verify all text updates
- Change currency to TZS
- Verify all prices update
- Test search functionality

---

## Common Translation Patterns

### Status Badges
```javascript
// Before
<span className="status">{status === 'draft' ? 'Draft' : 'Sent'}</span>

// After
<span className="status">
  {status === 'draft' ? t('campaigns', 'draft') : t('campaigns', 'sent')}
</span>
```

### Form Labels
```javascript
// Before
<label>Campaign Name</label>

// After
<label>{t('campaigns', 'campaignName')}</label>
```

### Error Messages
```javascript
// Before
alert('Failed to save campaign');

// After
alert(t('common', 'error') + ': ' + t('campaigns', 'saveFailed'));
```

### Empty States
```javascript
// Before
<h3>No campaigns found</h3>

// After
<h3>{t('campaigns', 'noResults')}</h3>
```

---

## Already Available in Localization

These keys are already in the translation files:

### Common
- search, save, cancel, delete, edit, add, back, close
- export, import, download, upload, loading
- error, success, warning, info
- logout, profile

### All Sections
- Each section has: title, description, status labels
- Common CRUD operations: create, update, delete
- Field names (name, email, phone, address, etc.)

---

## Final Checklist

For each component:
- [ ] Imports updated (useLocalization, formatCurrency)
- [ ] Hook added: `const { t, currency } = useLocalization();`
- [ ] Page title translated
- [ ] All labels translated
- [ ] All buttons translated
- [ ] All status badges translated
- [ ] All error messages translated
- [ ] Currency formatting applied to all prices
- [ ] Tested language switching
- [ ] Tested currency switching
- [ ] Build passes: `npm run build`

---

## Need Help?

### Check existing translations:
1. Open `src/utils/localization.js`
2. Look in the appropriate section (campaigns, shipping, etc.)
3. Use the existing keys or add new ones

### Add new Swahili translations:
1. Find the English key in `src/utils/localization.js`
2. Add corresponding Swahili translation in `sw` section
3. Example:
   - EN: `campaignName: 'Campaign Name'`
   - SW: `campaignName: 'Jina la Kampeni'`

---

**Total Translations Needed**: ~150-200 more keys
**Estimated Time**: 2-3 hours for complete coverage
**Difficulty**: Easy (just follow the pattern)

