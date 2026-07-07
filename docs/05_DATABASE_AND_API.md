
# 05_DATABASE_AND_API.md

# Commute Connect Database & API
Version: 1.0

---

# Database Tables

## users
- id (UUID, PK)
- full_name
- email
- role (driver, passenger, both, admin)
- profile_photo
- college_company
- bio
- vehicle_type
- vehicle_number (optional)
- rating
- reviews_count
- created_at
- updated_at

---

## routes
- id (UUID, PK)
- driver_id (FK -> users.id)
- from_location
- to_location
- pickup_landmark
- departure_time
- return_time
- travel_days
- seats_available
- contribution_type (free/paid)
- contribution_amount
- status (active, paused, completed)
- created_at

---

## ride_requests
- id (UUID, PK)
- route_id (FK)
- passenger_id (FK)
- message
- status (pending, accepted, rejected, cancelled)
- created_at

---

## messages
- id (UUID, PK)
- request_id (FK)
- sender_id (FK)
- message
- created_at

---

## reviews
- id (UUID, PK)
- ride_request_id (FK)
- reviewer_id (FK)
- reviewee_id (FK)
- rating
- comment
- created_at

---

## reports
- id (UUID, PK)
- reporter_id
- reported_user_id
- reason
- status
- created_at

---

# Relationships

users 1 -> many routes

users 1 -> many ride_requests

routes 1 -> many ride_requests

ride_requests 1 -> many messages

ride_requests 1 -> review (per participant)

---

# REST API

## Authentication

POST /api/auth/register

POST /api/auth/login

POST /api/auth/logout

GET /api/auth/me

---

## Users

GET /api/users/profile

PUT /api/users/profile

GET /api/users/:id

---

## Routes

POST /api/routes

GET /api/routes

GET /api/routes/:id

PUT /api/routes/:id

DELETE /api/routes/:id

---

## Search

GET /api/routes/search

Supported Query Parameters

pickup

destination

departureTime

vehicle

days

free

---

## Ride Requests

POST /api/requests

GET /api/requests

PATCH /api/requests/:id/accept

PATCH /api/requests/:id/reject

DELETE /api/requests/:id

---

## Messages

GET /api/messages/:requestId

POST /api/messages

---

## Reviews

POST /api/reviews

GET /api/reviews/:userId

---

## Reports

POST /api/reports

GET /api/reports

(Admin only)

---

# Standard API Response

Success

{
  "success": true,
  "data": {}
}

Error

{
  "success": false,
  "message": "Readable error message"
}

---

# Validation Rules

Users
- Unique email
- Strong password

Routes
- From and To required
- Seats > 0
- Contribution >= 0

Requests
- One active request per passenger per route

Reviews
- Rating: 1–5
- Comment optional

---

# Security

- Protect all private endpoints
- Validate ownership before update/delete
- Sanitize input
- Never expose sensitive fields

---

# Future Tables

- notifications
- saved_routes
- favorites
- audit_logs

These are intentionally excluded from MVP.
