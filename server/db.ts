import { eq, desc, asc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import {
  InsertUser,
  users,
  volunteerSubmissions,
  InsertVolunteerSubmission,
  testimonials,
  InsertTestimonial,
  pageContent,
  InsertPageContent,
  blogPosts,
  InsertBlogPost,
  volunteerFormFields,
  InsertVolunteerFormField,
  volunteerApplications,
  InsertVolunteerApplication,
  contactMessages,
  InsertContactMessage,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _pool: Pool | null = null;
let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.DATABASE_URL?.includes("supabase") ? { rejectUnauthorized: false } : false,
      });
      _db = drizzle(_pool);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ─── User Helpers ───────────────────────────────────────────

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onConflictDoUpdate({ target: users.openId, set: updateSet });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllUsers() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(users).orderBy(desc(users.createdAt));
}

export async function updateUserRole(userId: number, role: "user" | "admin") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(users).set({ role }).where(eq(users.id, userId));
}

// ─── Volunteer Submission Helpers ───────────────────────────

export async function createVolunteerSubmission(data: InsertVolunteerSubmission) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(volunteerSubmissions).values(data);
}

export async function getVolunteerSubmissions() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(volunteerSubmissions).orderBy(desc(volunteerSubmissions.createdAt));
}

export async function getVolunteerSubmissionById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(volunteerSubmissions)
    .where(eq(volunteerSubmissions.id, id))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateVolunteerSubmissionStatus(
  id: number,
  status: "pending" | "reviewed" | "approved" | "rejected",
  adminNotes?: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const updateData: Record<string, unknown> = { status };
  if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
  await db.update(volunteerSubmissions).set(updateData).where(eq(volunteerSubmissions.id, id));
}

export async function deleteVolunteerSubmission(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(volunteerSubmissions).where(eq(volunteerSubmissions.id, id));
}

// ─── Testimonial Helpers ────────────────────────────────────

export async function getTestimonials(publishedOnly = false) {
  const db = await getDb();
  if (!db) return [];
  if (publishedOnly) {
    return db
      .select()
      .from(testimonials)
      .where(eq(testimonials.isPublished, true))
      .orderBy(asc(testimonials.sortOrder), desc(testimonials.createdAt));
  }
  return db.select().from(testimonials).orderBy(asc(testimonials.sortOrder), desc(testimonials.createdAt));
}

export async function createTestimonial(data: InsertTestimonial) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(testimonials).values(data);
}

export async function getTestimonialById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(testimonials).where(eq(testimonials.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function updateTestimonial(id: number, data: Partial<InsertTestimonial>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(testimonials).set(data).where(eq(testimonials.id, id));
}

export async function deleteTestimonial(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(testimonials).where(eq(testimonials.id, id));
}

// ─── Page Content Helpers ───────────────────────────────────

export async function getPageContent(pageKey: string) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(pageContent)
    .where(eq(pageContent.pageKey, pageKey))
    .orderBy(asc(pageContent.sectionKey));
}

export async function upsertPageContent(data: InsertPageContent) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Check if exists
  const existing = await db
    .select()
    .from(pageContent)
    .where(
      sql`${pageContent.pageKey} = ${data.pageKey} AND ${pageContent.sectionKey} = ${data.sectionKey}`
    )
    .limit(1);

  if (existing.length > 0) {
    const updateSet: Record<string, unknown> = {
      title: data.title,
      content: data.content,
      imageUrl: data.imageUrl,
      metadata: data.metadata,
      updatedBy: data.updatedBy,
    };

    // Only update MN fields if explicitly provided
    if (data.titleMn !== undefined) updateSet.titleMn = data.titleMn;
    if (data.contentMn !== undefined) updateSet.contentMn = data.contentMn;
    if (data.metadataMn !== undefined) updateSet.metadataMn = data.metadataMn;

    await db
      .update(pageContent)
      .set(updateSet)
      .where(eq(pageContent.id, existing[0].id));
  } else {
    await db.insert(pageContent).values(data);
  }
}

export async function getAllPageContent() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(pageContent).orderBy(asc(pageContent.pageKey), asc(pageContent.sectionKey));
}

// ─── Blog Post Helpers ─────────────────────────────────────

/** Generate a URL-safe slug from a title string */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 200);
}

export async function getBlogPosts(publishedOnly = true) {
  const db = await getDb();
  if (!db) return [];
  const query = db.select().from(blogPosts);
  if (publishedOnly) {
    return query.where(eq(blogPosts.isPublished, true)).orderBy(desc(blogPosts.publishedAt), desc(blogPosts.createdAt));
  }
  return query.orderBy(desc(blogPosts.createdAt));
}

export async function getBlogPostBySlug(slug: string) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
  return rows[0] ?? null;
}

export async function getBlogPostById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function createBlogPost(data: InsertBlogPost) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(blogPosts).values(data);
}

