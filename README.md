# Business Online App

A modern full-stack business management application built with React, Node.js, Express, and Firebase.

## Features

- 🔐 **User Authentication** - Secure login/signup with Firebase Auth
- 📊 **Dashboard** - Overview of customers, products, orders, and revenue
- 👥 **Customer Management** - Add, edit, and manage customer information
- 📦 **Product Management** - Track products with prices, stock, and categories
- 🛒 **Order Management** - Create and track orders with multiple items
- 🎨 **Modern UI** - Beautiful, responsive design with smooth animations

## Tech Stack

- **Frontend**: React 19, React Router
- **Backend**: Node.js, Express
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Styling**: CSS3 with modern design principles

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase project with Firestore and Authentication enabled

### 1. Setup Firebase

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password)
3. Enable Firestore Database
4. Get your Firebase config from Project Settings

### 2. Configure Frontend Environment

Create `.env` in the root directory:
```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

### 3. Configure Backend Environment

Create `server/.env`:
```env
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
```

For Firebase Admin SDK (optional):
- Go to Firebase Console > Project Settings > Service Accounts
- Generate a new private key
- Copy as single-line string to `FIREBASE_SERVICE_ACCOUNT`

### 4. Install & Run

```bash
# Install all dependencies
npm install

# Terminal 1: Start Backend (from root directory)
npm run server

# Terminal 2: Start Frontend (from root directory)
npm start
```

✅ Frontend: http://localhost:3000
✅ Backend: http://localhost:5000

## Project Structure

```
businessonline/
├── server/                    # Backend (Node.js + Express)
│   ├── config/               # Configuration files
│   ├── middleware/           # Express middleware
│   ├── routes/               # API routes
│   ├── services/             # Business logic
│   ├── utils/                # Validation & helpers
│   ├── index.js              # Server entry point
│   └── .env.example          # Environment template
├── src/                       # Frontend (React)
│   ├── components/           # React components
│   ├── contexts/             # Auth context
│   ├── config/               # Firebase config
│   └── App.js
└── package.json
```

## API Documentation

For detailed API documentation, see [BACKEND_SETUP.md](BACKEND_SETUP.md).

**Quick reference:**

### Customers
```
GET    /api/customers
POST   /api/customers
PUT    /api/customers/:id
DELETE /api/customers/:id
```

### Products
```
GET    /api/products
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

### Orders
```
GET    /api/orders
POST   /api/orders
PUT    /api/orders/:id
DELETE /api/orders/:id
```

All endpoints require Firebase authentication token in Authorization header.
