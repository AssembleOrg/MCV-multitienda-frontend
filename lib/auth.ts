import { createServerClient } from "@supabase/ssr";
import { NextRequest } from "next/server";
import { prisma } from "./prisma";

/**
 * Create a Supabase client from a NextRequest (for API routes).
 * Reads cookies from the request and writes set-cookie into the response.
 */
function createSupabaseFromRequest(request: NextRequest) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll() {
          // API routes don't need to set cookies here —
          // the middleware handles session refresh
        },
      },
    },
  );
}

/**
 * Get the authenticated user from a request.
 * Returns null if not authenticated.
 */
export async function getAuthUser(request: NextRequest) {
  const supabase = createSupabaseFromRequest(request);

  const {
    data: { user: supabaseUser },
  } = await supabase.auth.getUser();

  if (!supabaseUser) return null;

  // Get user from our DB (synced with Supabase Auth)
  const user = await prisma.multitienda_user.findUnique({
    where: { id: supabaseUser.id, active: true },
    select: {
      id: true,
      email: true,
      name: true,
      lastName: true,
      role: true,
    },
  });

  return user;
}

/**
 * Require admin role. Returns null if not admin.
 */
export async function requireAdmin(request: NextRequest) {
  const user = await getAuthUser(request);
  if (!user || user.role !== "admin") {
    return null;
  }
  return user;
}
