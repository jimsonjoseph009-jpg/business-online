# 🚀 Quick Reference - Business Online App

## Start Development (2 terminals)

```bash
# Terminal 1: Backend
npm run server

# Terminal 2: Frontend
npm start
```

URLs:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Firebase Console: https://console.firebase.google.com

---

## Folder Structure

```
server/                    ← Backend (Node.js/Express)
├── config/               ← Configuration
├── middleware/           ← Auth, Errors, Logging
├── routes/               ← API endpoints
├── services/             ← Business logic (CRUD)
├── utils/                ← Validation helpers
├── index.js              ← Main server file
└── .env                  ← Backend config

src/                      ← Frontend (React)
├── components/           ← React components
├── contexts/             ← Auth context
├── config/               ← Firebase config
└── App.js                ← Main component
```

---

## API Endpoints

**Customers:**
- `GET /api/customers` - All customers
- `POST /api/customers` - Create
- `PUT /api/customers/{id}` - Update
- `DELETE /api/customers/{id}` - Delete

**Products:**
- `GET /api/products`
- `POST /api/products`
- `PUT /api/products/{id}`
- `DELETE /api/products/{id}`

**Orders:**
- `GET /api/orders`
- `POST /api/orders`
- `PUT /api/orders/{id}`
- `DELETE /api/orders/{id}`

**Health:**
- `GET /api/health` - Server status

---

## Setup Steps

1. **Firebase Project**
   - Enable Authentication (Email/Password)
   - Enable Firestore Database
   - Enable Cloud Storage

2. **Environment Files**
   ```bash
   cp .env.example .env
   cp server/.env.example server/.env
   ```
   Fill in Firebase credentials

3. **Firestore Rules**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{collection}/{document=**} {
         allow read, write: if request.auth.uid == resource.data.userId;
         allow create: if request.auth != null;
       }
     }
   }
   ```

4. **Install & Run**
   ```bash
   npm install
   npm run server  # Terminal 1
   npm start       # Terminal 2
   ```

---

## Key Files

| File | Purpose |
|------|---------|
| `server/index.js` | Backend entry point |
| `server/routes/customers.js` | Customer API |
| `server/services/customerService.js` | Customer logic |
| `server/middleware/auth.js` | Authentication |
| `src/components/Customers.js` | Customer UI |
| `src/config/firebase.js` | Firebase setup |
| `.env` | Frontend config |
| `server/.env` | Backend config |

---

## Common Commands

```bash
# Install dependencies
npm install

# Start backend
npm run server

# Start frontend
npm start

# Build for production
npm run build

# Run tests
npm test
```

---

## Environment Variables

**.env (Frontend)**
```
REACT_APP_FIREBASE_API_KEY=xxx
REACT_APP_FIREBASE_AUTH_DOMAIN=xxx
REACT_APP_FIREBASE_PROJECT_ID=xxx
REACT_APP_FIREBASE_STORAGE_BUCKET=xxx
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=xxx
REACT_APP_FIREBASE_APP_ID=xxx
```

**server/.env (Backend)**
```
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
FIREBASE_PROJECT_ID=xxx
FIREBASE_API_KEY=xxx
```

---

## Features

✅ User authentication with Firebase
✅ Customer management (CRUD)
✅ Product management (CRUD)
✅ Order management (CRUD)
✅ Image uploads to Firebase Storage
✅ Real-time database sync
✅ User isolation (multi-tenant)
✅ Error handling & logging
✅ Input validation

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Backend won't start | Run `npm install` |
| Port 5000 in use | `lsof -i :5000` then kill process |
| Firebase errors | Check credentials in `.env` |
| CORS errors | Update `CORS_ORIGIN` in `server/.env` |
| Auth errors | Token expired? Refresh by logout/login |

---

## Architecture

```
User → React UI → Firebase Auth
                    ↓
           Express API Routes
                    ↓
           Authentication Check
                    ↓
           Service (Business Logic)
                    ↓
           Firestore Database
```

---

## Documentation

- **[COMPLETE_SETUP_GUIDE.md](COMPLETE_SETUP_GUIDE.md)** - Comprehensive setup guide
- **[BACKEND_SETUP.md](BACKEND_SETUP.md)** - Backend architecture & details
- **[DATABASE_INTEGRATION.md](DATABASE_INTEGRATION.md)** - Database structure & API
- **[README.md](README.md)** - Project overview

---

## Next Steps

1. ✅ Setup Firebase project
2. ✅ Configure environment variables
3. ✅ Start backend server
4. ✅ Start frontend app
5. ✅ Test login/signup
6. ✅ Add first customer
7. ✅ Add first product
8. ✅ Create first order
9. 🚀 Deploy to production

---

**Need help?** Check the documentation files above or check console logs for errors.
