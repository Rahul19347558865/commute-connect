
# 04_TECHNICAL_ARCHITECTURE.md

# Commute Connect Technical Architecture
Version: 1.0

---

# Purpose

Define the technical foundation of the project so every contributor and AI coding agent follows the same architecture.

---

# Tech Stack

## Frontend
- React
- Vite
- Tailwind CSS
- React Router
- React Hook Form
- Zod

## Backend
- Node.js
- Express.js

## Database
- Supabase (PostgreSQL)

## Authentication
- Supabase Auth

## Maps
- OpenStreetMap + Leaflet

## Image Storage
- Cloudinary

## Deployment
- Frontend: Vercel
- Backend: Render
- Database: Supabase

---

# High-Level Architecture

Client (React)
        ↓
Express REST API
        ↓
Supabase Database
        ↓
Cloudinary (Images)

---

# Frontend Structure

src/
- assets/
- components/
- layouts/
- pages/
- hooks/
- services/
- utils/
- context/
- types/
- routes/

Reusable components should live in components/.

---

# Backend Structure

backend/
- controllers/
- routes/
- middleware/
- services/
- models/
- utils/
- config/
- server.js

Business logic belongs in services, not route files.

---

# Routing

Public Routes
- /
- /login
- /register
- /about

Protected Routes
- /dashboard
- /search
- /routes
- /requests
- /messages
- /profile
- /settings

Admin Routes
- /admin

---

# Authentication Flow

1. Register
2. Email verification (if enabled)
3. Login
4. Session created
5. Protected routes accessible
6. Logout destroys session

---

# Authorization

Roles:
- Driver
- Passenger
- Both
- Admin

Access should be validated on both frontend and backend.

---

# State Management

Use:
- React Context for global user/session state
- Local state where appropriate

Avoid unnecessary global state.

---

# API Design

Principles:
- RESTful
- JSON responses
- Proper HTTP status codes
- Centralized error handling

---

# Error Handling

Return:
- 200 Success
- 201 Created
- 400 Validation Error
- 401 Unauthorized
- 403 Forbidden
- 404 Not Found
- 500 Server Error

Always include readable error messages.

---

# Validation

Frontend:
- React Hook Form
- Zod

Backend:
- Validate all incoming data
- Never trust client input

---

# Security

- Environment variables for secrets
- Input validation
- Sanitized data
- Protected routes
- Rate limiting (future)

---

# Performance

- Lazy load pages
- Optimize images
- Reuse components
- Minimize bundle size
- Avoid unnecessary renders

---

# Coding Standards

- Meaningful names
- Small reusable functions
- Consistent formatting
- No duplicated code
- Clear comments only when needed

---

# Git Workflow

main
develop
feature/<feature-name>

Commit after every completed module.

---

# Deployment Checklist

- Build passes
- No console errors
- Environment variables configured
- Responsive verified
- Authentication tested
- API tested
- Lighthouse review
- Final deployment

---

# Definition of Production Ready

A feature is production-ready when it is:
- Functional
- Responsive
- Accessible
- Validated
- Error handled
- Loading state supported
- Empty state supported
- Cleanly coded
- Consistent with the design system
