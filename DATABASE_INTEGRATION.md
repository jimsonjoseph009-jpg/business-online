# Database Integration Guide

This guide explains how your Business Online app now seamlessly saves and manages customers, products, and orders in Firebase Firestore.

## Overview

Your application is fully integrated with Firebase Firestore for persistent data storage. All CRUD operations (Create, Read, Update, Delete) are implemented for:

- **Customers** - Store customer information with profile pictures
- **Products** - Manage products with prices, stock levels, and categories
- **Orders** - Create and track orders linked to customers

## Database Structure

### Firestore Collections

#### 1. Customers Collection
```
customers/
├── [customerId]
│   ├── name: string
│   ├── email: string
│   ├── phone: string
│   ├── address: string
│   ├── imageUrl: string (Firebase Storage URL)
│   ├── userId: string (Owner's Firebase Auth ID)
│   ├── createdAt: timestamp
│   └── updatedAt: timestamp
```

#### 2. Products Collection
```
products/
├── [productId]
│   ├── name: string
│   ├── description: string
│   ├── price: number
│   ├── stock: number
│   ├── category: string
│   ├── userId: string (Owner's Firebase Auth ID)
│   ├── createdAt: timestamp
│   └── updatedAt: timestamp
```

#### 3. Orders Collection
```
orders/
├── [orderId]
│   ├── customerId: string (Reference to customer)
│   ├── items: array
│   │   └── [0]
│   │       ├── productId: string
│   │       ├── quantity: number
│   │       └── price: number
│   ├── total: number
│   ├── status: string (pending, completed, cancelled)
│   ├── userId: string (Owner's Firebase Auth ID)
│   ├── createdAt: timestamp
│   └── updatedAt: timestamp
```

## How It Works

### Frontend Architecture

#### Components
- **Customers.js** - Manage customer records with image uploads
- **Products.js** - Manage product inventory
- **Orders.js** - Create and track orders

#### Features Implemented

1. **Add New Record**
   - Fill in the form
   - Click "Add Customer", "Add Product", or "Create Order"
   - Data is automatically saved to Firestore
   - Form resets for the next entry

2. **View Records**
   - All records are loaded from Firestore on component mount
   - Lists refresh automatically after adding/updating/deleting

3. **Edit Records**
   - Click "Edit" on any card
   - Form pre-fills with existing data
   - Changes are saved to Firestore
   - List updates automatically

4. **Delete Records**
   - Click "Delete" button
   - Confirm the deletion
   - Record is removed from Firestore
   - List updates automatically

### Backend Architecture

#### Server Routes (Node.js + Express)

**Customers:**
- `GET /api/customers` - Fetch all customers for logged-in user
- `POST /api/customers` - Create a new customer
- `PUT /api/customers/:id` - Update an existing customer
- `DELETE /api/customers/:id` - Delete a customer

**Products:**
- `GET /api/products` - Fetch all products for logged-in user
- `POST /api/products` - Create a new product
- `PUT /api/products/:id` - Update an existing product
- `DELETE /api/products/:id` - Delete a product

**Orders:**
- `GET /api/orders` - Fetch all orders for logged-in user
- `POST /api/orders` - Create a new order
- `PUT /api/orders/:id` - Update an existing order
- `DELETE /api/orders/:id` - Delete an order

#### Authentication
All routes are protected with Firebase authentication middleware (`authenticateToken`). Each request requires a valid Firebase ID token in the `Authorization` header.

## Setup Instructions

### 1. Firebase Project Setup (Already Done)

Your project is configured with:
- ✅ Firebase Firestore Database
- ✅ Firebase Authentication (Email/Password)
- ✅ Firebase Storage (for images)

### 2. Environment Variables

Create a `.env` file in your project root with your Firebase config (already in place):

```
REACT_APP_FIREBASE_API_KEY=your_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project
REACT_APP_FIREBASE_STORAGE_BUCKET=your_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

### 3. Running the Application

**Terminal 1 - Start Backend Server:**
```bash
npm run server
```

**Terminal 2 - Start Frontend Development:**
```bash
npm start
```

The app will run on `http://localhost:3000` and the backend API runs on `http://localhost:5000`.

## Features Breakdown

### Adding a Customer

1. Click "+ Add Customer" button
2. Fill in the form:
   - Name (required)
   - Email (required)
   - Phone (optional)
   - Address (optional)
   - Profile picture (optional)
3. Click "Save"
4. Customer is saved to Firestore and appears in the list

### Adding a Product

1. Click "+ Add Product" button
2. Fill in the form:
   - Name (required)
   - Description (optional)
   - Price (required)
   - Stock (required)
   - Category (optional)
3. Click "Save"
4. Product is saved and appears in the list

### Creating an Order

1. Click "+ Create Order" button
2. Select a customer
3. Add items by:
   - Selecting a product from the dropdown
   - Setting quantity
   - Price is auto-filled from product data
4. Add more items or remove items as needed
5. Set order status (pending, completed, cancelled)
6. Click "Create Order"
7. Order is saved with all items linked to the selected customer

## Data Security

- ✅ **User Isolation** - Each user only sees their own data (filtered by `userId`)
- ✅ **Authentication Required** - All API endpoints require Firebase authentication
- ✅ **Server-side Validation** - User ownership is verified on every request
- ✅ **Timestamps** - All records track creation and update times

## Firestore Rules

To ensure data privacy, configure your Firestore rules to:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Customers - user can only access their own
    match /customers/{document=**} {
      allow read, write: if request.auth.uid == resource.data.userId;
    }
    
    // Products - user can only access their own
    match /products/{document=**} {
      allow read, write: if request.auth.uid == resource.data.userId;
    }
    
    // Orders - user can only access their own
    match /orders/{document=**} {
      allow read, write: if request.auth.uid == resource.data.userId;
    }
  }
}
```

## Troubleshooting

### Data Not Showing Up?
1. Ensure you're logged in
2. Check Firebase console that data is being saved
3. Check browser console for API errors
4. Verify backend server is running

### Images Not Uploading?
1. Check Firebase Storage rules are configured
2. Ensure storage bucket is enabled in Firebase console
3. Verify proper permissions in Firestore rules

### API Errors?
1. Check that backend server is running (`npm run server`)
2. Verify token is valid in Authorization header
3. Check for CORS issues in browser console
4. Ensure Firestore database is in read/write mode

## Next Steps

Your database integration is complete! You can now:

1. **Expand Features** - Add more fields to customers, products, or orders
2. **Add Reports** - Create analytics and sales reports
3. **Mobile Deployment** - Use Capacitor to build Android/iOS apps
4. **Add Validation** - Implement more form validation rules
5. **Add Search** - Implement search and filter functionality

## API Response Examples

### Create Customer Response
```json
{
  "id": "abc123def456",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "123-456-7890",
  "address": "123 Main St",
  "imageUrl": "https://storage.googleapis.com/...",
  "userId": "user123",
  "createdAt": "2025-01-21T10:30:00Z",
  "updatedAt": "2025-01-21T10:30:00Z"
}
```

### Create Order Response
```json
{
  "id": "order123",
  "customerId": "cust456",
  "items": [
    {
      "productId": "prod789",
      "quantity": 2,
      "price": 29.99
    }
  ],
  "total": 59.98,
  "status": "pending",
  "userId": "user123",
  "createdAt": "2025-01-21T10:35:00Z",
  "updatedAt": "2025-01-21T10:35:00Z"
}
```

Happy managing! 🚀
