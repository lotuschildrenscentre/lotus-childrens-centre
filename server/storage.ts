/**
 * Storage helpers using Supabase Storage (free tier, 1GB).
 * Replaces the Manus built-in S3 proxy for external deployments.
 *
 * Required env vars:
 *   SUPABASE_URL       - e.g. https://hbghdmvdsqlougxipdoo.supabase.co
 *   SUPABASE_SERVICE_KEY - service_role key (server-side only)
 *   SUPABASE_BUCKET    - bucket name, e.g. lotus-media
 */
import { createClient } from "@supabase/supabase-js";

function getSupabaseClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) {
    throw new Error(
      "Supabase storage credentials missing: set SUPABASE_URL and SUPABASE_SERVICE_KEY"
    );
  }
  return createClient(url, key);
}

function getBucket(): string {
  return process.env.SUPABASE_BUCKET ?? "lotus-media";
}

/**
 * Upload bytes to Supabase Storage and return the public URL.
 * relKey is the file path inside the bucket, e.g. "team/photo-abc123.jpg"
 */
export async function storagePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType = "application/octet-stream"
): Promise<{ key: string; url: string }> {
  const supabase = getSupabaseClient();
  const bucket = getBucket();
  const key = relKey.replace(/^\/+/, "");

  const body =
    typeof data === "string" ? Buffer.from(data, "utf-8") : Buffer.from(data);

  const { error } = await supabase.storage
    .from(bucket)
    .upload(key, body, {
      contentType,
      upsert: true,
    });

  if (error) {
    throw new Error(`Supabase storage upload failed: ${error.message}`);
  }

  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(key);
  return { key, url: urlData.publicUrl };
}

/**
 * Get the public URL for a stored file.
 */
export async function storageGet(relKey: string): Promise<{ key: string; url: string }> {
  const supabase = getSupabaseClient();
  const bucket = getBucket();
  const key = relKey.replace(/^\/+/, "");
  const { data } = supabase.storage.from(bucket).getPublicUrl(key);
  return { key, url: data.publicUrl };
}
