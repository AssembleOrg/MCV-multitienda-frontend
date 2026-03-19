import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-helpers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return apiError("Email y contraseña son requeridos");
    }

    // Create Supabase client that can write cookies to response
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

    // Sign in with Supabase Auth
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password,
      });

    if (authError) {
      return apiError("Credenciales inválidas", 401);
    }

    if (!authData.user) {
      return apiError("Error al iniciar sesión", 500);
    }

    // Get user from our DB
    const user = await prisma.multitienda_user.findUnique({
      where: { id: authData.user.id, active: true },
      select: {
        id: true,
        email: true,
        name: true,
        lastName: true,
        role: true,
      },
    });

    if (!user) {
      return apiError("Usuario no encontrado en el sistema", 404);
    }

    // Build response with httpOnly cookies
    const jsonResponse = apiSuccess({ user });
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
    return apiError("Error al iniciar sesión", 500);
  }
}
