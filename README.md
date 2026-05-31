# User Management System (UMS) - Land Registry & Auditing Portal

A complete, production-ready land audit registry and user management portal built with a TypeScript-based backend and React frontend.

---

## 1. Project Architecture

The repository is divided into two separate, decoupled directories:

### Backend (`/backend`)
- **Core:** Node.js, Express, TypeScript, Mongoose (MongoDB ODM)
- **Authentication:** JWT tokens (stored in headers), bcryptjs for secure password hashing
- **Validation:** `express-validator` to sanitize and validate input fields
- **Export Utility:** `xlsx` for generating formatted Excel spreadsheets from the database

### Frontend (`/frontend`)
- **Core:** React, Vite, TypeScript
- **Styling:** Tailwind CSS (configured via Tailwind CSS v4)
- **Forms:** React Hook Form + Zod for runtime schema-based validations
- **Routing:** React Router v7 with private/guarded path overlays
- **Toasts:** Sonner for clean, modular status alerts

---

## 2. Clean Directory Structure

```
UserManagementSystem/
├── backend/
│   ├── src/
│   │   ├── config/db.ts          # MongoDB connection initialization
│   │   ├── models/               # Mongoose Schema Definitions (Admin, User)
│   │   ├── controllers/          # Business logic handlers (Auth, Users)
│   │   ├── middleware/           # Session guards & global error handlers
│   │   ├── routes/               # Express endpoints mapped to validators
│   │   ├── types/                # Extended Express requests & database interfaces
│   │   └── index.ts              # Express Server entrypoint
│   ├── .env                      # Server credentials
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── api/                  # Axios configurations, authentication, and user API methods
│   │   ├── components/           # Shared components (Layout, ProtectedRoute, Navbar, SearchBar, Pagination, ConfirmDialog)
│   │   ├── context/              # AuthContext provider for global auth state
│   │   ├── hooks/                # useUsers hook for debounced search, page routing, and api interaction
│   │   ├── pages/                # Views (Login, Register, Dashboard, CreateUser, EditUser, ViewUser)
│   │   ├── styles/               # Tailwind v4 configuration, fonts, and theme styling
│   │   ├── types/                # Common typescript interfaces
│   │   ├── main.tsx              # React mounting script
│   │   └── App.tsx               # App router, Toast Provider, and route paths
│   ├── .env                      # Client API URL configuration
│   ├── package.json
│   └── vite.config.ts            # Vite configuration & path aliases
│
└── .gitignore                    # Global ignore definitions
```

---

## 3. Configuration & Run Instructions

Follow the steps below to configure and launch both services locally:

### Prerequisites
1. **Node.js** (v18+ recommended)
2. **MongoDB** (Ensure local MongoDB is running or configure an Atlas Connection String)

---

### Step 1: Run the Backend Server

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables. Create a `.env` file in the `backend/` directory:
   ```ini
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/usermanagement
   JWT_SECRET=your_super_secret_jwt_key_change_in_production
   JWT_EXPIRES_IN=7d
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```
4. Start the backend in development (auto-reload) mode:
   ```bash
   npm run dev
   ```
   *The console should print:* `MongoDB Connected: 127.0.0.1` and `Server running in development mode on port 5000`.

---

### Step 2: Run the Frontend Application

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up client environment variables. Create a `.env` file in the `frontend/` directory:
   ```ini
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The console should print:* `Local: http://localhost:5173/`. Open this link in your browser to interact with the app.

---

## 4. Key Workflows & Operations

1. **Admin Authorization:**
   - Register an administrator profile at `http://localhost:5173/register`.
   - Log in using credentials at `http://localhost:5173/login`.
   
2. **User Enrollment Wizard:**
   - Add a new record via the dashboard.
   - **Step 1 (Personal details):** Input name, father's name, mobile (10 digits), Aadhaar (12 digits), and PAN (10 characters, automatic uppercase conversion).
   - **Step 2 (Land and Location details):** Add District, Tehsil, and Gao details. Dynamic rows let you add multiple survey numbers and rakhva (hectares).
   - **Step 3 (Live Preview):** Verifies the layout is correct and shows the running total summation of all land holdings.
   
3. **Database Audit Reports:**
   - Filter, paginate, and query the list instantly via the dashboard search bar.
   - Click **Export Database (Excel)** to download a generated spreadsheet of the registry records.
   - Click **Edit** to modify records or **Delete** to trigger the modal dialog to delete a entry permanently.
