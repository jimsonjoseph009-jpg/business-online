# Backend Architecture Diagrams

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER BROWSER                            │
│                    http://localhost:3000                        │
└─────────────────────────────┬─────────────────────────────────┘
                              │
                    React App │ Fetch API
                              │
┌─────────────────────────────▼─────────────────────────────────┐
│          FRONTEND (React 19)                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Components:                                          │   │
│  │ • Login.js - Authentication                         │   │
│  │ • Dashboard.js - Overview                           │   │
│  │ • Customers.js - Customer CRUD UI                   │   │
│  │ • Products.js - Product CRUD UI                     │   │
│  │ • Orders.js - Order CRUD UI                         │   │
│  │ • Layout.js - Navigation & layout                   │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────┬─────────────────────────────────┘
                              │
                  REST API    │ (Bearer Token)
              JSON/HTTP       │
                              │
┌─────────────────────────────▼─────────────────────────────────┐
│       EXPRESS BACKEND (Node.js)                               │
│       http://localhost:5000                                   │
│                                                               │
│  ┌─ Routes ─────────────────────────────────────────────┐   │
│  │ ├─ /api/health                                      │   │
│  │ ├─ /api/customers    ──→ customerRoutes            │   │
│  │ ├─ /api/products     ──→ productRoutes             │   │
│  │ └─ /api/orders       ──→ orderRoutes               │   │
│  └───────────────────┬─────────────────────────────────┘   │
│                      │                                       │
│  ┌─ Middleware ──────▼─────────────────────────────────┐   │
│  │ ├─ CORS Handling                                   │   │
│  │ ├─ JSON Parser                                     │   │
│  │ ├─ Request Logger (timing, status)                │   │
│  │ ├─ Error Handler (global error catch)             │   │
│  │ └─ Authentication Validator (JWT tokens)          │   │
│  └───────────────────┬─────────────────────────────────┘   │
│                      │                                       │
│  ┌─ Services ────────▼─────────────────────────────────┐   │
│  │ ├─ customerService.js (CRUD logic)                │   │
│  │ ├─ productService.js (CRUD logic)                 │   │
│  │ └─ orderService.js (CRUD logic)                   │   │
│  │                                                    │   │
│  │ Each service:                                     │   │
│  │ • Validates user ownership                        │   │
│  │ • Handles database operations                     │   │
│  │ • Returns formatted responses                     │   │
│  └───────────────────┬─────────────────────────────────┘   │
│                      │                                       │
│  ┌─ Utilities ───────▼─────────────────────────────────┐   │
│  │ └─ validation.js                                   │   │
│  │    ├─ validateCustomer()                          │   │
│  │    ├─ validateProduct()                           │   │
│  │    ├─ validateOrder()                             │   │
│  │    └─ Input type & format checking                │   │
│  └───────────────────┬─────────────────────────────────┘   │
│                      │                                       │
│  ┌─ Config ─────────▼─────────────────────────────────┐   │
│  │ ├─ firebase.js (Firebase SDK init)                │   │
│  │ └─ env.js (Environment variables)                 │   │
│  └───────────────────┬─────────────────────────────────┘   │
└─────────────────────▼───────────────────────────────────────┘
                      │
        Firestore     │ Admin SDK
        Database      │ Operations
                      │
┌─────────────────────▼───────────────────────────────────────┐
│              FIREBASE (Cloud Hosted)                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Authentication Service                              │  │
│  │ • Email/Password signin & signup                   │  │
│  │ • Token management                                 │  │
│  │ • User session handling                            │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Firestore Database                                  │  │
│  │ • customers collection (with indexes)              │  │
│  │ • products collection (with indexes)               │  │
│  │ • orders collection (with indexes)                 │  │
│  │ • Real-time sync enabled                           │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Cloud Storage                                       │  │
│  │ • Customer profile images                          │  │
│  │ • Product photos                                   │  │
│  │ • Document uploads                                 │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Request Flow - Creating a Customer

