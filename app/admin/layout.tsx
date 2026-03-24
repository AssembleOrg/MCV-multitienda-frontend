"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  AppShell,
  Burger,
  Group,
  Text,
  Loader,
  Center,
  Avatar,
  UnstyledButton,
  Box,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
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
  const [opened, { toggle, close }] = useDisclosure();
  const isDesktop = useMediaQuery("(min-width: 48em)");

  if (loading) {
    return (
      <Center py={100}>
        <Loader color="#C41E3A" />
      </Center>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <Center py={100}>
        <Text c="dimmed">No tenés permisos para acceder a esta sección.</Text>
      </Center>
    );
  }

  const initials = user.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : "A";

  return (
    <AppShell
      header={{ height: 52 }}
      navbar={{
        width: 220,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
      styles={{
        main: { background: "#F5F5F7" },
        navbar: {
          background: "#FFFFFF",
          borderRight: "1px solid #E5E5E5",
        },
        header: {
          background: "#FFFFFF",
          borderBottom: "1px solid #E5E5E5",
        },
      }}
    >
      {/* Header */}
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group gap="xs">
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" color="#555" />
            <Text fw={600} size="sm" c="#C41E3A" style={{ letterSpacing: "-0.01em" }}>
              MCV Admin
            </Text>
          </Group>
          <Group gap="md">
            <Link
              href="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontSize: 12,
                color: "#888",
                textDecoration: "none",
              }}
            >
              <IconArrowLeft size={13} />
              Volver al sitio
            </Link>
            <Group gap={8}>
              <Avatar size={28} radius="xl" color="red" style={{ background: "#C41E3A" }}>
                <Text size="xs" fw={700} c="white">{initials}</Text>
              </Avatar>
              <Text size="xs" c="#555" visibleFrom="sm">{user.name}</Text>
            </Group>
          </Group>
        </Group>
      </AppShell.Header>

      {/* Sidebar */}
      <AppShell.Navbar p={0}>
        <Box py={8}>
          {adminLinks.map((link) => {
            const isActive =
              link.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(link.href);

            return (
              <UnstyledButton
                key={link.href}
                component={Link}
                href={link.href}
                onClick={() => { if (!isDesktop) close(); }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  width: "100%",
                  padding: isDesktop ? "8px 16px" : "13px 16px",
                  borderRadius: 0,
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? "#C41E3A" : "#444",
                  background: isActive ? "#FFF0F2" : "transparent",
                  borderLeft: isActive ? "3px solid #C41E3A" : "3px solid transparent",
                  transition: "background 150ms, color 150ms",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.background = "#F5F5F7";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                  }
                }}
              >
                <link.icon
                  size={17}
                  color={isActive ? "#C41E3A" : "#777"}
                  stroke={isActive ? 2 : 1.5}
                />
                {link.label}
              </UnstyledButton>
            );
          })}
        </Box>
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
