import { describe, expect, it } from "vitest";
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
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
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
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx, user };
}

function createUnauthenticatedContext() {
  const ctx: TrpcContext = {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

describe("admin procedures - access control", () => {
  it("denies unauthenticated users access to admin.stats", async () => {
    const { ctx } = createUnauthenticatedContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.admin.stats()).rejects.toThrow();
  });

  it("denies regular users access to admin.stats", async () => {
    const { ctx } = createRegularUserContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.admin.stats()).rejects.toThrow();
  });

  it("denies unauthenticated users access to admin.users.list", async () => {
    const { ctx } = createUnauthenticatedContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.admin.users.list()).rejects.toThrow();
  });

  it("denies regular users access to admin.users.list", async () => {
    const { ctx } = createRegularUserContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.admin.users.list()).rejects.toThrow();
  });

  it("denies regular users access to admin.submissions.list", async () => {
    const { ctx } = createRegularUserContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.admin.submissions.list()).rejects.toThrow();
  });

  it("denies regular users access to admin.testimonials.list", async () => {
    const { ctx } = createRegularUserContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.admin.testimonials.list()).rejects.toThrow();
  });

  it("denies regular users access to admin.content.list", async () => {
    const { ctx } = createRegularUserContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.admin.content.list()).rejects.toThrow();
  });
});

describe("public procedures - volunteer submission", () => {
  it("validates volunteer submission input requires fullName and email", async () => {
    const { ctx } = createUnauthenticatedContext();
    const caller = appRouter.createCaller(ctx);

    // Missing required fields should throw validation error
    await expect(
      caller.volunteer.submit({
        fullName: "",
        email: "test@test.com",
      })
    ).rejects.toThrow();
  });

  it("validates volunteer submission input requires valid email", async () => {
    const { ctx } = createUnauthenticatedContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.volunteer.submit({
        fullName: "Test User",
        email: "not-an-email",
      })
    ).rejects.toThrow();
  });
});

describe("public procedures - testimonials", () => {
  it("allows unauthenticated users to list published testimonials", async () => {
    const { ctx } = createUnauthenticatedContext();
    const caller = appRouter.createCaller(ctx);

    // Should not throw - public procedure
    const result = await caller.testimonials.list();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("public procedures - CMS content", () => {
  it("allows unauthenticated users to get page content", async () => {
    const { ctx } = createUnauthenticatedContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.content.getPage({ pageKey: "home" });
    expect(Array.isArray(result)).toBe(true);
  });

  it("returns empty array for non-existent page", async () => {
    const { ctx } = createUnauthenticatedContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.content.getPage({ pageKey: "nonexistent" });
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });
});

describe("admin procedures - CMS content access control", () => {
  it("denies unauthenticated users access to admin.content.upsert", async () => {
    const { ctx } = createUnauthenticatedContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.admin.content.upsert({
        pageKey: "home",
        sectionKey: "hero",
        title: "Test",
      })
    ).rejects.toThrow();
  });

  it("denies regular users access to admin.content.upsert", async () => {
    const { ctx } = createRegularUserContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.admin.content.upsert({
        pageKey: "home",
        sectionKey: "hero",
        title: "Test",
      })
    ).rejects.toThrow();
  });

  it("denies regular users access to admin.content.uploadImage", async () => {
    const { ctx } = createRegularUserContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.admin.content.uploadImage({
        base64: "dGVzdA==",
        fileName: "test.png",
        contentType: "image/png",
      })
    ).rejects.toThrow();
  });
});

describe("admin procedures - input validation", () => {
  it("validates admin.users.updateRole requires valid role", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.admin.users.updateRole({
        userId: 1,
        role: "superadmin" as any,
      })
    ).rejects.toThrow();
  });

  it("validates admin.testimonials.create requires name, duration, and quote", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.admin.testimonials.create({
        name: "",
        duration: "2 weeks",
        quote: "Great experience",
      })
    ).rejects.toThrow();
  });

  it("validates admin.submissions.updateStatus requires valid status", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.admin.submissions.updateStatus({
        id: 1,
        status: "invalid-status" as any,
      })
    ).rejects.toThrow();
  });

  it("validates admin.content.upsert requires pageKey and sectionKey", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.admin.content.upsert({
        pageKey: "",
        sectionKey: "hero",
        title: "Test",
      })
    ).rejects.toThrow();
  });
});
