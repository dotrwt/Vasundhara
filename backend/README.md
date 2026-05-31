<div align='center'>

# Vasundhara — Backend

</div>

The backend is a RESTful API built with **Node.js, Express, and TypeScript**, using **MongoDB** as the database via Mongoose. It handles admin authentication, land record CRUD operations, input validation, and Excel export.

---

## Directory Structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.ts              # MongoDB connection initialization
│   ├── controllers/
│   │   ├── authController.ts  # Register & login business logic
│   │   └── userController.ts  # Land record CRUD logic
│   ├── middleware/
│   │   ├── authMiddleware.ts  # JWT session guard
│   │   └── errorHandler.ts    # Global error handler
│   ├── models/
│   │   ├── Admin.ts           # Mongoose schema for admin accounts
│   │   └── User.ts            # Mongoose schema for land records
│   ├── routes/
│   │   ├── authRoutes.ts      # /api/auth endpoints
│   │   └── userRoutes.ts      # /api/users endpoints
│   ├── types/
│   │   └── index.ts           # Extended Express request types & DB interfaces
│   └── index.ts               # Express server entrypoint
├── .env                       # Environment variables (do not commit)
├── package.json
└── tsconfig.json
```

---

## Setup & Configuration

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Create a `.env` file

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/usermanagement
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

> Never commit your `.env` file. It is listed in `.gitignore`.

### 3. Start the development server

```bash
npm run dev
```

Expected output:

```
MongoDB Connected: 127.0.0.1
Server running in development mode on port 5000
```

---

## API Endpoints

### Auth — `/api/auth`

| Method | Endpoint             | Description           | Auth Required |
| ------ | -------------------- | --------------------- | ------------- |
| POST   | `/api/auth/register` | Register a new admin  | ❌            |
| POST   | `/api/auth/login`    | Login and receive JWT | ❌            |

### Users (Land Records) — `/api/users`

| Method | Endpoint            | Description                        | Auth Required |
| ------ | ------------------- | ---------------------------------- | ------------- |
| GET    | `/api/users`        | Get all records (paginated/search) | ✅            |
| POST   | `/api/users`        | Create a new land record           | ✅            |
| GET    | `/api/users/:id`    | Get a single record                | ✅            |
| PUT    | `/api/users/:id`    | Update a record                    | ✅            |
| DELETE | `/api/users/:id`    | Delete a record                    | ✅            |
| GET    | `/api/users/export` | Export all records as `.xlsx`      | ✅            |

---

## Authentication

- JWT tokens are issued on login and must be passed in the `Authorization` header:
  ```
  Authorization: Bearer <token>
  ```
- Tokens expire based on `JWT_EXPIRES_IN` (default: `7d`)
- Passwords are hashed using **bcryptjs** before storage

---

## Key Dependencies

| Package             | Purpose                           |
| ------------------- | --------------------------------- |
| `express`           | HTTP server framework             |
| `mongoose`          | MongoDB ODM                       |
| `jsonwebtoken`      | JWT generation and verification   |
| `bcryptjs`          | Password hashing                  |
| `express-validator` | Input sanitization and validation |
| `xlsx`              | Excel spreadsheet generation      |
| `typescript`        | Static typing                     |
| `ts-node-dev`       | Development auto-reload           |

---

## Data Models

### Admin

```typescript
{
  name: string;
  email: string; // unique
  password: string; // bcrypt hashed
  createdAt: Date;
}
```

### User (Land Record)

```typescript
{
  name: string
  fatherName: string
  mobile: string      // 10 digits
  aadhaar: string     // 12 digits
  pan: string         // 10 characters (auto-uppercased)
  district: string
  tehsil: string
  gaon: string
  landEntries: [
    {
      surveyNumber: string
      rakhva: number    // hectares
    }
  ]
  createdAt: Date
}
```

---

<p align="center">
  Developed by <a href="https://dotrwt.in">dotrwt</a>
</p>
