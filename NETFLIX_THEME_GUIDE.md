# Netflix Dark Theme - Business App Guide

## Theme Overview
Your Business Management app now has a professional Netflix-style dark theme with:
- **Background**: Deep black (#0f0f0f)
- **Cards & Components**: Dark gray (#1a1a1a) with subtle borders
- **Primary Accent**: Netflix red (#E50914)
- **Text**: White (#ffffff) for titles, light gray (#b3b3b3) for secondary text
- **Borders**: Dark gray (#333) for subtle separation

## Color Palette
```css
/* Primary Colors */
Background: #0f0f0f (Deep Black)
Card Background: #1a1a1a (Dark Gray)
Input Background: #2a2a2a (Lighter Gray)
Border Color: #333 (Subtle Border)

/* Accent Colors */
Netflix Red: #E50914 (Primary Action)
Bright Red: #ff0a1a (Hover State)
Success: #E50914

/* Text Colors */
Primary Text: #ffffff (White)
Secondary Text: #b3b3b3 (Light Gray)
```

## Components Styled

### 1. **Navigation & Layout**
- **Navbar**: Dark background with red logo
- **Sidebar**: Dark with red active states
- **Logout Button**: Red button with hover glow effect

### 2. **Dashboard**
- **Stat Cards**: Dark with red hover border glow
- **Quick Actions**: Dark container with red accent buttons
- **Title & Subtitle**: Red primary title, light gray subtitle

### 3. **Customer Management**
- **Customer Cards**: Dark cards with red border on hover
- **Add Button**: Red with red glow on hover
- **Edit/Delete**: Red edit, delete with light red border
- **Modal**: Dark overlay with red-focused inputs

### 4. **Product Management**
- **Product Cards**: Dark with red hover effects
- **All Buttons**: Red primary, dark secondary buttons
- **Form Inputs**: Dark background with red focus

### 5. **Order Management**
- **Order Cards**: Dark with red hover glow
- **Order Total**: Red colored amount
- **Status Updates**: Dark inputs with red focus
- **Remove/Add Items**: Red/dark buttons with proper contrast

### 6. **Login Page**
- **Login Card**: Dark card on black background
- **Title**: Red "Login" title
- **Inputs**: Dark with red focus outline
- **Submit Button**: Red with hover effect
- **Error Messages**: Dark red background with red border

## File Structure
```
src/
├── index.css                (Global dark theme)
├── App.css                  (App base styles)
└── components/
    ├── Layout.css           (Navbar & Sidebar)
    ├── Dashboard.css        (Dashboard cards)
    ├── Customers.css        (Customer cards & modal)
    ├── Products.css         (Product cards & forms)
    ├── Orders.css           (Order cards & items)
    ├── ImageUpload.css      (Upload preview)
    └── Login.css            (Auth page)
```

## Running Your App

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Firebase
Create `.env` file in project root:
```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

Create `server/.env` file:
```
PORT=5000
NODE_ENV=development
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PROJECT_ID=your_project_id
```

### Step 3: Start Backend Server (Terminal 1)
```bash
npm run server
```
You should see: `✅ Firebase initialized successfully`

### Step 4: Start Frontend (Terminal 2)
```bash
npm start
```
App opens at http://localhost:3000

### Step 5: Apply Firestore Security Rules
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Firestore Database** → **Rules**
4. Replace with these rules:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
  }
}
```
5. Click **Publish**

## Features Included

### ✅ Customer Management
- Add customers with name, email, phone
- Upload profile pictures
- Edit customer info
- Delete customers
- View all customers in dark card grid

### ✅ Product Management
- Add products with name, description, price, stock
- Edit product details
- Delete products
- Real-time stock tracking
- Categorize products

### ✅ Order Management
- Create orders with multiple items
- Select customers and products
- Auto-calculate totals
- Track order status
- Add/remove items from orders

### ✅ Authentication
- Sign up & login with Firebase
- Email verification
- Automatic logout on token expiry
- Persistent login session

## Keyboard Shortcuts
- `Ctrl+K` (Windows) / `Cmd+K` (Mac): Search (when implemented)
- `Esc`: Close modals

## Responsive Design
App is fully responsive:
- **Desktop** (1024px+): Full layout with sidebar
- **Tablet** (768px-1024px): Adjusted spacing
- **Mobile** (<768px): Hamburger menu, stacked layout

## Troubleshooting

### Proxy Error When Starting
**Solution**: Make sure you have both terminals running:
1. Terminal 1: `npm run server` (backend on :5000)
2. Terminal 2: `npm start` (frontend on :3000)

### Images Not Uploading
**Solution**: 
1. Check Firestore Storage rules allow authenticated uploads
2. Verify Firebase credentials are correct
3. Check browser console for errors

### Dark Theme Not Showing
**Solution**:
1. Clear browser cache: `Ctrl+Shift+Delete`
2. Hard refresh: `Ctrl+Shift+R` or `Cmd+Shift+R`
3. Restart dev server

## Performance Tips
- Use the app on modern browsers (Chrome, Firefox, Safari, Edge)
- Enable browser caching for better performance
- Use Production build for deployment: `npm run build`

## Deployment Options
1. **Vercel** (Recommended for React): `npm run build` then connect to Vercel
2. **Firebase Hosting**: Deploy React build + Node backend
3. **Heroku**: Docker setup for Node backend
4. **AWS**: EC2 for backend, Amplify for frontend

## Next Steps
1. Add more products/customers to test
2. Create orders and verify totals calculate correctly
3. Test image uploads
4. Verify all data appears in Firestore
5. Share with team members

## Support
For issues with:
- **Frontend**: Check browser DevTools console
- **Backend**: Check server terminal logs
- **Firebase**: Check Firebase Console → Firestore Logs
- **Network**: Check browser Network tab in DevTools

---

**App is ready! Start by running:**
```bash
# Terminal 1
npm run server

# Terminal 2 (in another terminal)
npm start
```

Enjoy your Netflix-themed Business Management App! 🎬
