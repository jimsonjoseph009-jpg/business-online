# Quick Start - Netflix Business App

## What You Have
✅ Complete backend with REST API (15 endpoints)
✅ React frontend with Netflix dark theme  
✅ Firebase integration for database & auth
✅ Customer, Product, Order management
✅ Image upload capability

## 5-Minute Setup

### 1. Get Firebase Credentials (5 min)
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create new project (if not done)
3. Click **Settings** ⚙️ → **Project Settings**
4. Under "General" tab, find Web App config
5. Copy these 6 values:
   - apiKey
   - authDomain
   - projectId
   - storageBucket
   - messagingSenderId
   - appId

### 2. Create .env Files

**File: `.env` (project root)**
```
REACT_APP_FIREBASE_API_KEY=paste_apiKey_here
REACT_APP_FIREBASE_AUTH_DOMAIN=paste_authDomain_here
REACT_APP_FIREBASE_PROJECT_ID=paste_projectId_here
REACT_APP_FIREBASE_STORAGE_BUCKET=paste_storageBucket_here
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=paste_messagingSenderId_here
REACT_APP_FIREBASE_APP_ID=paste_appId_here
```

**File: `server/.env`**
Get private key from Firebase:
1. Go to Firebase Console
2. **Service Accounts** → **Generate new private key**
3. Find in downloaded JSON: `private_key`, `client_email`, `project_id`

```
PORT=5000
NODE_ENV=development
FIREBASE_PRIVATE_KEY=paste_private_key_here
FIREBASE_CLIENT_EMAIL=paste_client_email_here
FIREBASE_PROJECT_ID=paste_project_id_here
```

### 3. Install & Run

**Terminal 1 - Backend:**
```bash
npm run server
```
Wait for: `✅ Firebase initialized successfully`

**Terminal 2 - Frontend:**
```bash
npm start
```
Wait for: Opens in http://localhost:3000

### 4. Create Account & Test

1. Sign up with: `test@example.com` / `Password123!`
2. **Add Customer**: "John Doe", "john@example.com", "555-1234"
3. **Add Product**: "Laptop", "$999", "5" units
4. **Create Order**: Select John, add Laptop (qty 1)
5. Check data in [Firebase Console](https://console.firebase.google.com/) → Firestore

## Common Issues

| Problem | Solution |
|---------|----------|
| Proxy Error | ❌ Make sure Terminal 1 is running `npm run server` first |
| Blank Dark Page | 🔄 Hard refresh browser: `Ctrl+Shift+R` |
| Can't sign up | ✅ Enable Email/Password auth in Firebase Console → Auth |
| Images won't upload | ⚙️ Enable Storage in Firebase Console |
| Data not showing | 📋 Check Firestore collections exist & have data |

## API Endpoints (for reference)

```
Backend: http://localhost:5000

POST   /api/customers        - Create customer
GET    /api/customers        - Get all customers
GET    /api/customers/:id    - Get one customer
PUT    /api/customers/:id    - Update customer
DELETE /api/customers/:id    - Delete customer

POST   /api/products         - Create product
GET    /api/products         - Get all products
PUT    /api/products/:id     - Update product
DELETE /api/products/:id     - Delete product

POST   /api/orders           - Create order
GET    /api/orders           - Get all orders
PUT    /api/orders/:id       - Update order
DELETE /api/orders/:id       - Delete order

GET    /api/health           - Check server status
```

## What Next?

1. ✅ Add 5-10 test customers
2. ✅ Add products in different categories
3. ✅ Create multiple orders
4. ✅ Upload customer profile pictures
5. ✅ Share with team to test

## Need Help?

Check these files:
- `NETFLIX_THEME_GUIDE.md` - Full styling documentation
- `FIREBASE_SETUP.md` - Detailed Firebase setup
- `SETUP.md` - Initial project setup
- `MOBILE_SETUP.md` - Mobile deployment guide

---

**That's it! Your Netflix-styled Business App is ready to use.** 🎬🚀
