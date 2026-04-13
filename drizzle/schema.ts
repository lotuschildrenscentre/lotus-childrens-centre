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
  duration: varchar("duration", { length: 255 }).notNull(),
  quote: text("quote").notNull(),
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
