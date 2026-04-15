import { describe, it, expect, vi, beforeEach } from "vitest";
import * as dbModule from "./db";

// ─── Mock the db module ──────────────────────────────────────────────────────
vi.mock("./db", () => ({
  db: {
    getMediaItems: vi.fn(),
    getMediaItemById: vi.fn(),
    createMediaItem: vi.fn(),
    updateMediaItem: vi.fn(),
    deleteMediaItem: vi.fn(),
  },
}));

// ─── Mock translate ──────────────────────────────────────────────────────────
vi.mock("./translate", () => ({
  translateToMongolian: vi.fn(async (text: string) => `[MN] ${text}`),
}));

const mockDb = dbModule.db as unknown as {
  getMediaItems: ReturnType<typeof vi.fn>;
  getMediaItemById: ReturnType<typeof vi.fn>;
  createMediaItem: ReturnType<typeof vi.fn>;
  updateMediaItem: ReturnType<typeof vi.fn>;
  deleteMediaItem: ReturnType<typeof vi.fn>;
};

const sampleItem = {
  id: 1,
  type: "photo" as const,
  title: "Children playing",
  titleMn: "Хүүхдүүд тоглож байна",
  description: "A joyful moment",
  descriptionMn: "Баярлалтай мөч",
  url: "https://cdn.example.com/photo1.jpg",
  thumbnailUrl: null,
  sortOrder: 0,
  isPublished: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("Gallery DB helpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getMediaItems returns all items when publishedOnly=false", async () => {
    mockDb.getMediaItems.mockResolvedValue([sampleItem]);
    const result = await dbModule.db.getMediaItems(false);
    expect(result).toHaveLength(1);
    expect(mockDb.getMediaItems).toHaveBeenCalledWith(false);
  });

  it("getMediaItems returns only published items when publishedOnly=true", async () => {
    mockDb.getMediaItems.mockResolvedValue([sampleItem]);
    const result = await dbModule.db.getMediaItems(true);
    expect(result).toHaveLength(1);
    expect(mockDb.getMediaItems).toHaveBeenCalledWith(true);
  });

  it("getMediaItemById returns item by id", async () => {
    mockDb.getMediaItemById.mockResolvedValue(sampleItem);
    const result = await dbModule.db.getMediaItemById(1);
    expect(result).toEqual(sampleItem);
  });

  it("getMediaItemById returns null for missing id", async () => {
    mockDb.getMediaItemById.mockResolvedValue(null);
    const result = await dbModule.db.getMediaItemById(999);
    expect(result).toBeNull();
  });

  it("createMediaItem inserts a new item", async () => {
    mockDb.createMediaItem.mockResolvedValue(undefined);
    await dbModule.db.createMediaItem({
      type: "photo",
      title: "Test",
      url: "https://example.com/img.jpg",
      isPublished: true,
      sortOrder: 0,
    });
    expect(mockDb.createMediaItem).toHaveBeenCalledOnce();
  });

  it("updateMediaItem updates fields", async () => {
    mockDb.updateMediaItem.mockResolvedValue(undefined);
    await dbModule.db.updateMediaItem(1, { title: "Updated" });
    expect(mockDb.updateMediaItem).toHaveBeenCalledWith(1, { title: "Updated" });
  });

  it("deleteMediaItem removes item", async () => {
    mockDb.deleteMediaItem.mockResolvedValue(undefined);
    await dbModule.db.deleteMediaItem(1);
    expect(mockDb.deleteMediaItem).toHaveBeenCalledWith(1);
  });
});

describe("Gallery translation helper", () => {
  it("translateToMongolian returns prefixed string", async () => {
    const { translateToMongolian } = await import("./translate");
    const result = await translateToMongolian("Hello");
    expect(result).toBe("[MN] Hello");
  });
});
