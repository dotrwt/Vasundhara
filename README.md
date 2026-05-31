<div align='center'>

<img src='https://github.com/dotrwt/Vasundhara/blob/main/frontend/src/assets/Vasundhara_logo2.png' alt='logo' height='200'>

# 🌿 Vasundhara — Land Registry & Audit Portal

</div>

A complete, production-ready **Land Audit Registry and User Management Portal** built with a TypeScript-first fullstack architecture. Vasundhara enables administrators to enroll, manage, and audit land ownership records with support for Indian government identifiers (Aadhaar, PAN), multi-parcel land data, and Excel-based audit exports.

Live at : <a href='https://vlms.dotrwt.in'>https://vlms.dotrwt.in</a>

<img src='https://github.com/dotrwt/Vasundhara/blob/main/VLSM_UI.png' alt='UI'>

---

## Repository Structure

```
Vasundhara/
├── backend/          # Node.js + Express + TypeScript REST API
├── frontend/         # React + Vite + TypeScript UI
├── .gitignore
└── README.md
```

---

## Tech Stack

| Layer      | Technology                                        |
| ---------- | ------------------------------------------------- |
| Backend    | Node.js, Express, TypeScript, Mongoose (MongoDB)  |
| Frontend   | React, Vite, TypeScript, Tailwind CSS v4          |
| Auth       | JWT (header-based), bcryptjs                      |
| Validation | express-validator (API), Zod + React Hook Form    |
| Export     | `xlsx` — server-side Excel spreadsheet generation |
| Routing    | React Router v7 with protected routes             |
| Toasts     | Sonner                                            |

---

## Getting Started

### Prerequisites

- **Node.js** v18+
- **MongoDB** running locally or an Atlas connection string

### 1. Clone the repository

```bash
git clone https://github.com/dotrwt/Vasundhara.git
cd Vasundhara
```

### 2. Start the Backend

```bash
cd backend
npm install
# Create a .env file (see backend/README.md for variables)
npm run dev
```

### 3. Start the Frontend

```bash
cd frontend
npm install
# Create a .env file (see frontend/README.md for variables)
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Key Features

- **Admin authentication** — Secure register/login with JWT and bcrypt
- **Multi-step user enrollment wizard**
  - Step 1: Personal details (Name, Father's Name, Mobile, Aadhaar, PAN)
  - Step 2: Land & location details (District, Tehsil, Gaon, dynamic survey rows)
  - Step 3: Live preview with running total of all land holdings
- **Dashboard** — Paginated, searchable registry of all records
- **Excel export** — Download the full registry as a formatted `.xlsx` spreadsheet
- **Record management** — Edit and delete entries with confirmation dialogs

---

## Documentation

- [Backend README](./backend/README.md) — API setup, environment variables, routes
- [Frontend README](./frontend/README.md) — UI setup, pages, component structure

---

<p align="center">
  Developed by <a href="https://dotrwt.in">dotrwt</a>
</p>
