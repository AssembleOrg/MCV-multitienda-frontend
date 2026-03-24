"use client";

import Link from "next/link";
import Image from "next/image";
import { Title, SimpleGrid, Text, Group, Box } from "@mantine/core";
import {
  IconPackage,
  IconShoppingCart,
  IconDiscount,
  IconSettings,
  IconCategory,
  IconChevronRight,
} from "@tabler/icons-react";

const shortcuts = [
  {
    href: "/admin/products",
    icon: IconPackage,
    label: "Productos",
    description: "Gestionar catálogo, stock y variantes",
    color: "#C41E3A",
    tint: "rgba(196,30,58,0.06)",
  },
  {
    href: "/admin/orders",
    icon: IconShoppingCart,
    label: "Pedidos",
    description: "Ver y gestionar pedidos recientes",
    color: "#16a34a",
    tint: "rgba(22,163,74,0.06)",
  },
  {
    href: "/admin/campaigns",
    icon: IconDiscount,
    label: "Campañas",
    description: "Crear y activar descuentos",
    color: "#9333ea",
    tint: "rgba(147,51,234,0.06)",
  },
  {
    href: "/admin/categories",
    icon: IconCategory,
    label: "Categorías",
    description: "Organizar el catálogo por categoría",
    color: "#2563eb",
    tint: "rgba(37,99,235,0.06)",
  },
  {
    href: "/admin/store",
    icon: IconSettings,
    label: "Tienda",
    description: "Configuración general de la tienda",
    color: "#d97706",
    tint: "rgba(217,119,6,0.06)",
  },
];

export default function AdminDashboard() {
  return (
    <div>
      <Title order={3} mb={4} style={{ fontWeight: 600, color: "#1a1a1a" }}>
        Panel de administración
      </Title>
      <Text size="sm" c="dimmed" mb="lg">
        Accesos rápidos a las secciones principales
      </Text>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="sm">
        {shortcuts.map((s) => (
          <Box
            key={s.href}
            component={Link}
            href={s.href}
            style={{
              background: "#FFFFFF",
              border: "1px solid #E5E5E5",
              borderRadius: 8,
              padding: "16px 20px",
              textDecoration: "none",
              display: "block",
              transition: "border-color 150ms, box-shadow 150ms",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "#D0D0D0";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "#E5E5E5";
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
            }}
          >
            <Group justify="space-between" align="flex-start" wrap="nowrap">
              <Group gap={12} wrap="nowrap" align="flex-start">
                <Box
                  style={{
                    background: s.tint,
                    borderRadius: 8,
                    padding: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <s.icon size={20} color={s.color} stroke={1.8} />
                </Box>
                <div>
                  <Text size="sm" fw={600} c="#1a1a1a" style={{ lineHeight: 1.3 }}>
                    {s.label}
                  </Text>
                  <Text size="xs" c="#888" mt={2} style={{ lineHeight: 1.4 }}>
                    {s.description}
                  </Text>
                </div>
              </Group>
              <IconChevronRight size={16} color="#CCC" style={{ flexShrink: 0, marginTop: 2 }} />
            </Group>
          </Box>
        ))}
      </SimpleGrid>

      <div style={{ marginTop: 48, textAlign: "center" }}>
        <Text size="xs" c="dimmed" mb={8}>
          Un producto de
        </Text>
        <Image
          src="/pistech-logo.png"
          alt="Pistech"
          width={80}
          height={28}
          style={{ objectFit: "contain", width: 80, height: "auto", opacity: 0.7, display: "block", margin: "0 auto" }}
        />
      </div>
    </div>
  );
}