```
┌─ USER ACTION ──────────────────────────────────────────────┐
│ User fills form and clicks "Save Customer"                 │
└────────────────────┬─────────────────────────────────────┘
                     │
              ▼─────────────────────
           FRONTEND (React)
           └─ handleSubmit()
           └─ Validates form locally
           └─ Calls: POST /api/customers
           └─ Sends: { name, email, phone, address }
           └─ Header: "Authorization: Bearer {token}"
              │
              │ HTTP Request
              ▼
┌─ BACKEND EXPRESS SERVER ──────────────────────────────────┐
│ 1. Server receives request                                │
│    POST /api/customers                                    │
│                                                           │
│ 2. Logger Middleware                                     │
│    Logs: "[GET] /api/customers (200ms)"                 │
│                                                           │
│ 3. CORS Middleware                                       │
│    Checks: Origin is http://localhost:3000              │
│    ✅ Allowed                                            │
│                                                           │
│ 4. JSON Parser                                           │
│    Parses request body to JavaScript object             │
│                                                           │
│ 5. Authentication Middleware                            │
│    Extracts token from header                           │
│    Verifies token with Firebase                         │
│    Attaches user info: req.user = { uid, email, ... }  │
│                                                           │
│ 6. Route Handler (customers.js)                         │
│    POST /api/customers → router.post('/')              │
│                                                           │
│ 7. Input Validation                                      │
│    Calls: validateCustomer(req.body)                    │
│    ├─ Checks: name is required ✅                      │
│    ├─ Checks: email is valid ✅                        │
│    ├─ Checks: phone format (if provided) ✅            │
│    └─ Returns: [] (no errors)                          │
│                                                           │
│ 8. Service Layer                                         │
│    Calls: customerService.create(data, userId)         │
│                                                           │
│    In Service:                                           │
│    ├─ Adds: userId = req.user.uid                      │
│    ├─ Adds: createdAt = serverTimestamp()              │
│    ├─ Adds: updatedAt = serverTimestamp()              │
│    └─ Calls: db.collection('customers').add(data)      │
│                                                           │
│ 9. Firebase Operation                                    │
│    Firestore writes document to 'customers' collection  │
│    Returns: Document ID (abc123)                        │
│                                                           │
│ 10. Response Formatting                                  │
│     Creates response object:                            │
│     {                                                    │
│       success: true,                                    │
│       data: { id, name, email, ..., createdAt },       │
│       message: "Customer created successfully"          │
│     }                                                    │
│                                                           │
│ 11. HTTP Response (201 Created)                         │
│     Returns JSON + 201 status code                      │
│                                                           │
└────────────────────┬─────────────────────────────────────┘
                     │
              HTTP Response
              │
              ▼─────────────────────
           FRONTEND (React)
           └─ Receives response
           └─ Checks: response.ok (status 201)
           └─ Updates state: setCustomers([...])
           └─ Closes modal
           └─ Re-renders list
           └─ Shows success message
              │
              └─ USER SEES new customer in list ✓
```

---

## Data Flow - Getting All Customers

