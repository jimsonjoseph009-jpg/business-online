# Quick Setup Guide

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable **Authentication**:
   - Go to Authentication > Sign-in method
   - Enable "Email/Password"
4. Enable **Firestore Database**:
   - Go to Firestore Database
   - Click "Create database"
   - Start in test mode (you can change rules later)
   - Choose a location

## Step 3: Get Firebase Configuration

1. In Firebase Console, go to Project Settings (gear icon)
2. Scroll down to "Your apps" section
3. Click on the web icon (</>) to add a web app
4. Copy the Firebase configuration values

## Step 4: Get Service Account for Backend

1. In Firebase Console, go to Project Settings
2. Click on "Service Accounts" tab
3. Click "Generate new private key"
4. Download the JSON file
5. Copy the entire JSON content (you'll need it as a single-line string)

## Step 5: Create .env File

Create a `.env` file in the root directory:

```env
# Frontend Firebase Config
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id

# Backend Firebase Admin (Service Account JSON as single-line string)
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"...","private_key_id":"...","private_key":"...","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}

# Server Port
PORT=5000
```

**Important**: The `FIREBASE_SERVICE_ACCOUNT` should be the entire JSON object as a single-line string. You can convert it using:
- Online JSON minifier, or
- Copy the JSON and remove all line breaks and extra spaces

## Step 6: Start the Application

Open two terminal windows:

**Terminal 1 - Frontend:**
```bash
npm start
```

**Terminal 2 - Backend:**
```bash
npm run server
```

The app will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Step 7: First Login

1. Go to http://localhost:3000
2. Click "Sign Up" to create your first account
3. Enter your email and password (minimum 6 characters)
4. Start managing your business!

## Troubleshooting

### Firebase Admin Not Working
If you see errors about Firebase Admin initialization, make sure:
- The `FIREBASE_SERVICE_ACCOUNT` in `.env` is a valid JSON string
- There are no extra quotes or escaped characters
- The service account has proper permissions

### Authentication Not Working
- Verify your Firebase config values in `.env` are correct
- Make sure Email/Password authentication is enabled in Firebase Console
- Check browser console for error messages

### API Calls Failing
- Ensure the backend server is running on port 5000
- Check that the Authorization header is being sent with requests
- Verify your Firebase token is valid

## Next Steps

- Customize Firestore security rules in Firebase Console
- Add more features like reports, analytics, etc.
- Deploy to production (Vercel for frontend, Railway/Heroku for backend)
