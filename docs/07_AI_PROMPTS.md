
# 07_AI_PROMPTS.md

# Commute Connect - AI Prompt Library
Version: 1.0

Use this workflow for every coding session.

---

## Session 0 - Understand Project

Read every file inside /docs.
Do not generate code.
Summarize:
- Product
- Architecture
- UI philosophy
- Tech stack
- Current phase
List any contradictions before continuing.

---

## Session Rules

Always follow:
- 00_AI_RULES.md
- 01_PROJECT_BRIEF.md
- 02_PRODUCT_REQUIREMENTS.md
- 03_DESIGN_SYSTEM.md

Never invent features outside the MVP.

Work on only ONE module at a time.

---

## Prompt 1 - Project Setup

Read all documentation.
Initialize the project using the approved architecture.
Do not implement business features yet.
Create a clean, production-ready foundation.

---

## Prompt 2 - Design System

Implement reusable UI components:
Buttons
Inputs
Cards
Dialogs
Modals
Skeletons
Empty States
Navigation

Ensure responsive behavior.

---

## Prompt 3 - Landing Page

Read Module 2 from PRODUCT_REQUIREMENTS.
Build only the landing page.
Use reusable components.
Do not continue to authentication.

---

## Prompt 4 - Authentication

Implement:
Register
Login
Forgot Password
Protected Routes

Follow architecture and validation rules.

---

## Prompt 5 - User Profile

Implement profile viewing and editing.
Support Driver, Passenger and Both roles.

---

## Prompt 6 - Driver Dashboard

Build only the Driver Dashboard.
Use realistic dummy data if backend is incomplete.
Focus on polish and responsiveness.

---

## Prompt 7 - Passenger Dashboard

Implement dashboard according to documentation.
Keep UI consistent with Driver Dashboard.

---

## Prompt 8 - Search Rides

Implement filters.
Display beautiful ride cards.
Support loading, empty and error states.

---

## Prompt 9 - Ride Details

Build the ride details page.
Hide private information until request acceptance.

---

## Prompt 10 - Create Ride

Implement complete form with validation.
Use React Hook Form and Zod.

---

## Prompt 11 - Ride Requests

Implement:
Pending
Accepted
Rejected
Cancelled

Provide clear status indicators.

---

## Prompt 12 - Chat

Build one-to-one chat unlocked after ride acceptance.
Keep interface simple and clean.

---

## Prompt 13 - Reviews

Implement rating and optional comments.
Display average ratings on profiles.

---

## Prompt 14 - Admin Dashboard

Implement:
Users
Routes
Reports
Statistics

Restrict access to admin role.

---

## Prompt 15 - Backend Integration

Replace mock data with API integration.
Keep UI unchanged.

---

## Prompt 16 - Final Polish

Review the entire project.

Improve:
Accessibility
Performance
Animations
Spacing
Responsiveness
Loading states
Error handling
Empty states

Do not add new features.

---

## Bug Fix Prompt

Read relevant documentation.
Fix only the reported issue.
Do not refactor unrelated code.
Explain root cause and solution.

---

## Refactor Prompt

Improve code quality without changing functionality.
Reduce duplication.
Improve readability.
Keep public behavior identical.

---

## UI Review Prompt

Review the UI like a senior product designer.

Identify:
- Inconsistent spacing
- Typography issues
- Weak hierarchy
- Poor responsiveness
- Accessibility issues

Implement improvements while respecting the design system.

---

## Final Validation Prompt

Review the entire application against all documentation.

Verify:
- Feature completeness
- Design consistency
- API integration
- Responsive behavior
- Accessibility
- Production readiness

Return a checklist of completed and missing items.
