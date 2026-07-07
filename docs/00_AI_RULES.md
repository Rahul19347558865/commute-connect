# 00_AI_RULES.md

# Commute Connect - AI Development Rules

Version: 1.0

Status: Final

---

# Purpose

This document defines the permanent rules that every AI coding assistant (Antigravity, Claude, ChatGPT, Gemini, Cursor, etc.) must follow while building this project.

These rules override assumptions made by the AI.

The AI should NEVER redesign the product without explicit permission.

The AI should implement the product exactly as defined in the documentation.

---

# Product Identity

Commute Connect is a premium SaaS web application.

It is NOT a college project.

It should feel like a polished startup product.

The application focuses on recurring ride sharing between students and office employees.

The project values simplicity over feature count.

Every design and engineering decision should support this vision.

---

# Core Product Philosophy

Always prioritize the following:

1. Trust
2. Simplicity
3. Speed
4. Professional UI
5. Performance

If a feature makes the product more complicated without significantly improving user value, do not implement it.

---

# UI Philosophy

The interface should feel inspired by modern SaaS products.

Reference inspirations only:

- Uber
- Airbnb
- Linear
- Notion
- Stripe

Never copy their layouts.

Only learn from their quality.

The interface should feel

- Clean
- Premium
- Spacious
- Professional
- Modern
- Friendly

---

# Design Rules

Never clutter the screen.

One page should solve one problem.

Every page must have one clear primary action.

Whitespace is part of the design.

Consistency is more important than creativity.

Avoid unnecessary visual effects.

Avoid decorative elements that reduce readability.

---

# Responsive Rules

Always design Mobile First.

Support the following breakpoints:

390px

768px

1024px

1440px

Layouts should never break.

Buttons should always remain touch friendly.

Forms should always remain usable on mobile.

---

# Component Rules

Always reuse components.

Never duplicate UI.

Create reusable:

Buttons

Cards

Input Fields

Dropdowns

Modals

Badges

Avatars

Dialogs

Navigation

Tables

Empty States

Loading States

Error Components

---

# Colors

Only use colors defined inside Design System.

Never invent new colors.

Never randomly change shades.

Maintain consistency.

---

# Typography

Use one font family.

Use a clear hierarchy.

Headings should remain consistent.

Paragraph spacing should remain consistent.

Avoid tiny text.

---

# Cards

Rounded corners.

Soft shadow.

Good spacing.

No heavy borders.

Professional appearance.

---

# Buttons

Primary Button

Filled

Secondary Button

Outlined

Danger Button

Red

Success Button

Green

Never invent random button styles.

---

# Forms

Validate instantly.

Display helpful validation messages.

Never reload the page after submission.

Keep forms short.

Only ask for necessary information.

---

# Animations

Animations should be subtle.

Duration:

150ms–250ms

No bouncing.

No flashy effects.

Animations should improve usability.

---

# Loading States

Every page must have loading state.

Prefer skeleton loaders.

Avoid spinners whenever possible.

---

# Empty States

Every page displaying data must have an empty state.

Include:

Helpful illustration

Friendly message

Clear call to action

Never display:

"No Data Found"

without guidance.

---

# Error Handling

Every page must gracefully handle:

Network failure

Server failure

Validation failure

Authentication failure

Unexpected errors

Always provide actionable messages.

---

# Accessibility

Maintain sufficient contrast.

Visible keyboard focus.

Proper labels.

Semantic HTML.

Touch-friendly controls.

Readable typography.

---

# Performance Rules

Prefer reusable components.

Lazy load large pages.

Optimize images.

Avoid unnecessary re-renders.

Avoid unnecessary dependencies.

Performance is a feature.

---

# Code Quality

Write modular code.

Use meaningful names.

Avoid large files.

Separate UI from business logic.

Keep components focused.

Avoid duplicated code.

Prefer composition over repetition.

---

# Security

Never expose secrets.

Validate input.

Sanitize user-generated content.

Protect private routes.

Follow authentication best practices.

---

# User Experience

Every interaction should provide feedback.

Every important action should display success or failure.

Reduce the number of clicks whenever possible.

Never confuse the user.

The user should always know:

Where they are.

What they can do.

What happens next.

---

# Feature Scope

Implement ONLY features defined inside Product Requirements.

Do not invent additional functionality.

Do not increase project complexity.

If uncertain, ask before implementing.

---

# AI Behavior Rules

Do not redesign the UI.

Do not replace the color palette.

Do not replace typography.

Do not restructure folders.

Do not introduce new libraries without approval.

Do not generate placeholder features that are outside MVP.

Do not skip responsive behavior.

Do not skip loading states.

Do not skip error handling.

Do not skip empty states.

Do not skip accessibility.

---

# Definition of Done

A feature is complete only if:

✓ Functional

✓ Responsive

✓ Accessible

✓ Uses reusable components

✓ Matches design system

✓ Handles errors

✓ Handles loading

✓ Handles empty states

✓ Clean code

✓ No console errors

✓ No TypeScript/ESLint errors (if applicable)

✓ Ready for production

---

# Final Rule

Whenever there is a conflict between implementation convenience and product quality,

always choose product quality.