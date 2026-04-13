/**
 * Translation helper: English → Mongolian
 * Uses the built-in LLM (Gemini) to translate CMS content.
 *
 * Design notes:
 * - Translates text fields only; image URLs and numeric values are passed through unchanged.
 * - Metadata objects are translated field-by-field.
 * - Returns empty string on failure so the frontend can fall back to English.
 */

import { invokeLLM } from "./_core/llm";

/**
 * Translate a single English string to Mongolian.
 * Returns the original string on error so callers always get a usable value.
 */
export async function translateToMongolian(text: string): Promise<string> {
  if (!text || text.trim() === "") return "";

  // Skip translation for URLs, numbers, and very short tokens
  if (/^https?:\/\//.test(text.trim())) return text;
  if (/^\d+[+%]?$/.test(text.trim())) return text;

  try {
    const result = await invokeLLM({
      messages: [
        {
          role: "system",
          content:
            "You are a professional translator specializing in English to Mongolian translation for a children's charity website. " +
            "Translate the given English text to Mongolian (Cyrillic script). " +
            "Return ONLY the translated text with no explanations, quotes, or additional commentary. " +
            "Preserve any HTML tags, line breaks, or special formatting exactly as-is. " +
            "Keep proper nouns like 'Lotus Children's Centre', 'Ulaanbaatar', 'Gachuurt' unchanged.",
        },
        {
          role: "user",
          content: text,
        },
      ],
      maxTokens: 2048,
    });

    const translated = result.choices?.[0]?.message?.content;
    if (typeof translated === "string" && translated.trim()) {
      return translated.trim();
    }
    return text; // fallback to original
  } catch (error) {
    console.error("[translate] LLM translation failed:", error);
    return text; // fallback to original
  }
}

/**
 * Translate a metadata object (Record<string, string>) field-by-field.
 * Only string values are translated; non-string values are passed through.
 */
export async function translateMetadata(
  metadata: Record<string, unknown>
): Promise<Record<string, unknown>> {
  if (!metadata || typeof metadata !== "object") return metadata;

  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(metadata)) {
    if (typeof value === "string" && value.trim()) {
      result[key] = await translateToMongolian(value);
    } else {
      result[key] = value;
    }
  }

  return result;
}
