import { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { apiSuccess, apiError } from "@/lib/api-helpers";

export async function POST(request: NextRequest) {
  try {
    const cookiesToWrite: { name: string; value: string; options?: Record<string, unknown> }[] = [];
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(newCookies) {
            cookiesToWrite.push(...newCookies);
          },
        },
      },
    );

    await supabase.auth.signOut();

    const jsonResponse = apiSuccess({ message: "Sesión cerrada" });
    cookiesToWrite.forEach(({ name, value, options }) => {
      jsonResponse.cookies.set(name, value, {
        ...options,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
    });

    return jsonResponse;
  } catch {
    return apiError("Error al cerrar sesión", 500);
  }
}
