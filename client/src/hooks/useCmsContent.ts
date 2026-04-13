import { trpc } from "@/lib/trpc";
import { useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

type ContentRow = {
  sectionKey: string;
  title: string | null;
  content: string | null;
  imageUrl: string | null;
  metadata: unknown;
  // Mongolian translation fields (added in migration 0003)
  titleMn?: string | null;
  contentMn?: string | null;
  metadataMn?: unknown;
};

type CmsValues = {
  title: string;
  content: string;
  imageUrl: string;
  meta: Record<string, string>;
  // Mongolian variants
  titleMn: string;
  contentMn: string;
  metaMn: Record<string, string>;
};

/**
 * Hook to load CMS content for a page and provide a getter function.
 * Returns a `get(sectionKey, field, defaultValue)` function that:
 * - When language is "mn": returns MN value if available, falls back to EN, then default
 * - When language is "en": returns EN value, falls back to default
 *
 * Field can be: "title" | "content" | "imageUrl" | "meta.xxx"
 * For Mongolian, the hook automatically reads titleMn/contentMn/metadataMn.
 */
export function useCmsContent(pageKey: string) {
  const { language } = useLanguage();

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
        titleMn: row.titleMn || "",
        contentMn: row.contentMn || "",
        metaMn: (row.metadataMn as Record<string, string>) || {},
      });
    }
    return map;
  }, [rows]);

  /**
   * Get a CMS value for a section, respecting the current language.
   * @param sectionKey - the section identifier (e.g. "hero", "about")
   * @param field - "title" | "content" | "imageUrl" | "meta.xxx"
   * @param defaultValue - fallback if DB has no value
   */
  function get(sectionKey: string, field: string, defaultValue: string): string {
    const section = sectionMap.get(sectionKey);
    if (!section) return defaultValue;

    // Image URLs are language-neutral
    if (field === "imageUrl") {
      return section.imageUrl || defaultValue;
    }

    if (language === "mn") {
      // Try MN first, fall back to EN, then default
      let mnValue = "";
      if (field === "title") mnValue = section.titleMn;
      else if (field === "content") mnValue = section.contentMn;
      else if (field.startsWith("meta.")) {
        const metaKey = field.replace("meta.", "");
        mnValue = section.metaMn[metaKey] || "";
      }

      if (mnValue) return mnValue;

      // Fall back to EN value
      let enValue = "";
      if (field === "title") enValue = section.title;
      else if (field === "content") enValue = section.content;
      else if (field.startsWith("meta.")) {
        const metaKey = field.replace("meta.", "");
        enValue = section.meta[metaKey] || "";
      }

      return enValue || defaultValue;
    }

    // English (default)
    let dbValue = "";
    if (field === "title") dbValue = section.title;
    else if (field === "content") dbValue = section.content;
    else if (field.startsWith("meta.")) {
      const metaKey = field.replace("meta.", "");
      dbValue = section.meta[metaKey] || "";
    }

    return dbValue || defaultValue;
  }

  return { get, isLoading, hasData: (rows?.length ?? 0) > 0, language };
}
