/**
 * Blog post procedures — access control and input validation tests.
 * These tests verify router-level behaviour without hitting the real DB.
 */
import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext() {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@lotus.org",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
  const ctx: TrpcContext = {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as TrpcContext["res"],
  };
  return { ctx, user };
}

function createRegularUserContext() {
  const user: AuthenticatedUser = {
    id: 2,
    openId: "regular-user",
    email: "user@example.com",
    name: "Regular User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
  const ctx: TrpcContext = {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as TrpcContext["res"],
  };
  return { ctx };
}

function createUnauthenticatedContext() {
  const ctx: TrpcContext = {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as TrpcContext["res"],
  };
  return { ctx };
}

// ─── Public blog procedures ──────────────────────────────────

describe("public blog procedures", () => {
  it("allows unauthenticated users to list published posts", async () => {
    const { ctx } = createUnauthenticatedContext();
    const caller = appRouter.createCaller(ctx);
    // DB may not be available in test env — should return empty array, not throw
    const result = await caller.blog.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("allows unauthenticated users to get a post by slug", async () => {
    const { ctx } = createUnauthenticatedContext();
    const caller = appRouter.createCaller(ctx);
    // Non-existent slug — should return null, not throw
    const result = await caller.blog.getBySlug({ slug: "non-existent-slug" });
    expect(result).toBeNull();
  });

  it("allows regular users to list published posts", async () => {
    const { ctx } = createRegularUserContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.blog.list();
    expect(Array.isArray(result)).toBe(true);
  });
});

// ─── Admin blog access control ───────────────────────────────

describe("admin.blog — access control", () => {
  it("denies unauthenticated users access to admin.blog.list", async () => {
    const { ctx } = createUnauthenticatedContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.admin.blog.list()).rejects.toThrow();
  });

  it("denies regular users access to admin.blog.list", async () => {
    const { ctx } = createRegularUserContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.admin.blog.list()).rejects.toThrow();
  });

  it("denies unauthenticated users from creating a post", async () => {
    const { ctx } = createUnauthenticatedContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.admin.blog.create({ title: "Test", content: "Body", skipAutoTranslate: true })
    ).rejects.toThrow();
  });

  it("denies regular users from creating a post", async () => {
    const { ctx } = createRegularUserContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.admin.blog.create({ title: "Test", content: "Body", skipAutoTranslate: true })
    ).rejects.toThrow();
  });

  it("denies unauthenticated users from deleting a post", async () => {
    const { ctx } = createUnauthenticatedContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.admin.blog.delete({ id: 1 })).rejects.toThrow();
  });

  it("denies regular users from toggling publish status", async () => {
    const { ctx } = createRegularUserContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.admin.blog.togglePublish({ id: 1, isPublished: true })
    ).rejects.toThrow();
  });
});

// ─── Admin blog input validation ─────────────────────────────

describe("admin.blog — input validation", () => {
  it("rejects create with empty title", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.admin.blog.create({ title: "", content: "Body", skipAutoTranslate: true })
    ).rejects.toThrow();
  });

  it("rejects create with empty content", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.admin.blog.create({ title: "Valid Title", content: "", skipAutoTranslate: true })
    ).rejects.toThrow();
  });

  it("rejects update with missing id", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    // @ts-expect-error intentionally missing id
    await expect(caller.admin.blog.update({ title: "Updated" })).rejects.toThrow();
  });

  it("rejects delete with missing id", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    // @ts-expect-error intentionally missing id
    await expect(caller.admin.blog.delete({})).rejects.toThrow();
  });

  it("rejects togglePublish with missing isPublished", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    // @ts-expect-error intentionally missing isPublished
    await expect(caller.admin.blog.togglePublish({ id: 1 })).rejects.toThrow();
  });
});

// ─── generateSlug helper ─────────────────────────────────────

import { generateSlug } from "./db";

describe("generateSlug", () => {
  it("converts title to lowercase slug", () => {
    expect(generateSlug("Hello World")).toBe("hello-world");
  });

  it("removes special characters", () => {
    expect(generateSlug("Lotus Bakery Project!")).toBe("lotus-bakery-project");
  });

  it("collapses multiple spaces and dashes", () => {
    expect(generateSlug("  Multiple   Spaces  ")).toBe("multiple-spaces");
  });

  it("handles Mongolian characters gracefully", () => {
    const slug = generateSlug("Лотус нарийн боовны төсөл");
    // Non-ASCII chars are stripped, result may be empty or partial — just ensure no error
    expect(typeof slug).toBe("string");
  });

  it("truncates very long titles", () => {
    const longTitle = "a".repeat(300);
    expect(generateSlug(longTitle).length).toBeLessThanOrEqual(200);
  });
});
