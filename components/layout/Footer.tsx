"use client";

import Image from "next/image";
import { Container, Group } from "@mantine/core";
import { Instagram, Facebook, MessageCircle } from "lucide-react";

const socialLinks = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: MessageCircle, href: "#", label: "WhatsApp" },
];

export default function Footer() {
  return (
    <footer className="relative bg-[#1a1a1a] py-10">
      {/* Neon wave - onda que viaja */}
      <div className="neon-wave-sm absolute top-0 right-0 left-0" />

      <Container size="xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div>
            <Image
              src="/logo-sinbg.svg"
              alt="MCV Multitienda"
              width={80}
              height={80}
              className="mb-4 rounded-lg"
            />
            <p className="mb-4 text-sm text-gray-200">Tu tienda online de confianza</p>
            <Group gap="sm">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-200 transition-colors hover:text-[#C41E3A]"
                  aria-label={social.label}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </Group>
          </div>

          {/* Tienda */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase">Tienda</h3>
          </div>

          {/* Categorías */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase">Categorías</h3>
          </div>

          {/* Ayuda */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase">Ayuda</h3>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 border-t border-gray-700 pt-6">
          <p className="text-center text-sm text-gray-400">
            © {new Date().getFullYear()} MCV Multitienda. Todos los derechos reservados.
          </p>
        </div>
      </Container>
    </footer>
  );
}
