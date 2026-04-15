/**
 * Tests for the partners DB helpers.
 * These tests verify the CRUD operations for the partners table.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the database module
vi.mock("./db", () => ({
  getPartners: vi.fn(),
  getPartnerById: vi.fn(),
  createPartner: vi.fn(),
  updatePartner: vi.fn(),
  deletePartner: vi.fn(),
}));

import * as db from "./db";

describe("Partners DB helpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getPartners", () => {
    it("returns all partners when activeOnly is false", async () => {
      const mockPartners = [
        { id: 1, name: "Partner A", logoUrl: "https://example.com/a.png", websiteUrl: null, sortOrder: 0, isActive: true, createdAt: new Date() },
        { id: 2, name: "Partner B", logoUrl: "https://example.com/b.png", websiteUrl: "https://b.com", sortOrder: 1, isActive: false, createdAt: new Date() },
      ];
      vi.mocked(db.getPartners).mockResolvedValue(mockPartners);

      const result = await db.getPartners(false);
      expect(result).toHaveLength(2);
      expect(db.getPartners).toHaveBeenCalledWith(false);
    });

    it("returns only active partners when activeOnly is true", async () => {
      const mockActivePartners = [
        { id: 1, name: "Partner A", logoUrl: "https://example.com/a.png", websiteUrl: null, sortOrder: 0, isActive: true, createdAt: new Date() },
      ];
      vi.mocked(db.getPartners).mockResolvedValue(mockActivePartners);

      const result = await db.getPartners(true);
      expect(result).toHaveLength(1);
      expect(result[0].isActive).toBe(true);
    });

    it("returns empty array when no partners exist", async () => {
      vi.mocked(db.getPartners).mockResolvedValue([]);
      const result = await db.getPartners(false);
      expect(result).toEqual([]);
    });
  });

  describe("getPartnerById", () => {
    it("returns a partner when found", async () => {
      const mockPartner = {
        id: 1, name: "Partner A", logoUrl: "https://example.com/a.png",
        websiteUrl: null, sortOrder: 0, isActive: true, createdAt: new Date(),
      };
      vi.mocked(db.getPartnerById).mockResolvedValue(mockPartner);

      const result = await db.getPartnerById(1);
      expect(result).not.toBeNull();
      expect(result?.name).toBe("Partner A");
    });

    it("returns null when partner not found", async () => {
      vi.mocked(db.getPartnerById).mockResolvedValue(null);
      const result = await db.getPartnerById(999);
      expect(result).toBeNull();
    });
  });

  describe("createPartner", () => {
    it("creates a partner with required fields", async () => {
      vi.mocked(db.createPartner).mockResolvedValue(undefined);

      await db.createPartner({
        name: "New Partner",
        logoUrl: "https://example.com/logo.png",
      });

      expect(db.createPartner).toHaveBeenCalledWith({
        name: "New Partner",
        logoUrl: "https://example.com/logo.png",
      });
    });

    it("creates a partner with all optional fields", async () => {
      vi.mocked(db.createPartner).mockResolvedValue(undefined);

      await db.createPartner({
        name: "Full Partner",
        logoUrl: "https://example.com/logo.png",
        websiteUrl: "https://fullpartner.com",
        sortOrder: 5,
        isActive: false,
      });

      expect(db.createPartner).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Full Partner",
          websiteUrl: "https://fullpartner.com",
          sortOrder: 5,
          isActive: false,
        })
      );
    });
  });

  describe("updatePartner", () => {
    it("updates a partner's fields", async () => {
      vi.mocked(db.updatePartner).mockResolvedValue(undefined);

      await db.updatePartner(1, { name: "Updated Name", isActive: false });

      expect(db.updatePartner).toHaveBeenCalledWith(1, { name: "Updated Name", isActive: false });
    });
  });

  describe("deletePartner", () => {
    it("deletes a partner by id", async () => {
      vi.mocked(db.deletePartner).mockResolvedValue(undefined);

      await db.deletePartner(1);

      expect(db.deletePartner).toHaveBeenCalledWith(1);
    });
  });
});