```
┌─ PAGE LOAD / REFRESH ──────────────────────────────────────┐
│ Customers.js useEffect() runs                              │
│ Calls: fetchCustomers()                                    │
└────────────────────┬─────────────────────────────────────┘
                     │
              ▼─────────────────────
           FRONTEND
           └─ Get auth token: getIdToken(user)
           └─ Send: GET /api/customers
           └─ Header: "Authorization: Bearer {token}"
              │
              │ HTTP Request
              ▼
┌─ BACKEND EXPRESS ─────────────────────────────────────────┐
│                                                           │
│ 1. Middleware Chain                                      │
│    ├─ Logger: Log request                              │
│    ├─ CORS: Verify origin                              │
│    ├─ Auth: Verify token → Extract userId              │
│    └─ Pass to route handler                            │
│                                                           │
│ 2. Route Handler                                         │
│    GET /api/customers                                  │
│    └─ Calls: customerService.getAll(userId)           │
│                                                           │
│ 3. Service Method                                        │
│    ├─ Query: db.collection('customers')                │
│    │         .where('userId', '==', userId)            │
│    │         .orderBy('createdAt', 'desc')            │
│    │         .get()                                     │
│    │                                                     │
│    ├─ Firestore returns: QuerySnapshot                │
│    │                                                     │
│    ├─ Transform: snapshot.docs.map(doc => ({          │
│    │   id: doc.id,                                      │
│    │   ...doc.data()                                    │
│    │ }))                                                │
│    │                                                     │
│    └─ Return: Array of customer objects               │
│                                                           │
│ 4. Format Response                                       │
│    {                                                     │
│      success: true,                                     │
│      data: [                                            │
│        { id: "abc123", name: "John", email: "..." },  │
│        { id: "def456", name: "Jane", email: "..." }   │
│      ],                                                 │
│      count: 2                                           │
│    }                                                     │
│                                                           │
│ 5. Send HTTP Response (200 OK)                          │
│                                                           │
└────────────────────┬─────────────────────────────────────┘
                     │
              HTTP Response
              │
              ▼─────────────────────
           FRONTEND (React)
           ├─ data = await response.json()
           ├─ setCustomers(data)
           ├─ setLoading(false)
           └─ Component re-renders with list
              │
              └─ USER SEES all customers ✓
```

---

## Error Handling Flow

```
┌─ USER TRIES TO CREATE INVALID CUSTOMER ──────────────────┐
│ Form: name = "", email = "invalid-email"                 │
└────────────────────┬──────────────────────────────────┘
                     │
              ▼─────────────────────
           FRONTEND
           └─ POST /api/customers
           └─ Body: { name: "", email: "invalid-email" }
              │
              │ HTTP Request
              ▼
┌─ BACKEND EXPRESS ─────────────────────────────────────────┐
│                                                           │
│ 1. Auth Middleware ✓ Pass                               │
│                                                           │
│ 2. Route Handler (customers.js)                         │
│    ├─ Call: validateCustomer(req.body)                 │
│    │                                                     │
│    ├─ Validation checks:                                │
│    │  ├─ name is empty ❌ ERROR                         │
│    │  │  "Name is required and must be a non-empty..."  │
│    │  └─ email is invalid ❌ ERROR                      │
│    │     "Valid email is required"                      │
│    │                                                     │
│    └─ Return: [                                          │
│        "Name is required...",                           │
│        "Valid email is required"                        │
│       ]                                                  │
│                                                           │
│ 3. If validation errors found:                          │
│    Response (400 Bad Request):                          │
│    {                                                     │
│      success: false,                                    │
│      error: "Validation failed",                        │
│      code: "VALIDATION_ERROR",                          │
│      details: [                                         │
│        "Name is required...",                           │
│        "Valid email is required"                        │
│      ]                                                   │
│    }                                                     │
│                                                           │
│ 4. Return early (don't call service)                    │
│                                                           │
└────────────────────┬─────────────────────────────────────┘
                     │
              HTTP Response (400)
              │
              ▼─────────────────────
           FRONTEND
           ├─ Check: !response.ok
           ├─ Parse: error = await response.json()
           ├─ Show: Alert with error.details
           └─ Keep: Modal open for correction
              │
              └─ USER SEES error messages ✓
```

---

## Database Schema with User Isolation

