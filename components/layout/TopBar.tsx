"use client";

import Link from "next/link";
import { Container } from "@mantine/core";
import { Phone, Mail } from "lucide-react";

export default function TopBar() {
  return (
    <div className="bg-[#1a1a1a] py-2 text-sm relative">
      <Container size="xl">
        <div className="flex items-center justify-between">
          {/* Contacto */}
          <div className="flex items-center gap-4">
            <a
              href="tel:+5491112345678"
              className="flex items-center gap-1.5 hover:text-[#C41E3A] transition-colors"
              style={{ color: 'white' }}
            >
              <Phone size={14} />
              <span className="hidden sm:inline">11 1234-5678</span>
            </a>
            <a
              href="mailto:contacto@mcv.com"
              className="flex items-center gap-1.5 hover:text-[#C41E3A] transition-colors"
              style={{ color: 'white' }}
            >
              <Mail size={14} />
              <span className="hidden sm:inline">contacto@mcv.com</span>
            </a>
          </div>

          {/* Auth Links */}
          <div className="flex items-center gap-2 text-white">
            <Link href="/register" className="hover:text-[#C41E3A] transition-colors" style={{ color: 'white' }}>
              Crear cuenta
            </Link>
            <span style={{ color: '#6b7280' }}>|</span>
            <Link href="/login" className="hover:text-[#C41E3A] transition-colors" style={{ color: 'white' }}>
              Iniciar sesión
            </Link>
          </div>
        </div>
      </Container>
      {/* Neon wave - onda que viaja */}
      <div className="absolute bottom-0 left-0 right-0 neon-wave" />
    </div>
  );
}
