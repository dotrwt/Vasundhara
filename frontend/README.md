# User Management System

## Important Notice
⚠️ **This application is for internal testing purposes only.** Figma Make is not intended for collecting or storing Personally Identifiable Information (PII) such as Aadhar numbers, PAN details, or other sensitive data in a production environment.

## Getting Started

### First Time Setup

1. **Create an Admin Account**
   
   Click on "Create admin account" on the login page, or navigate to `/signup`.
   
   Fill in:
   - Full Name
   - Email
   - Password (minimum 6 characters)
   
   Click "Create Account"

2. **Login**
   
   After creating the admin account, you'll be redirected to the login page. Enter your credentials to access the dashboard.

## Features

### Authentication
- Simple email/password login
- Secure session management
- Auto-confirmed email (no email server required)

### Dashboard
- View all users in a table format
- Search by Name, Mobile, Aadhar, PAN, or Village
- Export data to CSV/Excel
- Pagination for large datasets

### Create New User
**Step 1: User Details**
- Name
- Father Name
- Mobile Number (10 digits)
- Aadhar Number (12 digits)
- PAN Number (format: ABCDE1234F)
- PAN File Upload (optional)

**Step 2: Land Details**
- Jila
- Tehsil
- Gao (Village)
- Land Records (add multiple)
  - Survey Number
  - Rakhva
- Auto-calculated Total Rakhva

**Step 3: Preview**
- Review all entered data
- Edit if needed
- Save options:
  - Save & Create Another
  - Save & Go to Dashboard

### Edit User
- Modify all user and land details
- Real-time validation
- Auto-calculated Total Rakhva

### View User
- Read-only view of all user information
- Quick access to Edit mode

### Delete User
- Confirmation dialog before deletion
- Permanent removal from database

## Technical Details

### Architecture
- **Frontend**: React + TypeScript + Tailwind CSS
- **Router**: React Router (Data Mode)
- **Backend**: Supabase Edge Functions (Hono server)
- **Database**: Supabase Key-Value Store
- **Authentication**: Supabase Auth

### Data Storage
User data is stored in the Supabase KV store with the following structure:
- User Details (name, father name, mobile, aadhar, pan, etc.)
- Land Details (jila, tehsil, gao)
- Land Records array (survey numbers and rakhva values)
- Auto-calculated Total Rakhva
- Timestamps (createdAt, updatedAt)
- User references (createdBy, updatedBy)

## UX Design Principles

This application follows government-form-like design principles:
- ✅ Large, clear input fields
- ✅ Visible labels (not just placeholders)
- ✅ High contrast text for readability
- ✅ Large primary buttons
- ✅ Keyboard-friendly (Tab navigation)
- ✅ Simple error messages in plain language
- ✅ Minimal colors (white background, soft grey borders)
- ✅ Desktop-first, but responsive
- ✅ No unnecessary animations or gradients

## Validation Rules

### Mobile Number
- Must be exactly 10 digits
- Numeric only

### Aadhar Number
- Must be exactly 12 digits
- Numeric only

### PAN Number
- Format: 5 letters + 4 digits + 1 letter
- Example: ABCDE1234F
- Auto-converted to uppercase

### Land Records
- Survey Number: Required, text
- Rakhva: Required, must be greater than 0

## Keyboard Shortcuts
- **Tab**: Navigate between fields
- **Enter**: Submit forms (on buttons)
- **Escape**: Close dialogs

## Support

For issues or questions, contact your system administrator.