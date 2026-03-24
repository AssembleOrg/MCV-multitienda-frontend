"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Container,
  TextInput,
  ActionIcon,
  Drawer,
  Stack,
  Divider,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Search, ShoppingCart, Menu } from "lucide-react";
import { useCartStore, useAuthStore } from "@/lib/store";
import { api } from "@/lib/api-client";
import { formatPrice } from "@/lib/utils";

const navLinks = [
  { label: "INICIO", href: "/" },
  { label: "NOSOTROS", href: "/nosotros" },
  { label: "CATÁLOGO", href: "/productos" },
];

export default function Navbar() {
  const router = useRouter();
  const [mobileMenuOpened, { open: openMobileMenu, close: closeMobileMenu }] =
    useDisclosure(false);

  const [searchQuery, setSearchQuery] = useState("");

  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const cartCount = useCartStore((s) => s.getCount());
  const cartTotal = useCartStore((s) => s.getTotal());
  const displayCount = mounted ? cartCount : 0;
  const displayTotal = mounted ? cartTotal : 0;
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/productos?search=${encodeURIComponent(searchQuery.trim())}`);
      closeMobileMenu();
    }
  };

  const handleLogout = async () => {
    await api.logout().catch(() => {});
    setUser(null);
    closeMobileMenu();
    router.push("/");
    router.refresh();
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
        <Container size="xl">
          <div className="flex items-center justify-between py-3">
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
              {user?.role === "admin" && (
                <Link
                  href="/admin"
                  className="font-medium text-[#C41E3A] transition-colors hover:text-red-800"
                >
                  ADMIN
                </Link>
              )}
            </nav>

            <div className="flex items-center gap-3">
              <form onSubmit={handleSearch} className="hidden md:block">
                <TextInput
                  placeholder="Buscar"
                  leftSection={
                    <Search size={16} className="text-gray-400" />
                  }
                  size="sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  classNames={{
                    input:
                      "border-[#C41E3A] border-2 focus:border-[#C41E3A] focus:shadow-[0_0_15px_rgba(196,30,58,0.5)]",
                  }}
                  styles={{ input: { width: 180 } }}
                />
              </form>

              <Link href="/carrito">
                <div className="flex items-center gap-2 text-gray-700 transition-colors hover:text-red-600">
                  <div className="relative">
                    <ShoppingCart size={22} />
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-xs text-white">
                      {displayCount}
                    </span>
                  </div>
                  <span className="hidden font-medium sm:inline">
                    {formatPrice(displayTotal)}
                  </span>
                </div>
              </Link>

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
          <form onSubmit={handleSearch}>
            <TextInput
              placeholder="Buscar productos..."
              leftSection={<Search size={16} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          <Divider />
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
          {user?.role === "admin" && (
            <Link
              href="/admin"
              onClick={closeMobileMenu}
              className="py-2 font-medium text-[#C41E3A] transition-colors hover:text-red-800"
            >
              Panel Admin
            </Link>
          )}
          <Divider />
          {user ? (
            <>
              <span className="py-2 text-sm text-gray-500">
                {user.name} ({user.email})
              </span>
              <button
                onClick={handleLogout}
                className="py-2 text-left text-gray-700 transition-colors hover:text-red-600"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                onClick={closeMobileMenu}
                className="py-2 text-gray-700 transition-colors hover:text-red-600"
              >
                Iniciar sesión
              </Link>
              <Link
                href="/auth/register"
                onClick={closeMobileMenu}
                className="py-2 text-gray-700 transition-colors hover:text-red-600"
              >
                Crear cuenta
              </Link>
            </>
          )}
        </Stack>
      </Drawer>
    </>
  );
}
