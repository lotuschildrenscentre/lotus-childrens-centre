import { trpc } from "@/lib/trpc";
import { useMemo } from "react";

type ContentRow = {
  sectionKey: string;
  title: string | null;
  content: string | null;
  imageUrl: string | null;
  metadata: unknown;
};

type CmsValues = {
  title: string;
  content: string;
  imageUrl: string;
  meta: Record<string, string>;
};

/**
 * Hook to load CMS content for a page and provide a getter function.
 * Returns a `get(sectionKey, field, defaultValue)` function that
 * reads from DB first, falling back to the provided default.
 */
export function useCmsContent(pageKey: string) {
  const { data: rows, isLoading } = trpc.content.getPage.useQuery(
    { pageKey },
    { staleTime: 60_000 }
  );

  const sectionMap = useMemo(() => {
    const map = new Map<string, CmsValues>();
    if (!rows) return map;
    for (const row of rows as ContentRow[]) {
      map.set(row.sectionKey, {
        title: row.title || "",
        content: row.content || "",
        imageUrl: row.imageUrl || "",
        meta: (row.metadata as Record<string, string>) || {},
      });
    }
    return map;
  }, [rows]);

  /**
   * Get a CMS value for a section.
   * @param sectionKey - the section identifier (e.g. "hero", "about")
   * @param field - "title" | "content" | "imageUrl" | "meta.xxx"
   * @param defaultValue - fallback if DB has no value
   */
  function get(sectionKey: string, field: string, defaultValue: string): string {
    const section = sectionMap.get(sectionKey);
    if (!section) return defaultValue;

    let dbValue = "";
    if (field === "title") dbValue = section.title;
    else if (field === "content") dbValue = section.content;
    else if (field === "imageUrl") dbValue = section.imageUrl;
    else if (field.startsWith("meta.")) {
      const metaKey = field.replace("meta.", "");
      dbValue = section.meta[metaKey] || "";
    }

    return dbValue || defaultValue;
  }

  return { get, isLoading, hasData: (rows?.length ?? 0) > 0 };
}
