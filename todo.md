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

## Get Involved Page CMS Expansion
- [ ] Audit full Get Involved page and map all editable sections
- [ ] Update cmsConfig.ts with all missing Get Involved sections
- [ ] Wire GetInvolved.tsx to CMS for all sections
- [ ] Test all changes

## Auto-Translation Pipeline (EN → MN)
- [x] DB schema: add titleMn, contentMn, metadataMn fields to page_content table
- [x] Server: build translateToMongolian() helper using built-in LLM
- [x] Server: update upsertPageContent to auto-translate on save and store MN fields
- [x] Server: update admin.updateContent procedure to trigger re-translation on edit
- [x] Admin panel: show MN translation alongside EN input, allow manual correction
- [x] Admin panel: "Re-translate" button to regenerate MN translation
- [x] useCmsContent hook: serve MN content when language === "mn", fallback to EN
- [x] All frontend components: pass current language to useCmsContent for MN serving (via useCmsContent hook)
- [x] Write vitest tests for translation pipeline (11 new tests, 35 total)

## Blog Post Management (News & Updates)

- [x] Add blog_posts table to DB schema with EN + MN bilingual fields
- [x] Push DB migration
- [x] Add blog DB helpers: getBlogPosts, getBlogPostBySlug, getBlogPostById, createBlogPost, updateBlogPost, deleteBlogPost, generateSlug
- [x] Add public tRPC procedures: blog.list, blog.getBySlug
- [x] Add admin tRPC procedures: admin.blog.list, create, update, delete, togglePublish, uploadCoverImage
- [x] Auto-translate EN fields to MN on create/update
- [x] Build AdminBlogPosts page with list view, create/edit editor, publish toggle, delete
- [x] Add "Blog Posts" sidebar item to admin layout
- [x] Register /admin/blog route in App.tsx
- [x] Rewrite Blog.tsx to load posts from DB; fall back to static posts when no DB posts are published
- [x] Write vitest tests for blog procedures (19 tests, 54 total)

## Bug Fix: Volunteer Section MN Translation Not Displaying

- [x] Fix sectionKey mismatch: About.tsx uses "volunteers" but cmsConfig/DB uses "volunteerInfo"
- [x] Audit all About.tsx cms.get() calls and align sectionKeys with cmsConfig.ts
- [x] Audit all other pages for similar sectionKey mismatches (GetInvolved and Home components are correct)
- [x] Verify MN content displays correctly on UI after fix (54 tests pass)

## Feature: Volunteer Testimonials Auto-Translation

- [x] Understand current testimonials data structure in cmsConfig and About.tsx
- [x] Add nameMn, durationMn, quoteMn columns to DB schema and push migration
- [x] Update admin panel testimonials editor to show MN translations and allow manual correction
- [x] Update About.tsx to serve MN testimonial content when language is MN
- [x] Auto-translate testimonials on save using the LLM translation pipeline
- [x] Add Re-translate button per testimonial card in admin panel

## Feature: Dynamic Volunteer Application Form Builder

- [x] Read current volunteer form, submissions schema, router, and all volunteer button locations
- [x] Add volunteer_form_fields table to DB schema and push migration
- [x] Add DB helpers: getFormFields, createFormField, updateFormField, deleteFormField, reorderFormFields, createVolunteerApplication, getVolunteerApplications
- [x] Add tRPC procedures: volunteerForm.fields (public), volunteerForm.submit (public), admin.form CRUD with auto-translate
- [x] Build admin Form Builder UI — add/edit/reorder/delete fields with EN+MN labels, Re-translate button, applications tab
- [x] Rebuild public volunteer form to render dynamically from field config (bilingual EN/MN)
- [x] All volunteer buttons already link to /about?tab=volunteers&view=form (no changes needed)
- [x] Write vitest tests for form builder procedures (12 new tests, 66 total)

## Feature: Configurable Volunteer Form Intro Text

- [ ] Read AdminFormBuilder, About.tsx volunteer form, DB schema to understand structure
- [ ] Add form_settings table (or reuse page_content) to store intro text EN + MN
- [ ] Add DB helpers and tRPC procedures for form settings CRUD
- [ ] Update AdminFormBuilder UI: editable intro text field with MN translation + live preview
- [ ] Update public volunteer form to display configurable intro text (EN or MN based on language)
- [ ] Write/update vitest tests

## Feature: Contact Messages Admin Panel

- [ ] Read current Contact Us form and admin panel structure
- [ ] Add contact_messages table to DB schema (name, email, subject, message, status, createdAt)
- [ ] Push DB migration for new table
- [ ] Add DB helpers: createContactMessage, getContactMessages, updateContactMessageStatus, deleteContactMessage
- [ ] Add tRPC procedures: public contact.submit + admin contact CRUD
- [ ] Update Contact Us form to submit via tRPC (store in DB)
- [ ] Build admin Contact Messages UI with list, read, status management, delete
- [ ] Write vitest tests for contact message procedures

## Feature: Dynamic Team Members

- [ ] Add team_members table to DB schema (id, name, nameMn, role, roleMn, photo, color, sortOrder, isActive)
- [ ] Push DB migration
- [ ] Add DB helpers: getTeamMembers, createTeamMember, updateTeamMember, deleteTeamMember
- [ ] Add tRPC procedures: public team.list + admin team CRUD with auto-translation
- [ ] Build admin Team Members UI with EN/MN fields, Re-translate, add/edit/delete
- [ ] Update About.tsx to load team members from DB, show only active members
- [ ] Remove hardcoded staff slots from cmsConfig.ts

## Feature: Photos & Videos Gallery

- [x] Add media_items table to DB schema (id, type, title, titleMn, description, descriptionMn, url, thumbnailUrl, sortOrder, isPublished, createdAt, updatedAt)
- [x] Push DB migration for media_items
- [x] Add DB helpers: getMediaItems, getMediaItemById, createMediaItem, updateMediaItem, deleteMediaItem
- [x] Add public tRPC procedure: gallery.list (published only)
- [x] Add admin tRPC procedures: admin.gallery.list, create, update, retranslate, delete, uploadImage
- [x] Auto-translate EN title/description to MN on create/update
- [x] Build AdminGallery.tsx — photo/video grid, add/edit dialog with upload, EN+MN fields, Re-translate, delete
- [x] Add Gallery nav item to AdminLayout sidebar
- [x] Register /admin/gallery route in App.tsx
- [x] Build public Gallery.tsx — masonry grid, filter tabs (All/Photos/Videos), modal with description + navigation
- [x] Add "Photos & Videos" nav link to Navbar (key: nav.photos, href: /gallery)
- [x] Register /gallery route in App.tsx
- [x] Write vitest tests for gallery procedures (8 new tests, 85 total)
