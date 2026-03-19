import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-helpers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, lastName, phone } = body;

    if (!email || !password || !name) {
      return apiError("Email, contraseña y nombre son requeridos");
    }

    if (password.length < 6) {
      return apiError("La contraseña debe tener al menos 6 caracteres");
    }

    // Check whitelist
    const whitelisted = await prisma.multitienda_whitelisted_email.findUnique({
      where: { email: email.toLowerCase(), active: true },
    });

    if (!whitelisted) {
      return apiError("Este email no está autorizado para registrarse");
    }

    // Create Supabase client that can write cookies to response
    const response = NextResponse.next();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name: n, value, options }) =>
              response.cookies.set(n, value, options),
            );
          },
        },
      },
    );

    // Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email.toLowerCase(),
      password,
    });

    if (authError) {
      return apiError(authError.message);
    }

    if (!authData.user) {
      return apiError("Error al crear usuario");
    }

    // Create user in our DB with the Supabase Auth UID
    // Use role from whitelist
    const user = await prisma.multitienda_user.create({
      data: {
        id: authData.user.id,
        email: email.toLowerCase(),
        password: "",
        name,
        lastName: lastName || null,
        phone: phone || null,
        role: whitelisted.role,
      },
      select: {
        id: true,
        email: true,
        name: true,
        lastName: true,
        role: true,
      },
    });

    // Return success with cookies set
    const jsonResponse = apiSuccess({ user }, 201);
    // Copy cookies from the supabase response
    response.cookies.getAll().forEach((cookie) => {
      jsonResponse.cookies.set(cookie.name, cookie.value);
    });

    return jsonResponse;
  } catch {
    return apiError("Error al registrar usuario", 500);
  }
}
