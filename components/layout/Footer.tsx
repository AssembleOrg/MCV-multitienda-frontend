"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Container, Group } from "@mantine/core";
import { Instagram, Facebook, MessageCircle, Mail, Phone } from "lucide-react";
import { api, type CategoryResponse } from "@/lib/api-client";

interface FooterProps {
  storeName?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  whatsapp?: string | null;
  tiktok?: string | null;
  phone?: string | null;
  email?: string | null;
}

export default function Footer({
  storeName,
  instagram,
  facebook,
  whatsapp,
  phone,
  email,
}: FooterProps) {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);

  useEffect(() => {
    api.getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  const socialLinks = [
    instagram ? { icon: Instagram, href: instagram, label: "Instagram" } : null,
    facebook ? { icon: Facebook, href: facebook, label: "Facebook" } : null,
    whatsapp ? { icon: MessageCircle, href: whatsapp, label: "WhatsApp" } : null,
  ].filter(Boolean) as { icon: React.ElementType; href: string; label: string }[];

  const displayedCategories = categories.slice(0, 8);

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
              alt={storeName ?? "Tienda"}
              width={80}
              height={80}
              className="mb-4 rounded-lg"
            />
            <p className="mb-4 text-sm text-gray-300">Tu tienda online de confianza</p>
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
            <h3 className="mb-3 text-sm font-semibold text-white uppercase">Tienda</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/productos"
                  className="text-sm transition-colors hover:text-[#C41E3A]"
                  style={{ color: "#d1d5db" }}
                >
                  Todos los productos
                </Link>
              </li>
              <li>
                <Link
                  href="/#nosotros"
                  className="text-sm transition-colors hover:text-[#C41E3A]"
                  style={{ color: "#d1d5db" }}
                >
                  Nosotros
                </Link>
              </li>
            </ul>
          </div>

          {/* Categorías */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-white uppercase">Categorías</h3>
            {displayedCategories.length > 0 ? (
              <ul className="space-y-2">
                {displayedCategories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href={`/productos?categoria=${cat.slug}`}
                      className="text-sm transition-colors hover:text-[#C41E3A]"
                      style={{ color: "#d1d5db" }}
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
                {categories.length > 8 && (
                  <li>
                    <Link
                      href="/productos"
                      className="text-sm text-[#C41E3A] transition-colors hover:text-white"
                    >
                      Ver todas →
                    </Link>
                  </li>
                )}
              </ul>
            ) : null}
          </div>

          {/* Ayuda */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-white uppercase">Ayuda</h3>
            <ul className="space-y-2">
              {email && (
                <li>
                  <a
                    href={`mailto:${email}`}
                    className="flex items-center gap-2 text-sm transition-colors hover:text-[#C41E3A]"
                    style={{ color: "#d1d5db" }}
                  >
                    <Mail size={14} />
                    {email}
                  </a>
                </li>
              )}
              {phone && (
                <li>
                  <a
                    href={`tel:${phone}`}
                    className="flex items-center gap-2 text-sm transition-colors hover:text-[#C41E3A]"
                    style={{ color: "#d1d5db" }}
                  >
                    <Phone size={14} />
                    {phone}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 border-t border-gray-700 pt-6">
          <p className="text-center text-sm text-gray-300">
            © {new Date().getFullYear()} {storeName ?? "Tienda"}. Todos los derechos reservados.
          </p>
          <p className="mt-1 text-center text-xs text-gray-500">
            Desarrollado por{" "}
            <span style={{ color: "#86efac" }}>Pis</span>
            <span className="text-white">tech</span>
          </p>
        </div>
      </Container>
    </footer>
  );
}
