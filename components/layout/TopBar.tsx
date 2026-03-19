"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Container } from "@mantine/core";
import { Phone, Mail } from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { api } from "@/lib/api-client";

export default function TopBar() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const handleLogout = async () => {
    await api.logout().catch(() => {});
    setUser(null);
    router.push("/");
    router.refresh();
  };

  return (
    <div className="relative bg-[#1a1a1a] py-2 text-sm">
      <Container size="xl">
        <div className="flex items-center justify-between">
          {/* Contacto */}
          <div className="flex items-center gap-4">
            <a
              href="tel:+5491112345678"
              className="flex items-center gap-1.5 transition-colors hover:text-[#C41E3A]"
              style={{ color: "white" }}
            >
              <Phone size={14} />
              <span className="hidden sm:inline">11 1234-5678</span>
            </a>
            <a
              href="mailto:contacto@mcv.com"
              className="flex items-center gap-1.5 transition-colors hover:text-[#C41E3A]"
              style={{ color: "white" }}
            >
              <Mail size={14} />
              <span className="hidden sm:inline">contacto@mcv.com</span>
            </a>
          </div>

          {/* Auth Links */}
          <div className="flex items-center gap-2 text-white">
            {user ? (
              <>
                <span style={{ color: "white" }} className="hidden sm:inline">
                  Hola, {user.name}
                </span>
                <span style={{ color: "#6b7280" }}>|</span>
                <button
                  onClick={handleLogout}
                  className="cursor-pointer transition-colors hover:text-[#C41E3A]"
                  style={{ color: "white", background: "none", border: "none" }}
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/register"
                  className="transition-colors hover:text-[#C41E3A]"
                  style={{ color: "white" }}
                >
                  Crear cuenta
                </Link>
                <span style={{ color: "#6b7280" }}>|</span>
                <Link
                  href="/auth/login"
                  className="transition-colors hover:text-[#C41E3A]"
                  style={{ color: "white" }}
                >
                  Iniciar sesión
                </Link>
              </>
            )}
          </div>
        </div>
      </Container>
      <div className="neon-wave absolute right-0 bottom-0 left-0" />
    </div>
  );
}
