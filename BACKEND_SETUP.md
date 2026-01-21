# Backend Setup & Architecture Guide

## 📁 Backend Folder Structure

```
server/
├── config/
│   ├── firebase.js          # Firebase initialization
│   └── env.js               # Environment configuration
├── middleware/
│   ├── auth.js              # Authentication middleware
│   ├── errorHandler.js      # Global error handling
│   └── logger.js            # Request logging
├── routes/
│   ├── health.js            # Health check endpoint
│   ├── customers.js         # Customer routes (CRUD)
│   ├── products.js          # Product routes (CRUD)
│   └── orders.js            # Order routes (CRUD)
├── services/
│   ├── customerService.js   # Customer business logic
│   ├── productService.js    # Product business logic
│   └── orderService.js      # Order business logic
├── utils/
│   └── validation.js        # Input validation
├── index.js                 # Main server entry point
├── .env.example             # Environment variables template
└── package.json             # Dependencies
```

## 🏗️ Architecture Overview

### Three-Layer Architecture

```
┌─────────────────────────────────────┐
│        ROUTES (Express)             │
│  (Handle HTTP requests/responses)   │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│       SERVICES (Business Logic)     │
│   (CRUD operations, validation)     │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│    FIREBASE FIRESTORE (Database)    │
│   (Data persistence & storage)      │
└─────────────────────────────────────┘
```

### Request Flow

1. **Request enters** → Express route handler
2. **Authentication** → JWT verification via Firebase
3. **Validation** → Input validation utility
4. **Processing** → Service layer handles business logic
5. **Database** → Firestore operations
6. **Response** → Formatted JSON response
7. **Error Handling** → Global error middleware catches any errors

## 🔑 Key Features

### 1. **Authentication Middleware** (`middleware/auth.js`)
- Verifies Firebase ID tokens
- Extracts user information
- Protects all API endpoints
- Returns 401/403 on auth failure

### 2. **Error Handling** (`middleware/errorHandler.js`)
- Centralized error management
- Consistent error response format
- Development/production modes
- Automatic status codes

### 3. **Request Logging** (`middleware/logger.js`)
- Tracks all API requests
- Measures response time
- Helps with debugging
- Production monitoring

### 4. **Validation** (`utils/validation.js`)
- Customer validation (name, email, phone, address)
- Product validation (name, price, stock)
- Order validation (customer, items, status)
- Consistent error messages

### 5. **Services** (Business Logic)
- Encapsulated CRUD operations
- User isolation (each user sees only their data)
- Proper error handling
- Database transactions

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

```bash
# Copy the template
cp server/.env.example server/.env

# Edit .env with your Firebase credentials
nano server/.env
```

### 3. Configure Firebase

Ensure your `.env` file contains:
```
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
FIREBASE_PROJECT_ID=your_project_id
# ... other Firebase configs
```

### 4. Start the Backend Server

```bash
npm run server
```

You should see:
```
╔══════════════════════════════════════╗
║  🚀 Business Online API Server 🚀    ║
╚══════════════════════════════════════╝
📡 Server running on port 5000
🌍 Environment: development
🔗 CORS Origin: http://localhost:3000
📅 Started at: 1/21/2026, 10:00:00 AM
```

## 📡 API Endpoints

### Health Check
```
GET /api/health
```
Response:
```json
{
  "success": true,
  "status": "ok",
  "message": "Business Online API is running",
  "timestamp": "2026-01-21T10:00:00.000Z"
}
```

### Customers
```
GET    /api/customers           - Get all customers
GET    /api/customers/:id       - Get single customer
POST   /api/customers           - Create customer
PUT    /api/customers/:id       - Update customer
DELETE /api/customers/:id       - Delete customer
```

### Products
```
GET    /api/products            - Get all products
GET    /api/products/:id        - Get single product
POST   /api/products            - Create product
PUT    /api/products/:id        - Update product
DELETE /api/products/:id        - Delete product
```

### Orders
```
GET    /api/orders              - Get all orders
GET    /api/orders/:id          - Get single order
POST   /api/orders              - Create order
PUT    /api/orders/:id          - Update order
DELETE /api/orders/:id          - Delete order
```

