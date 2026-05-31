<div align='center'>

# Vasundhara — Frontend

</div>

The frontend is a **React + Vite + TypeScript** single-page application styled with **Tailwind CSS v4**. It provides a clean, responsive interface for admin authentication, land record management, and registry auditing.

---

## 📁 Directory Structure

```
frontend/
├── src/
│   ├── api/
│   │   ├── axios.ts           # Axios instance with base URL & auth header injection
│   │   ├── auth.ts            # Login & register API methods
│   │   └── users.ts           # Land record CRUD & export API methods
│   ├── components/
│   │   ├── Layout.tsx         # App shell with navbar
│   │   ├── Navbar.tsx         # Top navigation bar
│   │   ├── ProtectedRoute.tsx # Guards authenticated-only routes
│   │   ├── SearchBar.tsx      # Debounced search input
│   │   ├── Pagination.tsx     # Page navigation controls
│   │   └── ConfirmDialog.tsx  # Reusable delete confirmation modal
│   ├── context/
│   │   └── AuthContext.tsx    # Global auth state provider (login, logout, token)
│   ├── hooks/
│   │   └── useUsers.ts        # Debounced search, pagination, and API interaction
│   ├── pages/
│   │   ├── Login.tsx          # Admin login page
│   │   ├── Register.tsx       # Admin registration page
│   │   ├── Dashboard.tsx      # Main registry table with search/export/delete
│   │   ├── CreateUser.tsx     # Multi-step enrollment wizard
│   │   ├── EditUser.tsx       # Edit an existing land record
│   │   └── ViewUser.tsx       # Read-only detail view of a record
│   ├── styles/
│   │   └── index.css          # Tailwind v4 config, fonts, and global theme
│   ├── types/
│   │   └── index.ts           # Shared TypeScript interfaces (User, AuthResponse, etc.)
│   ├── App.tsx                # Route definitions and Toast provider
│   └── main.tsx               # React DOM mount point
├── .env                       # Client environment variables
├── package.json
└── vite.config.ts             # Vite config with path aliases
```

---

## Setup & Configuration

### 1. Install dependencies

```bash
cd frontend
npm install
```

### 2. Create a `.env` file

```env
VITE_API_URL=http://localhost:5000/api
```

> The backend must be running at the URL specified above.

### 3. Start the development server

```bash
npm run dev
```

Expected output:

```
  VITE v5.x.x  ready in Xms

  ➜  Local:   http://localhost:5173/
```

Open `http://localhost:5173` in your browser.

---

## Pages & Routes

| Route       | Page       | Auth Required | Description                                |
| ----------- | ---------- | ------------- | ------------------------------------------ |
| `/login`    | Login      | ❌            | Admin sign-in                              |
| `/register` | Register   | ❌            | Admin account creation                     |
| `/`         | Dashboard  | ✅            | Paginated land registry with search/export |
| `/create`   | CreateUser | ✅            | 3-step land record enrollment wizard       |
| `/edit/:id` | EditUser   | ✅            | Edit an existing record                    |
| `/view/:id` | ViewUser   | ✅            | Read-only record detail view               |

---

## Component Guide

### `AuthContext`

Provides `user`, `token`, `login()`, and `logout()` globally. Wrap the app with `<AuthProvider>` in `main.tsx`.

### `ProtectedRoute`

Redirects unauthenticated users to `/login`. Wrap any private route with this component.

### `useUsers` hook

Handles:

- Debounced search query state
- Current page and total page count
- Fetching, creating, updating, and deleting records via the API

### `CreateUser` — Multi-step Wizard

| Step                | Fields                                                                       |
| ------------------- | ---------------------------------------------------------------------------- |
| 1 — Personal        | Name, Father's Name, Mobile (10 digits), Aadhaar (12 digits), PAN (10 chars) |
| 2 — Land & Location | District, Tehsil, Gaon, dynamic Survey Number + Rakhva (hectares) rows       |
| 3 — Preview         | Read-only summary with running total of all land holdings                    |

---

## Key Dependencies

| Package            | Purpose                          |
| ------------------ | -------------------------------- |
| `react`            | UI library                       |
| `react-router-dom` | Client-side routing (v7)         |
| `vite`             | Build tool and dev server        |
| `tailwindcss`      | Utility-first CSS framework (v4) |
| `react-hook-form`  | Form state management            |
| `zod`              | Schema-based runtime validation  |
| `axios`            | HTTP client                      |
| `sonner`           | Toast notification library       |
| `typescript`       | Static typing                    |

---

## 🔐Auth Flow

1. Admin logs in via `/login` → receives JWT from the backend
2. Token is stored in `AuthContext` and injected into all Axios requests via a request interceptor
3. `ProtectedRoute` checks auth state on every navigation
4. On logout, token is cleared and the user is redirected to `/login`

---

<p align="center">
  Developed by <a href="https://dotrwt.in">dotrwt</a>
</p>
