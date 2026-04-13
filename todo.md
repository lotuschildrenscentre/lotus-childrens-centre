# Authentication Implementation

## Phase 1: Upgrade to Full-Stack
- [x] Run webdev_add_feature for web-db-user
- [x] Read upgrade README and understand auth system

## Phase 2: Build Auth Pages
- [x] Create Login page with Manus OAuth
- [x] Create Signup page (same flow via Manus OAuth)
- [x] Email verification handled by Manus OAuth provider
- [x] Style pages to match existing "Warm Embrace" design

## Phase 3: Footer Integration
- [x] Add Login/Signup link to Footer component (Staff Login + user state display)

## Phase 4: Testing
- [x] Test signup flow (Manus OAuth handles this)
- [x] Test login flow (auth.me returns user when logged in, null when not)
- [x] Test logout flow (clears session cookie)
- [x] Verify footer link works (Staff Login visible, shows user name when logged in)

## Notes
- Do NOT build admin panel yet — will be done after authentication is confirmed working

## UI Changes
- [x] Remove "Ready to Make a Difference" section from Get Involved page
- [x] Connect all Volunteer buttons to the existing volunteer application form

## Admin Panel
- [x] Database schema: volunteer_submissions table
- [x] Database schema: testimonials table
- [x] Database schema: page_content table
- [x] Server: DB helpers for all admin tables
- [x] Server: tRPC admin procedures (protected by admin role)
- [x] Admin panel: Dashboard layout with sidebar navigation
- [x] Admin panel: Volunteer submissions viewer (list + detail view)
- [x] Admin panel: Testimonials CRUD (add/edit/delete volunteer stories)
- [x] Admin panel: Page content management
- [x] Admin panel: User management with admin role assignment
- [x] Frontend: Wire volunteer application form to save submissions to DB
- [x] Frontend: Display testimonials from DB on About page volunteers section
- [x] Write vitest tests for admin procedures
