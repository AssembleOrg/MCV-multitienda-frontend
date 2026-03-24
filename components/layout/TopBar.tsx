"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Container } from "@mantine/core";
import { Phone, Mail } from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { api } from "@/lib/api-client";

interface TopBarProps {
  phone?: string | null;
  email?: string | null;
}

export default function TopBar({ phone, email }: TopBarProps) {
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
    <div className="relative hidden bg-[#1a1a1a] py-2 text-sm sm:block">
      <Container size="xl">
        <div className="flex items-center justify-between">
          {/* Contacto */}
          <div className="flex items-center gap-4">
            {phone && (
              <a
                href={`tel:${phone}`}
                className="flex items-center gap-1.5 transition-colors hover:text-[#C41E3A]"
                style={{ color: "white" }}
              >
                <Phone size={14} />
                <span className="hidden sm:inline">{phone}</span>
              </a>
            )}
            {email && (
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-1.5 transition-colors hover:text-[#C41E3A]"
                style={{ color: "white" }}
              >
                <Mail size={14} />
                <span className="hidden sm:inline">{email}</span>
              </a>
            )}
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
