"use client";

import Link from "next/link";
import Image from "next/image";
import { Container, TextInput, ActionIcon, Drawer, Stack, Divider } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Search, ShoppingCart, Menu, X } from "lucide-react";

const navLinks = [
  { label: "INICIO", href: "/" },
  { label: "NOSOTROS", href: "/" },
  { label: "CATÁLOGO", href: "/" },
];

export default function Navbar() {
  const [mobileMenuOpened, { open: openMobileMenu, close: closeMobileMenu }] = useDisclosure(false);

  // Carrito mock - después conectar con Zustand
  const cartTotal = 0;

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
        <Container size="xl">
          <div className="flex items-center justify-between py-3">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/logo-sinbg.svg"
                alt="MCV Multitienda"
                width={70}
                height={70}
                className="rounded-lg"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-6 md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-medium text-gray-700 transition-colors hover:text-red-600"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Search & Cart */}
            <div className="flex items-center gap-3">
              {/* Search - Desktop */}
              <div className="hidden md:block">
                <TextInput
                  placeholder="Buscar"
                  leftSection={<Search size={16} className="text-gray-400" />}
                  size="sm"
                  classNames={{
                    input:
                      "border-[#C41E3A] border-2 focus:border-[#C41E3A] focus:shadow-[0_0_15px_rgba(196,30,58,0.5)]",
                  }}
                  styles={{
                    input: { width: 180 },
                  }}
                />
              </div>

              {/* Cart */}
              <Link href="/">
                <div className="flex items-center gap-2 text-gray-700 transition-colors hover:text-red-600">
                  <div className="relative">
                    <ShoppingCart size={22} />
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-xs text-white">
                      0
                    </span>
                  </div>
                  <span className="hidden font-medium sm:inline">
                    ${cartTotal.toLocaleString()}
                  </span>
                </div>
              </Link>

              {/* Mobile Menu Button */}
              <ActionIcon
                variant="subtle"
                color="gray"
                size="lg"
                className="md:hidden"
                onClick={openMobileMenu}
              >
                <Menu size={24} />
              </ActionIcon>
            </div>
          </div>
        </Container>
      </header>

      {/* Mobile Menu Drawer */}
      <Drawer
        opened={mobileMenuOpened}
        onClose={closeMobileMenu}
        position="right"
        size="xs"
        title={
          <Image
            src="/logo-sinbg.svg"
            alt="MCV logo"
            width={50}
            height={50}
            className="rounded-lg"
          />
        }
      >
        <Stack gap="sm">
          {/* Search */}
          <TextInput placeholder="Buscar productos..." leftSection={<Search size={16} />} />

          <Divider />

          {/* Navigation */}
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMobileMenu}
              className="py-2 font-medium text-gray-700 transition-colors hover:text-red-600"
            >
              {link.label}
            </Link>
          ))}

          <Divider />

          {/* Auth */}
          <Link
            href="/"
            onClick={closeMobileMenu}
            className="py-2 text-gray-700 transition-colors hover:text-red-600"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/"
            onClick={closeMobileMenu}
            className="py-2 text-gray-700 transition-colors hover:text-red-600"
          >
            Crear cuenta
          </Link>
        </Stack>
      </Drawer>
    </>
  );
}
