import { describe, it, expect, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";

// Mock DB helpers
vi.mock("./db", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./db")>();
  return {
    ...actual,
    createContactMessage: vi.fn().mockResolvedValue(undefined),
    getContactMessages: vi.fn().mockResolvedValue([
      {
        id: 1,
        name: "Alice",
        email: "alice@example.com",
        subject: "Hello",
        message: "Test message",
        status: "unread",
        adminNotes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]),
    getContactMessageById: vi.fn().mockResolvedValue({
      id: 1,
      name: "Alice",
      email: "alice@example.com",
      subject: "Hello",
      message: "Test message",
      status: "unread",
      adminNotes: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    updateContactMessageStatus: vi.fn().mockResolvedValue(undefined),
    deleteContactMessage: vi.fn().mockResolvedValue(undefined),
  };
});

const publicCaller = appRouter.createCaller({ user: null, setCookie: vi.fn(), clearCookie: vi.fn() });
const adminCaller = appRouter.createCaller({
  user: { id: 1, openId: "admin1", name: "Admin", email: "admin@test.com", role: "admin" as const, loginMethod: "google", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() },
  setCookie: vi.fn(),
  clearCookie: vi.fn(),
});

describe("contact.submit", () => {
  it("accepts a valid contact form submission", async () => {
    const result = await publicCaller.contact.submit({
      name: "Alice",
      email: "alice@example.com",
      subject: "Hello",
      message: "This is a test message.",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty name", async () => {
    await expect(
      publicCaller.contact.submit({
        name: "",
        email: "alice@example.com",
        subject: "Hello",
        message: "Test",
      })
    ).rejects.toThrow();
  });

  it("rejects invalid email", async () => {
    await expect(
      publicCaller.contact.submit({
        name: "Alice",
        email: "not-an-email",
        subject: "Hello",
        message: "Test",
      })
    ).rejects.toThrow();
  });

  it("rejects empty message", async () => {
    await expect(
      publicCaller.contact.submit({
        name: "Alice",
        email: "alice@example.com",
        subject: "Hello",
        message: "",
      })
    ).rejects.toThrow();
  });
});

describe("admin.messages", () => {
  it("lists all messages for admin", async () => {
    const messages = await adminCaller.admin.messages.list();
    expect(Array.isArray(messages)).toBe(true);
    expect(messages.length).toBeGreaterThan(0);
  });

  it("gets a message by id", async () => {
    const msg = await adminCaller.admin.messages.getById({ id: 1 });
    expect(msg).not.toBeNull();
    expect(msg?.name).toBe("Alice");
  });

  it("updates message status", async () => {
    const result = await adminCaller.admin.messages.updateStatus({
      id: 1,
      status: "read",
    });
    expect(result.success).toBe(true);
  });

  it("updates message status with admin notes", async () => {
    const result = await adminCaller.admin.messages.updateStatus({
      id: 1,
      status: "replied",
      adminNotes: "Replied via email on 2026-04-14",
    });
    expect(result.success).toBe(true);
  });

  it("deletes a message", async () => {
    const result = await adminCaller.admin.messages.delete({ id: 1 });
    expect(result.success).toBe(true);
  });

  it("blocks non-admin from listing messages", async () => {
    const userCaller = appRouter.createCaller({
      user: { id: 2, openId: "user2", name: "User", email: "user@test.com", role: "user" as const, loginMethod: "google", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() },
      setCookie: vi.fn(),
      clearCookie: vi.fn(),
    });
    await expect(userCaller.admin.messages.list()).rejects.toThrow();
  });

  it("blocks unauthenticated access to messages", async () => {
    await expect(publicCaller.admin.messages.list()).rejects.toThrow();
  });
});
