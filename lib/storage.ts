import { createClient } from "@supabase/supabase-js";

// Use service role for server-side uploads (bypasses RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const BUCKET = "multitienda";

export async function uploadFile(
  file: Buffer,
  key: string,
  contentType: string,
): Promise<string> {
  const { error } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(key, file, {
      contentType,
      upsert: true,
    });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  const {
    data: { publicUrl },
  } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(key);

  return publicUrl;
}

export async function deleteFile(key: string): Promise<void> {
  const { error } = await supabaseAdmin.storage.from(BUCKET).remove([key]);
  if (error) throw new Error(`Delete failed: ${error.message}`);
}

export function getKeyFromUrl(url: string): string {
  // Extract path after /object/public/multitienda/
  const match = url.match(/\/object\/public\/multitienda\/(.+)$/);
  return match ? match[1] : url;
}
