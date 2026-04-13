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
- [x] Ensure admin panel link is clearly visible in footer and links to /admin

## Content Management System (CMS) Rebuild
- [x] Audit all pages to map editable text fields and images per section
- [x] Redesign DB schema for section-based content with image support
- [x] Build admin content editor UI with page selector and section forms
- [x] Add image upload support (S3) for admin content editing
- [x] Update Home page to load content from DB with defaults (Hero, About, Impact, CTA, Contact)
- [x] Update About page to load content from DB with defaults (Hero, Mission image)
- [x] Update Get Involved page to load content from DB with defaults (Hero, Why section)
- [x] Update Contact section to load content from DB with defaults
- [x] Update Blog page to load content from DB with defaults (Hero)
- [x] Test full CMS flow and write vitest tests (24 tests pass)

## CMS Expansion - Full Home Page Coverage
- [x] Service Cards: Volunteer card (title, description, button text)
- [x] Service Cards: Donation card (title, description, button text, button link)
- [x] Service Cards: Fundraise card (title, description, button text, button link)
- [x] Who We Are: 3 bullet points (primary care, education, life skills)
- [x] Impact Stats: 3 description texts under the stats
- [x] Partners/Sponsors section content
- [x] Contact Us section (all fields)
- [x] Footer content (address, phone, email, social links, description)
- [x] Update cmsConfig.ts with all new sections
- [x] Update AdminContent.tsx to handle new section types (links, bullet points) — generic editor already handles text/textarea/image
- [x] Wire ServiceCards.tsx to CMS
- [x] Wire AboutSection.tsx bullet points to CMS
- [x] Wire ImpactStats.tsx descriptions to CMS
- [x] Wire SponsorsSection.tsx to CMS
- [x] Wire ContactSection.tsx fully to CMS
- [x] Wire Footer.tsx to CMS
- [x] Test all changes (24 tests pass)

## About Page CMS Expansion
- [ ] Audit full About page content structure
- [ ] Add Hero section (title, subtitle, background image)
- [ ] Add Mission section (heading, description, image)
- [ ] Add History timeline (3 entries: year, title, description)
- [ ] Add Staff list (names, roles)
- [ ] Add Aims & Beliefs section (heading, 3 belief cards with title/description)
- [ ] Add Volunteer section (heading, description, image, fee info)
- [ ] Add FAQ items (questions and answers)
- [ ] Add CTA cards (Volunteer, Donate, Fundraise - titles, descriptions, button text, links)
- [ ] Wire About page to load all content from CMS with fallback to defaults
