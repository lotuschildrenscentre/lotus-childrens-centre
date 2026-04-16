import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
  json,
  boolean,
  serial,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["user", "admin"]);
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const volunteerStatusEnum = pgEnum("volunteer_status", ["pending", "reviewed", "approved", "rejected"]);
export const volunteerSubmissions = pgTable("volunteer_submissions", {
  id: serial("id").primaryKey(),
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
  status: volunteerStatusEnum("status").default("pending").notNull(),
  adminNotes: text("adminNotes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
export type VolunteerSubmission = typeof volunteerSubmissions.$inferSelect;
export type InsertVolunteerSubmission = typeof volunteerSubmissions.$inferInsert;

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  nameMn: varchar("nameMn", { length: 255 }),
  duration: varchar("duration", { length: 255 }).notNull(),
  durationMn: varchar("durationMn", { length: 255 }),
  quote: text("quote").notNull(),
  quoteMn: text("quoteMn"),
  isPublished: boolean("isPublished").default(true).notNull(),
  sortOrder: integer("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = typeof testimonials.$inferInsert;

export const pageContent = pgTable("page_content", {
  id: serial("id").primaryKey(),
  pageKey: varchar("pageKey", { length: 64 }).notNull(),
  sectionKey: varchar("sectionKey", { length: 128 }).notNull(),
  title: text("title"),
  content: text("content"),
  imageUrl: text("imageUrl"),
  metadata: json("metadata"),
  titleMn: text("titleMn"),
  contentMn: text("contentMn"),
  metadataMn: json("metadataMn"),
  updatedBy: integer("updatedBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
export type PageContent = typeof pageContent.$inferSelect;
export type InsertPageContent = typeof pageContent.$inferInsert;

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 512 }).notNull(),
  summary: text("summary"),
  content: text("content").notNull(),
  category: varchar("category", { length: 128 }),
  author: varchar("author", { length: 255 }),
  coverImageUrl: text("coverImageUrl"),
  titleMn: varchar("titleMn", { length: 512 }),
  summaryMn: text("summaryMn"),
  contentMn: text("contentMn"),
  categoryMn: varchar("categoryMn", { length: 128 }),
  isPublished: boolean("isPublished").default(false).notNull(),
  publishedAt: timestamp("publishedAt"),
  createdBy: integer("createdBy"),
  updatedBy: integer("updatedBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;

export const fieldTypeEnum = pgEnum("field_type", ["text", "email", "textarea", "select", "date", "tel"]);
export const volunteerFormFields = pgTable("volunteer_form_fields", {
  id: serial("id").primaryKey(),
  fieldKey: varchar("fieldKey", { length: 128 }).notNull().unique(),
  fieldType: fieldTypeEnum("fieldType").default("text").notNull(),
  label: varchar("label", { length: 512 }).notNull(),
  placeholder: varchar("placeholder", { length: 512 }),
  labelMn: varchar("labelMn", { length: 512 }),
  placeholderMn: varchar("placeholderMn", { length: 512 }),
  options: json("options"),
  isRequired: boolean("isRequired").default(false).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  sortOrder: integer("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
export type VolunteerFormField = typeof volunteerFormFields.$inferSelect;
export type InsertVolunteerFormField = typeof volunteerFormFields.$inferInsert;

export const appStatusEnum = pgEnum("app_status", ["pending", "reviewed", "approved", "rejected"]);
export const volunteerApplications = pgTable("volunteer_applications", {
  id: serial("id").primaryKey(),
  data: json("data").notNull(),
  status: appStatusEnum("status").default("pending").notNull(),
  adminNotes: text("adminNotes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
export type VolunteerApplication = typeof volunteerApplications.$inferSelect;
export type InsertVolunteerApplication = typeof volunteerApplications.$inferInsert;

export const contactStatusEnum = pgEnum("contact_status", ["unread", "read", "replied"]);
export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  subject: varchar("subject", { length: 500 }).notNull(),
  message: text("message").notNull(),
  status: contactStatusEnum("status").default("unread").notNull(),
  adminNotes: text("adminNotes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = typeof contactMessages.$inferInsert;

export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  nameMn: varchar("nameMn", { length: 255 }),
  role: varchar("role", { length: 255 }).notNull(),
  roleMn: varchar("roleMn", { length: 255 }),
  photoUrl: text("photoUrl"),
  color: varchar("color", { length: 50 }).default("bg-lotus-green").notNull(),
  sortOrder: integer("sortOrder").default(0).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
export type TeamMember = typeof teamMembers.$inferSelect;
export type InsertTeamMember = typeof teamMembers.$inferInsert;

export const mediaTypeEnum = pgEnum("media_type", ["photo", "video"]);
export const mediaItems = pgTable("media_items", {
  id: serial("id").primaryKey(),
  type: mediaTypeEnum("type").notNull().default("photo"),
  title: varchar("title", { length: 500 }),
  titleMn: varchar("titleMn", { length: 500 }),
  description: text("description"),
  descriptionMn: text("descriptionMn"),
  url: text("url").notNull(),
  thumbnailUrl: text("thumbnailUrl"),
  sortOrder: integer("sortOrder").default(0).notNull(),
  isPublished: boolean("isPublished").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
export type MediaItem = typeof mediaItems.$inferSelect;
export type InsertMediaItem = typeof mediaItems.$inferInsert;

export const partners = pgTable("partners", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 500 }).notNull(),
  logoUrl: text("logoUrl").notNull(),
  websiteUrl: varchar("websiteUrl", { length: 1000 }),
  sortOrder: integer("sortOrder").default(0).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type Partner = typeof partners.$inferSelect;
export type InsertPartner = typeof partners.$inferInsert;