## 🔐 Authentication

All endpoints (except `/api/health`) require authentication.

**Include the Authorization header:**
```
Authorization: Bearer <firebase_id_token>
```

The frontend automatically handles this via `getIdToken(user)`.

## 📝 Request/Response Examples

### Create Customer
**Request:**
```bash
POST /api/customers
Authorization: Bearer eyJhbGc...
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "123-456-7890",
  "address": "123 Main St"
}
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "id": "abc123",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "123-456-7890",
    "address": "123 Main St",
    "userId": "user123",
    "createdAt": "2026-01-21T10:00:00Z",
    "updatedAt": "2026-01-21T10:00:00Z"
  },
  "message": "Customer created successfully"
}
```

**Response (Validation Error):**
```json
{
  "success": false,
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": [
    "Name is required and must be a non-empty string",
    "Valid email is required"
  ]
}
```

## 🛠️ Development

### Running in Development Mode
```bash
# Terminal 1: Backend
npm run server

# Terminal 2: Frontend
npm start
```

### Testing the API

Use tools like Postman, Insomnia, or cURL:

```bash
# Get all customers (requires auth token)
curl -X GET http://localhost:5000/api/customers \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

### Debugging

Check the server logs for:
- Request details (method, path, status)
- Response time
- Error messages and stack traces
- Firebase initialization status

## 🔒 Security

### User Isolation
- Every record contains `userId` field
- API validates user ownership before operations
- Firestore rules enforce database-level security

### Authentication
- Firebase ID tokens are verified on every request
- Tokens expire after 1 hour
- Invalid tokens return 403 Forbidden

### Data Validation
- All inputs are validated before processing
- Type checking for all fields
- Range validation for numeric fields
- Email format validation

## 📊 Data Models

### Customer
```javascript
{
  id: "auto-generated",
  name: string (required),
  email: string (required),
  phone: string (optional),
  address: string (optional),
  imageUrl: string (optional),
  userId: string (auto),
  createdAt: timestamp (auto),
  updatedAt: timestamp (auto)
}
```

### Product
```javascript
{
  id: "auto-generated",
  name: string (required),
  description: string (optional),
  price: number (required),
  stock: number (required),
  category: string (optional),
  userId: string (auto),
  createdAt: timestamp (auto),
  updatedAt: timestamp (auto)
}
```

### Order
```javascript
{
  id: "auto-generated",
  customerId: string (required),
  items: [
    {
      productId: string,
      quantity: number,
      price: number
    }
  ],
  total: number (auto-calculated),
  status: "pending" | "completed" | "cancelled",
  userId: string (auto),
  createdAt: timestamp (auto),
  updatedAt: timestamp (auto)
}
```

## 🐛 Troubleshooting

### Server won't start
- Check if port 5000 is in use: `lsof -i :5000`
- Verify Firebase credentials in `.env`
- Check Node.js version (v14+)

### Authentication errors
- Ensure Frontend is sending valid Firebase tokens
- Check token expiration: Firebase tokens expire after 1 hour
- Verify Firebase project has Authentication enabled

### Database errors
- Confirm Firestore database is active
- Check Firebase rules allow read/write
- Verify collections exist or auto-create is enabled

### CORS errors
- Check `CORS_ORIGIN` in `.env` matches frontend URL
- Ensure frontend is on the configured origin
- In production, update CORS_ORIGIN to your domain

## 🚀 Deployment

### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Update `CORS_ORIGIN` to your frontend domain
- [ ] Use Firebase Service Account for authentication
- [ ] Enable HTTPS
- [ ] Set up monitoring/logging
- [ ] Configure database backups
- [ ] Set up SSL certificates

### Environment Variables for Production
```
NODE_ENV=production
PORT=8080
CORS_ORIGIN=https://yourdomain.com
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
```

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Express.js Guide](https://expressjs.com/)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Node.js Best Practices](https://nodejs.org/en/docs/)

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Firebase console for errors
3. Check server logs for detailed error messages
4. Enable debug logging: `LOG_LEVEL=debug`
