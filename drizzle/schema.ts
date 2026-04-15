import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, json, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Volunteer application submissions.
 */
export const volunteerSubmissions = mysqlTable("volunteer_submissions", {
  id: int("id").autoincrement().primaryKey(),
  fullName: varchar("fullName", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  dateOfBirth: varchar("dateOfBirth", { length: 64 }),
  nationality: varchar("nationality", { length: 128 }),
  languages: text("languages"),
  intendedDates: varchar("intendedDates", { length: 255 }),
  howHelp: text("howHelp"),
  experience: text("experience"),
  whyVolunteer: text("whyVolunteer"),
  criminalRecord: varchar("criminalRecord", { length: 255 }),
  convictions: varchar("convictions", { length: 255 }),
  codeOfConduct: varchar("codeOfConduct", { length: 255 }),
  hearAbout: varchar("hearAbout", { length: 255 }),
  status: mysqlEnum("status", ["pending", "reviewed", "approved", "rejected"]).default("pending").notNull(),
  adminNotes: text("adminNotes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type VolunteerSubmission = typeof volunteerSubmissions.$inferSelect;
export type InsertVolunteerSubmission = typeof volunteerSubmissions.$inferInsert;

/**
 * Volunteer testimonials / stories displayed on the About page.
 */
export const testimonials = mysqlTable("testimonials", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  nameMn: varchar("nameMn", { length: 255 }),
  duration: varchar("duration", { length: 255 }).notNull(),
  durationMn: varchar("durationMn", { length: 255 }),
  quote: text("quote").notNull(),
  quoteMn: text("quoteMn"),
  isPublished: boolean("isPublished").default(true).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = typeof testimonials.$inferInsert;

/**
 * Page content management — structured content for each page section.
 * Each row = one content block identified by pageKey + sectionKey.
 *
 * Bilingual support:
 *   - title / content / metadata  → English (admin-entered)
 *   - titleMn / contentMn / metadataMn → Mongolian (auto-translated + admin-editable)
 *
 * Translation is triggered automatically when admin saves English content.
 * Admin can review and manually correct the Mongolian translation in the panel.
 */
export const pageContent = mysqlTable("page_content", {
  id: int("id").autoincrement().primaryKey(),
  pageKey: varchar("pageKey", { length: 64 }).notNull(),
  sectionKey: varchar("sectionKey", { length: 128 }).notNull(),

  // English (source) fields
  title: text("title"),
  content: text("content"),
  imageUrl: text("imageUrl"),
  metadata: json("metadata"),

  // Mongolian (translated) fields
  titleMn: text("titleMn"),
  contentMn: text("contentMn"),
  metadataMn: json("metadataMn"),

  updatedBy: int("updatedBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PageContent = typeof pageContent.$inferSelect;
export type InsertPageContent = typeof pageContent.$inferInsert;

/**
 * Blog posts for the News & Updates page.
 * Supports bilingual content (EN + MN auto-translated).
 * Slug is a URL-friendly identifier derived from the title.
 */
export const blogPosts = mysqlTable("blog_posts", {
  id: int("id").autoincrement().primaryKey(),

  // URL-friendly slug (e.g. "lotus-bakery-project")
  slug: varchar("slug", { length: 255 }).notNull().unique(),

  // English (admin-entered)
  title: varchar("title", { length: 512 }).notNull(),
  summary: text("summary"),
  content: text("content").notNull(),
  category: varchar("category", { length: 128 }),
  author: varchar("author", { length: 255 }),
  coverImageUrl: text("coverImageUrl"),

  // Mongolian (auto-translated + admin-editable)
  titleMn: varchar("titleMn", { length: 512 }),
  summaryMn: text("summaryMn"),
  contentMn: text("contentMn"),
  categoryMn: varchar("categoryMn", { length: 128 }),

  // Publishing
  isPublished: boolean("isPublished").default(false).notNull(),
  publishedAt: timestamp("publishedAt"),

  // Metadata
  createdBy: int("createdBy"),
  updatedBy: int("updatedBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;

/**
 * Volunteer application form field configuration.
 * Each row defines one field in the dynamic volunteer form.
 * Admin can add, reorder, and toggle fields.
 * Bilingual: label (EN) + labelMn (auto-translated MN).
 */
export const volunteerFormFields = mysqlTable("volunteer_form_fields", {
  id: int("id").autoincrement().primaryKey(),

  // Field identity
  fieldKey: varchar("fieldKey", { length: 128 }).notNull().unique(), // e.g. "fullName", "whyVolunteer"
  fieldType: mysqlEnum("fieldType", ["text", "email", "textarea", "select", "date", "tel"]).default("text").notNull(),

  // English label (admin-entered)
  label: varchar("label", { length: 512 }).notNull(),
  placeholder: varchar("placeholder", { length: 512 }),

  // Mongolian label (auto-translated + admin-editable)
  labelMn: varchar("labelMn", { length: 512 }),
  placeholderMn: varchar("placeholderMn", { length: 512 }),

  // Select options (JSON array of {value, label, labelMn})
  options: json("options"),

  // Field behaviour
  isRequired: boolean("isRequired").default(false).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),

  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type VolunteerFormField = typeof volunteerFormFields.$inferSelect;
export type InsertVolunteerFormField = typeof volunteerFormFields.$inferInsert;

/**
 * Dynamic volunteer application submissions.
 * Stores the raw JSON payload of field values keyed by fieldKey.
 */
export const volunteerApplications = mysqlTable("volunteer_applications", {
  id: int("id").autoincrement().primaryKey(),
  data: json("data").notNull(), // Record<fieldKey, string>
  status: mysqlEnum("status", ["pending", "reviewed", "approved", "rejected"]).default("pending").notNull(),
  adminNotes: text("adminNotes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type VolunteerApplication = typeof volunteerApplications.$inferSelect;
export type InsertVolunteerApplication = typeof volunteerApplications.$inferInsert;

/**
 * Contact Us form submissions from the public website.
 */
export const contactMessages = mysqlTable("contact_messages", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  subject: varchar("subject", { length: 500 }).notNull(),
  message: text("message").notNull(),
  status: mysqlEnum("status", ["unread", "read", "replied"]).default("unread").notNull(),
  adminNotes: text("adminNotes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = typeof contactMessages.$inferInsert;

/**
 * Team Members — dynamic list of staff shown on the About page
 */
export const teamMembers = mysqlTable("team_members", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  nameMn: varchar("nameMn", { length: 255 }),
  role: varchar("role", { length: 255 }).notNull(),
  roleMn: varchar("roleMn", { length: 255 }),
  photoUrl: text("photoUrl"),
  color: varchar("color", { length: 50 }).default("bg-lotus-green").notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type TeamMember = typeof teamMembers.$inferSelect;
export type InsertTeamMember = typeof teamMembers.$inferInsert;

/**
 * Media Gallery — photos and videos for the Photos & Videos page.
 * type: "photo" = image (URL), "video" = YouTube embed URL
 * Bilingual: title/description (EN) + titleMn/descriptionMn (auto-translated MN)
 */
export const mediaItems = mysqlTable("media_items", {
  id: int("id").autoincrement().primaryKey(),
  type: mysqlEnum("type", ["photo", "video"]).notNull().default("photo"),
  title: varchar("title", { length: 500 }),
  titleMn: varchar("titleMn", { length: 500 }),
  description: text("description"),
  descriptionMn: text("descriptionMn"),
  url: text("url").notNull(), // S3 URL for photos, YouTube URL for videos
  thumbnailUrl: text("thumbnailUrl"), // optional custom thumbnail
  sortOrder: int("sortOrder").default(0).notNull(),
  isPublished: boolean("isPublished").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type MediaItem = typeof mediaItems.$inferSelect;
export type InsertMediaItem = typeof mediaItems.$inferInsert;
