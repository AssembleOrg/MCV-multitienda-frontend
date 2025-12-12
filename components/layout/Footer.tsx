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
    <footer className="bg-[#1a1a1a] py-10 relative">
      {/* Neon wave - onda que viaja */}
      <div className="absolute top-0 left-0 right-0 neon-wave-sm" />

      <Container size="xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Image
              src="/MCV-navidad-logo.jpg"
              alt="MCV Multitienda"
              width={80}
              height={80}
              className="rounded-lg mb-4"
            />
            <p className="text-gray-200 text-sm mb-4">
              Tu tienda online de confianza
            </p>
            <Group gap="sm">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-200 hover:text-[#C41E3A] transition-colors"
                  aria-label={social.label}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </Group>
          </div>

          {/* Tienda */}
          <div>
            <h3 className="font-semibold text-white text-sm uppercase">
              Tienda
            </h3>
          </div>

          {/* Categorías */}
          <div>
            <h3 className="font-semibold text-white text-sm uppercase">
              Categorías
            </h3>
          </div>

          {/* Ayuda */}
          <div>
            <h3 className="font-semibold text-white text-sm uppercase">
              Ayuda
            </h3>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-6 border-t border-gray-700">
          <p className="text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} MCV Multitienda. Todos los derechos reservados.
          </p>
        </div>
      </Container>
    </footer>
  );
}
