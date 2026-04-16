/**
 * Translation helper: English → Mongolian
 *
 * Uses Google Cloud Translation API (free tier: 500,000 chars/month).
 * Falls back gracefully if the API key is not set.
 *
 * Required env var:
 *   GOOGLE_TRANSLATION_API_KEY - API key with Cloud Translation API enabled
 */

const GOOGLE_TRANSLATE_URL =
  "https://translation.googleapis.com/language/translate/v2";

/**
 * Translate a single English string to Mongolian using Google Translate.
 * Returns the original string on error so callers always get a usable value.
 */
export async function translateToMongolian(text: string): Promise<string> {
  if (!text || text.trim() === "") return "";

  // Skip translation for URLs, numbers, and very short tokens
  if (/^https?:\/\//.test(text.trim())) return text;
  if (/^\d+[+%]?$/.test(text.trim())) return text;

  const apiKey = process.env.GOOGLE_TRANSLATION_API_KEY;
  if (!apiKey) {
    console.warn("[translate] GOOGLE_TRANSLATION_API_KEY not set, skipping translation");
    return text;
  }

  try {
    const response = await fetch(`${GOOGLE_TRANSLATE_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: text,
        source: "en",
        target: "mn",
        format: "text",
      }),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => response.statusText);
      throw new Error(`Google Translate API error (${response.status}): ${errText}`);
    }

    const json = await response.json() as {
      data?: { translations?: Array<{ translatedText?: string }> };
    };
    const translated = json?.data?.translations?.[0]?.translatedText;

    if (typeof translated === "string" && translated.trim()) {
      return translated.trim();
    }
    return text; // fallback to original
  } catch (error) {
    console.error("[translate] Google Translate failed:", error);
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
