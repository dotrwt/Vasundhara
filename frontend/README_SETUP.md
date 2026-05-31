# User Management System - Setup Instructions

This application has been migrated from Supabase to MongoDB with Passport.js authentication.

## Prerequisites

- Node.js (v18 or higher)
- MongoDB installed and running locally, OR MongoDB Atlas account

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 2. Configure MongoDB

**Option A: Local MongoDB**
- Install MongoDB on your machine
- Start MongoDB service
- The default connection string is: `mongodb://localhost:27017/user-management`

**Option B: MongoDB Atlas (Cloud)**
- Create a free account at https://www.mongodb.com/cloud/atlas
- Create a new cluster
- Get your connection string
- Replace `<password>` with your database password

### 3. Create Environment File

Create a `.env` file in the root directory:

```bash
# Copy the example file
cp .env.example .env
```

Edit `.env` and update the values:

```env
# MongoDB connection string
MONGODB_URI=mongodb://localhost:27017/user-management
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/user-management?retryWrites=true&w=majority

# Session secret (change this to a random string)
SESSION_SECRET=your-super-secret-key-change-this

# Server port
PORT=3001
```

### 4. Start the Backend Server

In one terminal, run:

```bash
npm run server
```

This will start the Express/MongoDB backend on port 3001.

### 5. Start the Frontend Development Server

In another terminal, run:

```bash
npm run dev
```

This will start the Vite development server (usually on port 5173).

### 6. Access the Application

Open your browser and go to: `http://localhost:5173`

## First Time Setup

1. Click on "Create admin account"
2. Fill in your name, email, and password
3. Click "Create Account"
4. Login with your credentials
5. Start adding users/farmers!

## API Endpoints

The backend provides the following endpoints:

- `POST /api/signup` - Create admin account
- `POST /api/login` - Login
- `POST /api/logout` - Logout
- `GET /api/auth/check` - Check authentication status
- `GET /api/farmers` - Get all farmers (requires auth)
- `POST /api/farmers` - Create farmer (requires auth)
- `GET /api/farmers/:id` - Get single farmer (requires auth)
- `PUT /api/farmers/:id` - Update farmer (requires auth)
- `DELETE /api/farmers/:id` - Delete farmer (requires auth)

## Technology Stack

**Backend:**
- Express.js
- MongoDB with Mongoose
- Passport.js (Local Strategy)
- Express Session
- bcryptjs for password hashing

**Frontend:**
- React 18
- React Router v7
- Tailwind CSS v4
- Radix UI components
- Lucide React icons
- Sonner for toasts

## Troubleshooting

**MongoDB Connection Issues:**
- Ensure MongoDB is running: `mongod --version`
- Check your connection string in `.env`
- For Atlas, ensure your IP is whitelisted

**Port Already in Use:**
- Change the PORT in `.env` to a different number
- Update `VITE_API_URL` in frontend if needed

**Session/Cookie Issues:**
- Clear your browser cookies
- Ensure both frontend and backend are running
- Check CORS configuration in server/index.js

## Data Structure

**Admin User (users collection):**
- email
- password (hashed)
- name
- createdAt

**Farmer Data (farmers collection):**
- name
- fatherName
- mobile
- aadhar
- pan
- farmerId
- panFile
- jila
- tehsil
- gao
- landRecords (array)
- totalRakhva
- createdBy (reference to admin user)
- createdAt
- updatedAt
- updatedBy

## Development Notes

- All files are in JavaScript (no TypeScript)
- Authentication uses sessions (cookie-based)
- Passwords are hashed with bcryptjs
- MongoDB ObjectId is used as the primary key

## Production Deployment

For production:
1. Set `SESSION_SECRET` to a strong random string
2. Enable HTTPS and set `cookie.secure` to `true` in session config
3. Update CORS origin to your production domain
4. Use environment variables for all sensitive data
5. Consider using MongoDB Atlas for production database
