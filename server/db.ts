import { eq, desc, asc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  volunteerSubmissions,
  InsertVolunteerSubmission,
  testimonials,
  InsertTestimonial,
  pageContent,
  InsertPageContent,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
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

    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
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
