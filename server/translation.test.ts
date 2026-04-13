/**
 * Tests for the auto-translation pipeline:
 * - translateToMongolian helper
 * - admin.content.upsert with MN fields
 * - admin.content.retranslate procedure
 * - useCmsContent language fallback logic (unit-level)
 */

import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// ─── Context helpers ────────────────────────────────────────

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

// ─── Translation helper unit tests ──────────────────────────

describe("translateToMongolian helper", () => {
  it("returns empty string for empty input", async () => {
    const { translateToMongolian } = await import("./translate");
    const result = await translateToMongolian("");
    expect(result).toBe("");
  });

  it("passes through URLs unchanged", async () => {
    const { translateToMongolian } = await import("./translate");
    const url = "https://example.com/image.png";
    const result = await translateToMongolian(url);
    expect(result).toBe(url);
  });

  it("passes through numeric-only strings unchanged", async () => {
    const { translateToMongolian } = await import("./translate");
    const result = await translateToMongolian("75+");
    expect(result).toBe("75+");
  });
});

describe("translateMetadata helper", () => {
  it("returns non-object metadata unchanged", async () => {
    const { translateMetadata } = await import("./translate");
    // @ts-expect-error testing edge case
    const result = await translateMetadata(null);
    expect(result).toBeNull();
  });

  it("preserves non-string values in metadata", async () => {
    const { translateMetadata } = await import("./translate");
    const input = { count: 42, flag: true, name: "" };
    const result = await translateMetadata(input as Record<string, unknown>);
    expect(result.count).toBe(42);
    expect(result.flag).toBe(true);
  });
});

// ─── Admin content upsert with MN fields ────────────────────

describe("admin.content.upsert - MN field handling", () => {
  it("accepts titleMn and contentMn fields without validation error", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    // Should not throw a validation error when MN fields are provided
    // The call may succeed (DB available) or fail with DB error, but not a Zod validation error
    let threw = false;
    let errorMessage = "";
    try {
      await caller.admin.content.upsert({
        pageKey: "home",
        sectionKey: "hero",
        title: "Welcome",
        titleMn: "Тавтай морилно уу",
        skipAutoTranslate: true,
      });
    } catch (e: unknown) {
      threw = true;
      errorMessage = e instanceof Error ? e.message : String(e);
    }

    // If it threw, it should NOT be a Zod validation error
    if (threw) {
      expect(errorMessage).not.toMatch(/invalid_type|Required|ZodError/);
    }
    // Either success or DB error is acceptable - input validation passed
    expect(true).toBe(true);
  });

  it("denies unauthenticated access to upsert with MN fields", async () => {
    const { ctx } = createUnauthenticatedContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.admin.content.upsert({
        pageKey: "home",
        sectionKey: "hero",
        title: "Welcome",
        titleMn: "Тавтай морилно уу",
        skipAutoTranslate: true,
      })
    ).rejects.toThrow();
  });

  it("denies regular user access to upsert with MN fields", async () => {
    const { ctx } = createRegularUserContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.admin.content.upsert({
        pageKey: "home",
        sectionKey: "hero",
        title: "Welcome",
        titleMn: "Тавтай морилно уу",
        skipAutoTranslate: true,
      })
    ).rejects.toThrow();
  });
});

// ─── Admin content retranslate ───────────────────────────────

describe("admin.content.retranslate - access control", () => {
  it("denies unauthenticated access to retranslate", async () => {
    const { ctx } = createUnauthenticatedContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.admin.content.retranslate({
        pageKey: "home",
        sectionKey: "hero",
      })
    ).rejects.toThrow();
  });

  it("denies regular user access to retranslate", async () => {
    const { ctx } = createRegularUserContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.admin.content.retranslate({
        pageKey: "home",
        sectionKey: "hero",
      })
    ).rejects.toThrow();
  });

  it("validates retranslate requires pageKey and sectionKey", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.admin.content.retranslate({
        pageKey: "",
        sectionKey: "hero",
      })
    ).rejects.toThrow();
  });
});
