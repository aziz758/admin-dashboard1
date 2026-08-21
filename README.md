# Fi Khedmtak — Admin Dashboard

> A React and TypeScript administrative dashboard for managing the Fi Khedmtak field service platform.

## Overview

Fi Khedmtak Admin Dashboard is the web-based administration panel for the Fi Khedmtak service platform.

It provides administrators with a centralized interface to monitor service activity, manage technicians and users, review service requests and ratings, and send notifications.

The dashboard communicates with the Fi Khedmtak FastAPI backend through a REST API and uses role-protected routes for authenticated administrative access.

## Features

### Dashboard

- View platform statistics
- Monitor technicians, service requests, and customer satisfaction
- Display recent platform activity
- Refresh statistics and dashboard data
- Handle loading and API error states

### Technician Management

- Browse technicians with pagination
- Filter technicians by status
- View technician details
- Review submitted documents
- Approve technician accounts
- Reject technician accounts with a reason

### Service Requests

- Browse service requests
- Filter requests by status
- Paginate request results
- View detailed request information
- Monitor request progress from the administration panel

### User Management

- Browse platform users
- Search users by name or phone number
- Filter users by role
- Paginate results
- Remove users through the admin API
- Confirm destructive actions before execution

### Ratings

- View customer ratings
- Monitor rating statistics
- Browse ratings with pagination

### Notifications

- Create broadcast notifications
- Select notification recipients
- Send notifications through the backend notification system

## Application Architecture

```text
┌──────────────────────────┐
│    Admin Web Dashboard   │
│      React + TypeScript  │
└────────────┬─────────────┘
             │
             │ REST API
             ▼
┌──────────────────────────┐
│     FastAPI Backend      │
│      Fi Khedmtak API     │
└────────────┬─────────────┘
             │
       ┌─────┴─────┐
       ▼           ▼
    MySQL       Firebase
               Notifications
```

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Material UI (MUI)
- React Router
- React Query (TanStack Query)
- Axios
- Recharts
- React Hot Toast

### Backend Integration

- REST API
- JWT authentication
- FastAPI

## Project Structure

```text
src/
├── components/
│   ├── auth/
│   ├── dashboard/
│   ├── layout/
│   └── common/
│
├── constants/
├── hooks/
├── layouts/
├── lib/
├── mappers/
├── pages/
├── routes/
├── services/
├── theme/
├── types/
└── utils/
```

The project separates UI components, pages, API services, React Query hooks, routes, types, mapping utilities, and shared helpers to keep responsibilities organized.

## Data Fetching

The dashboard uses TanStack Query for server-state management.

The general data flow is:

```text
Page
  ↓
React Query Hook
  ↓
Admin Service
  ↓
Axios API Client
  ↓
FastAPI Backend
```

This approach keeps API communication separate from presentation components and provides built-in caching, loading states, refetching, and error handling.

## API Client

The application uses a centralized Axios client for communication with the backend.

The client:

- Uses the configured `VITE_API_URL` as its API base URL.
- Automatically appends `/api` when required.
- Adds the JWT access token to authenticated requests.
- Handles unauthorized `401` responses centrally.
- Clears the local authentication session and redirects to the login page when authentication is no longer valid.

## Authentication & Protected Routes

Administrative pages are protected behind an authentication layer.

```text
/login
   │
   ▼
ProtectedRoute
   │
   ├── Dashboard
   ├── Technicians
   ├── Requests
   ├── Users
   ├── Ratings
   └── Notifications
```

The application currently stores the access token through a dedicated authentication storage abstraction. This keeps authentication storage logic separate from the rest of the application and allows the strategy to be changed in the future without rewriting the application.

## Environment Variables

Create a `.env` or `.env.local` file in the project root.

Example:

```env
VITE_API_URL=http://localhost:8000/api
```

The API URL can also be provided without `/api`; the API client appends it automatically.

> Do not commit local `.env` files or secrets to the repository.

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/aziz758/admin-dashboard1.git
cd admin-dashboard1
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the API

Create `.env` or `.env.local`:

```env
VITE_API_URL=http://localhost:8000/api
```

Make sure the Fi Khedmtak FastAPI backend is running.

### 4. Start the development server

```bash
npm run dev
```

The Vite development server will display the local URL in the terminal.

### 5. Build for production

```bash
npm run build
```

## Related Project

The dashboard is designed to work with the Fi Khedmtak backend:

**Backend:** https://github.com/aziz758/backend_fikh

The backend provides authentication, service requests, technician matching, user management, notifications, ratings, and other platform APIs consumed by this dashboard.

## Project Status

**Graduation Project — MVP**

The dashboard was developed as the administrative interface for the Fi Khedmtak graduation project.

## Future Improvements

Potential improvements include:

- Automated frontend tests
- More advanced analytics and reporting
- Exportable reports
- Improved authentication storage using secure HttpOnly cookies
- Additional administrative controls

## Author

**Aziz Mohammed Abduljabbar Saad Al-maqtari**

GitHub: https://github.com/aziz758