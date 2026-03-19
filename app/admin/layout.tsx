"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  AppShell,
  NavLink,
  Burger,
  Group,
  Text,
  Loader,
  Center,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconDashboard,
  IconPackage,
  IconCategory,
  IconDiscount,
  IconSpeakerphone,
  IconShoppingCart,
  IconSettings,
  IconHistory,
  IconArrowLeft,
  IconMailCheck,
} from "@tabler/icons-react";
import { useAuthStore } from "@/lib/store";

const adminLinks = [
  { label: "Dashboard", href: "/admin", icon: IconDashboard },
  { label: "Productos", href: "/admin/products", icon: IconPackage },
  { label: "Categorías", href: "/admin/categories", icon: IconCategory },
  { label: "Campañas", href: "/admin/campaigns", icon: IconDiscount },
  { label: "Promos", href: "/admin/promos", icon: IconSpeakerphone },
  { label: "Pedidos", href: "/admin/orders", icon: IconShoppingCart },
  { label: "Tienda", href: "/admin/store", icon: IconSettings },
  { label: "Whitelist", href: "/admin/whitelist", icon: IconMailCheck },
  { label: "Historial", href: "/admin/audit-log", icon: IconHistory },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const [opened, { toggle }] = useDisclosure();

  // Middleware already redirects unauthenticated users.
  // This is just a loading state while AuthProvider hydrates.
  if (loading) {
    return (
      <Center py={100}>
        <Loader color="#C41E3A" />
      </Center>
    );
  }

  // Extra client-side guard for non-admin users
  if (!user || user.role !== "admin") {
    return (
      <Center py={100}>
        <Text c="dimmed">No tenés permisos para acceder a esta sección.</Text>
      </Center>
    );
  }

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 260,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header className="border-b border-gray-200">
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <Text fw={700} size="lg" c="#C41E3A">
              MCV Admin
            </Text>
          </Group>
          <Group>
            <Text size="sm" c="dimmed">
              {user.name}
            </Text>
            <Link
              href="/"
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
            >
              <IconArrowLeft size={16} />
              Volver al sitio
            </Link>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        {adminLinks.map((link) => (
          <NavLink
            key={link.href}
            component={Link}
            href={link.href}
            label={link.label}
            leftSection={<link.icon size={18} />}
            active={
              link.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(link.href)
            }
            color="red"
            variant="light"
          />
        ))}
      </AppShell.Navbar>

      <AppShell.Main className="bg-gray-50">{children}</AppShell.Main>
    </AppShell>
  );
}