```
┌─ CUSTOMERS COLLECTION ────────────────────────────────────┐
│                                                           │
│ Document: abc123                                          │
│ ├─ userId: "user_john"  ◄── User 1 only sees their own  │
│ ├─ name: "Jane Doe"                                       │
│ ├─ email: "jane@example.com"                              │
│ ├─ phone: "+1-800-123-4567"                               │
│ ├─ address: "123 Business Ave"                            │
│ ├─ imageUrl: "https://storage.google.com/..."             │
│ ├─ createdAt: Timestamp                                   │
│ └─ updatedAt: Timestamp                                   │
│                                                           │
│ Document: def456                                          │
│ ├─ userId: "user_jane"  ◄── User 2 only sees their own  │
│ ├─ name: "John Smith"                                     │
│ ├─ email: "john@example.com"                              │
│ ├─ phone: "+1-800-987-6543"                               │
│ ├─ address: "456 Enterprise Rd"                           │
│ ├─ imageUrl: "https://storage.google.com/..."             │
│ ├─ createdAt: Timestamp                                   │
│ └─ updatedAt: Timestamp                                   │
│                                                           │
│ FIRESTORE RULE:                                           │
│ allow read, write: if request.auth.uid == resource.data.userId;
│ ▲ Ensures user can only access their own documents       │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## Middleware Chain

```
HTTP Request comes in
         │
         ▼
    ┌─────────────────────┐
    │   CORS Middleware   │
    │                     │
    │ Check: Origin       │
    │ allowed?            │
    │ YES: Continue ✓     │
    │ NO: Reject          │
    └────────┬────────────┘
             │
             ▼
    ┌─────────────────────┐
    │  JSON Body Parser   │
    │                     │
    │ Parse JSON body     │
    │ Attach to req.body  │
    └────────┬────────────┘
             │
             ▼
    ┌─────────────────────┐
    │ Request Logger      │
    │                     │
    │ Log: METHOD PATH    │
    │ Start timer         │
    └────────┬────────────┘
             │
             ▼
    ┌─────────────────────┐
    │ Auth Middleware     │
    │                     │
    │ Extract token       │
    │ Verify with         │
    │ Firebase            │
    │ Extract user data   │
    │ YES: Continue ✓     │
    │ NO: Return 403      │
    └────────┬────────────┘
             │
             ▼
    ┌─────────────────────┐
    │  Route Handler      │
    │                     │
    │ Validate input      │
    │ Call service        │
    │ Handle response     │
    └────────┬────────────┘
             │
             ▼
    ┌─────────────────────┐
    │ Error Handler       │
    │ (if any error)      │
    │                     │
    │ Format error        │
    │ Send response       │
    └────────┬────────────┘
             │
             ▼
    ┌─────────────────────┐
    │   Logger (finish)   │
    │                     │
    │ Log: STATUS CODE    │
    │ Log: DURATION       │
    └────────┬────────────┘
             │
             ▼
        Send HTTP Response
```

---

## Service Layer Pattern

```
All Services follow this pattern:

┌─ SERVICE METHOD ──────────────────────────────────────┐
│                                                       │
│ async method(params, userId) {                       │
│   try {                                              │
│     1. VALIDATE INPUT                                │
│        ├─ Check required fields                     │
│        └─ Check user permissions                    │
│                                                      │
│     2. DATABASE OPERATION                            │
│        ├─ Query Firestore                           │
│        ├─ Add/Update/Delete documents               │
│        └─ Handle transactions                       │
│                                                      │
│     3. RETURN RESULT                                 │
│        ├─ Format response                           │
│        ├─ Include success flag                      │
│        └─ Return data                               │
│                                                      │
│   } catch (error) {                                  │
│     4. ERROR HANDLING                                │
│        ├─ Create error object                       │
│        ├─ Set status code                           │
│        ├─ Set error message                         │
│        └─ Throw for middleware catch                │
│   }                                                  │
│ }                                                    │
│                                                       │
└───────────────────────────────────────────────────────┘

Example (customerService.create):

  Input: { name: "John", email: "john@ex.com" }, userId
           │
           ▼ Validate: Check required fields
  
  Input valid ✓
           │
           ▼ Add timestamp fields
  
  { name, email, userId, createdAt, updatedAt }
           │
           ▼ Call Firestore
  
  db.collection('customers').add(data)
           │
           ▼ Get returned docRef
  
  { id: docRef.id, ...data }
           │
           ▼ Return to route handler
  
  { success: true, data: {...} }
```

---

**These diagrams show how every piece works together to create a robust, secure backend!**
