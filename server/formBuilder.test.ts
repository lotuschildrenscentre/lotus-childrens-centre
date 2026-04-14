/**
 * Tests for the dynamic volunteer form builder procedures
 */
import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function makeCtx(user: AuthenticatedUser | null): TrpcContext {
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as TrpcContext["res"],
  };
}

function adminUser(): AuthenticatedUser {
  return {
    id: 1,
    openId: "admin-open-id",
    name: "Admin",
    email: "admin@test.com",
    role: "admin",
    loginMethod: "manus",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
}

function regularUser(): AuthenticatedUser {
  return {
    id: 2,
    openId: "user-open-id",
    name: "User",
    email: "user@test.com",
    role: "user",
    loginMethod: "manus",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
}

// ─── Public form fields ────────────────────────────────────────────────────

describe("volunteerForm.fields - public access", () => {
  it("allows unauthenticated users to get active form fields", async () => {
    const caller = appRouter.createCaller(makeCtx(null));
    const fields = await caller.volunteerForm.fields();
    expect(Array.isArray(fields)).toBe(true);
  });

  it("allows regular users to get active form fields", async () => {
    const caller = appRouter.createCaller(makeCtx(regularUser()));
    const fields = await caller.volunteerForm.fields();
    expect(Array.isArray(fields)).toBe(true);
  });
});

// ─── Public form submission ────────────────────────────────────────────────

describe("volunteerForm.submit - public access", () => {
  it("allows unauthenticated users to submit an application", async () => {
    const caller = appRouter.createCaller(makeCtx(null));
    const result = await caller.volunteerForm.submit({
      data: {
        fullName: "Test Applicant",
        email: "test@example.com",
        nationality: "British",
      },
    });
    expect(result.success).toBe(true);
  });

  it("allows regular users to submit an application", async () => {
    const caller = appRouter.createCaller(makeCtx(regularUser()));
    const result = await caller.volunteerForm.submit({
      data: {
        fullName: "Registered User",
        email: "registered@example.com",
      },
    });
    expect(result.success).toBe(true);
  });
});

// ─── Admin form builder CRUD ───────────────────────────────────────────────

describe("admin.form - access control", () => {
  it("allows admin to list all form fields (including inactive)", async () => {
    const caller = appRouter.createCaller(makeCtx(adminUser()));
    const fields = await caller.admin.form.fields();
    expect(Array.isArray(fields)).toBe(true);
  });

  it("denies regular user access to admin form fields", async () => {
    const caller = appRouter.createCaller(makeCtx(regularUser()));
    await expect(caller.admin.form.fields()).rejects.toThrow();
  });

  it("denies anonymous access to admin form fields", async () => {
    const caller = appRouter.createCaller(makeCtx(null));
    await expect(caller.admin.form.fields()).rejects.toThrow();
  });

  it("allows admin to create a form field (skipAutoTranslate to avoid LLM in tests)", async () => {
    const caller = appRouter.createCaller(makeCtx(adminUser()));
    const result = await caller.admin.form.createField({
      fieldKey: `test_field_${Date.now()}`,
      fieldType: "text",
      label: "Test Field",
      labelMn: "Тест талбар",
      isRequired: false,
      isActive: true,
      skipAutoTranslate: true,
    });
    expect(result.success).toBe(true);
  });

  it("denies regular user from creating a form field", async () => {
    const caller = appRouter.createCaller(makeCtx(regularUser()));
    await expect(
      caller.admin.form.createField({
        fieldKey: "blocked_field",
        fieldType: "text",
        label: "Blocked",
        isRequired: false,
        isActive: true,
        skipAutoTranslate: true,
      })
    ).rejects.toThrow();
  });
});

// ─── Admin applications ────────────────────────────────────────────────────

describe("admin.form.applications - access control", () => {
  it("allows admin to list volunteer applications", async () => {
    const caller = appRouter.createCaller(makeCtx(adminUser()));
    const apps = await caller.admin.form.applications();
    expect(Array.isArray(apps)).toBe(true);
  });

  it("denies regular user from listing applications", async () => {
    const caller = appRouter.createCaller(makeCtx(regularUser()));
    await expect(caller.admin.form.applications()).rejects.toThrow();
  });

  it("denies anonymous user from listing applications", async () => {
    const caller = appRouter.createCaller(makeCtx(null));
    await expect(caller.admin.form.applications()).rejects.toThrow();
  });
});