export async function updateBlogPost(
  id: number,
  data: Partial<InsertBlogPost>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(blogPosts).set(data).where(eq(blogPosts.id, id));
}

export async function deleteBlogPost(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(blogPosts).where(eq(blogPosts.id, id));
}

// ─── Dashboard Stats ────────────────────────────────────────

export async function getDashboardStats() {
  const db = await getDb();
  if (!db) return { totalUsers: 0, totalSubmissions: 0, pendingSubmissions: 0, totalTestimonials: 0 };

  const [userCount] = await db.select({ count: sql<number>`count(*)` }).from(users);
  const [submissionCount] = await db.select({ count: sql<number>`count(*)` }).from(volunteerSubmissions);
  const [pendingCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(volunteerSubmissions)
    .where(eq(volunteerSubmissions.status, "pending"));
  const [testimonialCount] = await db.select({ count: sql<number>`count(*)` }).from(testimonials);

  return {
    totalUsers: userCount.count,
    totalSubmissions: submissionCount.count,
    pendingSubmissions: pendingCount.count,
    totalTestimonials: testimonialCount.count,
  };
}

// ─── Volunteer Form Fields ───────────────────────────────────

export async function getFormFields(activeOnly = true) {
  const db = await getDb();
  if (!db) return [];
  const query = db.select().from(volunteerFormFields).orderBy(asc(volunteerFormFields.sortOrder), asc(volunteerFormFields.id));
  if (activeOnly) {
    return (await query).filter((f) => f.isActive);
  }
  return query;
}

export async function getFormFieldById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(volunteerFormFields).where(eq(volunteerFormFields.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function createFormField(data: InsertVolunteerFormField) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(volunteerFormFields).values(data);
}

export async function updateFormField(id: number, data: Partial<InsertVolunteerFormField>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(volunteerFormFields).set(data).where(eq(volunteerFormFields.id, id));
}

export async function deleteFormField(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(volunteerFormFields).where(eq(volunteerFormFields.id, id));
}

export async function reorderFormFields(orderedIds: number[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  for (let i = 0; i < orderedIds.length; i++) {
    await db.update(volunteerFormFields).set({ sortOrder: i }).where(eq(volunteerFormFields.id, orderedIds[i]));
  }
}

// ─── Volunteer Applications (dynamic submissions) ────────────

export async function getVolunteerApplications() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(volunteerApplications).orderBy(desc(volunteerApplications.createdAt));
}

export async function getVolunteerApplicationById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(volunteerApplications).where(eq(volunteerApplications.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function createVolunteerApplication(data: InsertVolunteerApplication) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(volunteerApplications).values(data);
}

export async function updateVolunteerApplicationStatus(
  id: number,
  status: "pending" | "reviewed" | "approved" | "rejected",
  adminNotes?: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(volunteerApplications).set({ status, ...(adminNotes !== undefined ? { adminNotes } : {}) }).where(eq(volunteerApplications.id, id));
}

export async function deleteVolunteerApplication(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(volunteerApplications).where(eq(volunteerApplications.id, id));
}

// ─── Contact Message Helpers ─────────────────────────────────

export async function createContactMessage(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const { contactMessages: cm } = await import("../drizzle/schema");
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(cm).values(data);
}

export async function getContactMessages() {
  const { contactMessages: cm } = await import("../drizzle/schema");
  const db = await getDb();
  if (!db) return [];
  return db.select().from(cm).orderBy(desc(cm.createdAt));
}

export async function getContactMessageById(id: number) {
  const { contactMessages: cm } = await import("../drizzle/schema");
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(cm).where(eq(cm.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function updateContactMessageStatus(
  id: number,
  status: "unread" | "read" | "replied",
  adminNotes?: string
) {
  const { contactMessages: cm } = await import("../drizzle/schema");
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db
    .update(cm)
    .set({ status, ...(adminNotes !== undefined ? { adminNotes } : {}) })
    .where(eq(cm.id, id));
}

export async function deleteContactMessage(id: number) {
  const { contactMessages: cm } = await import("../drizzle/schema");
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(cm).where(eq(cm.id, id));
}

// ─── Team Members ────────────────────────────────────────────────────────────
export async function getTeamMembers(activeOnly = false) {
  const { teamMembers } = await import("../drizzle/schema");
  const db = await getDb();
  if (!db) return [];
  const rows = await db
    .select()
    .from(teamMembers)
    .orderBy(teamMembers.sortOrder, teamMembers.id);
  return activeOnly ? rows.filter((r) => r.isActive) : rows;
}

export async function getTeamMemberById(id: number) {
  const { teamMembers } = await import("../drizzle/schema");
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(teamMembers).where(eq(teamMembers.id, id));
  return rows[0] ?? null;
}

export async function createTeamMember(data: {
  name: string;
  nameMn?: string;
  role: string;
  roleMn?: string;
  photoUrl?: string;
  color?: string;
  sortOrder?: number;
  isActive?: boolean;
}) {
  const { teamMembers } = await import("../drizzle/schema");
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(teamMembers).values({
    name: data.name,
    nameMn: data.nameMn ?? null,
    role: data.role,
    roleMn: data.roleMn ?? null,
    photoUrl: data.photoUrl ?? null,
    color: data.color ?? "bg-lotus-green",
    sortOrder: data.sortOrder ?? 0,
    isActive: data.isActive ?? true,
  }).returning({ id: teamMembers.id });
  return result;
}
export async function updateTeamMember(
  id: number,
  data: Partial<{
    name: string;
    nameMn: string | null;
    role: string;
    roleMn: string | null;
    photoUrl: string | null;
    color: string;
    sortOrder: number;
    isActive: boolean;
  }>
) {
  const { teamMembers } = await import("../drizzle/schema");
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(teamMembers).set(data).where(eq(teamMembers.id, id));
}

export async function deleteTeamMember(id: number) {
  const { teamMembers } = await import("../drizzle/schema");
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(teamMembers).where(eq(teamMembers.id, id));
}

// ─── Media Gallery helpers ───────────────────────────────────────────────────
export async function getMediaItems(publishedOnly = false) {
  const { mediaItems } = await import("../drizzle/schema");
  const db = await getDb();
  if (!db) return [];
  const rows = await db
    .select()
    .from(mediaItems)
    .orderBy(mediaItems.sortOrder, mediaItems.createdAt);
  return publishedOnly ? rows.filter((r) => r.isPublished) : rows;
}

export async function getMediaItemById(id: number) {
  const { mediaItems } = await import("../drizzle/schema");
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(mediaItems).where(eq(mediaItems.id, id));
  return rows[0] ?? null;
}

export async function createMediaItem(data: {
  type: "photo" | "video";
  title?: string | null;
  titleMn?: string | null;
  description?: string | null;
  descriptionMn?: string | null;
  url: string;
  thumbnailUrl?: string | null;
  sortOrder?: number;
  isPublished?: boolean;
}) {
  const { mediaItems } = await import("../drizzle/schema");
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(mediaItems).values({
    type: data.type,
    title: data.title ?? null,
    titleMn: data.titleMn ?? null,
    description: data.description ?? null,
    descriptionMn: data.descriptionMn ?? null,
    url: data.url,
    thumbnailUrl: data.thumbnailUrl ?? null,
    sortOrder: data.sortOrder ?? 0,
    isPublished: data.isPublished ?? true,
  }).returning({ id: mediaItems.id });
  return result;
}
export async function updateMediaItem(
  id: number,
  data: Partial<{
    type: "photo" | "video";
    title: string | null;
    titleMn: string | null;
    description: string | null;
    descriptionMn: string | null;
    url: string;
    thumbnailUrl: string | null;
    sortOrder: number;
    isPublished: boolean;
  }>
) {
  const { mediaItems } = await import("../drizzle/schema");
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(mediaItems).set(data).where(eq(mediaItems.id, id));
}

export async function deleteMediaItem(id: number) {
  const { mediaItems } = await import("../drizzle/schema");
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(mediaItems).where(eq(mediaItems.id, id));
}

// ─── Partners / Sponsors helpers ─────────────────────────────────────────────
export async function getPartners(activeOnly = false) {
  const { partners } = await import("../drizzle/schema");
  const db = await getDb();
  if (!db) return [];
  const rows = await db
    .select()
    .from(partners)
    .orderBy(asc(partners.sortOrder), asc(partners.createdAt));
  return activeOnly ? rows.filter((r) => r.isActive) : rows;
}

export async function getPartnerById(id: number) {
  const { partners } = await import("../drizzle/schema");
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(partners).where(eq(partners.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function createPartner(data: {
  name: string;
  logoUrl: string;
  websiteUrl?: string | null;
  sortOrder?: number;
  isActive?: boolean;
}) {
  const { partners } = await import("../drizzle/schema");
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(partners).values({
    name: data.name,
    logoUrl: data.logoUrl,
    websiteUrl: data.websiteUrl ?? null,
    sortOrder: data.sortOrder ?? 0,
    isActive: data.isActive ?? true,
  });
}

export async function updatePartner(
  id: number,
  data: Partial<{
    name: string;
    logoUrl: string;
    websiteUrl: string | null;
    sortOrder: number;
    isActive: boolean;
  }>
) {
  const { partners } = await import("../drizzle/schema");
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(partners).set(data).where(eq(partners.id, id));
}

export async function deletePartner(id: number) {
  const { partners } = await import("../drizzle/schema");
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(partners).where(eq(partners.id, id));
}
