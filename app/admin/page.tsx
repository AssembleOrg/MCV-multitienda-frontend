"use client";

import { useEffect, useState } from "react";
import {
  Title,
  SimpleGrid,
  Card,
  Text,
  Group,
  Loader,
  Center,
} from "@mantine/core";
import {
  IconPackage,
  IconCategory,
  IconShoppingCart,
  IconDiscount,
} from "@tabler/icons-react";
import { adminApi } from "@/lib/api-client";

interface DashboardStats {
  products: number;
  categories: number;
  orders: number;
  campaigns: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [products, categories, orders, campaigns] = await Promise.all([
          adminApi.getProducts({ limit: "1" }),
          adminApi.getCategories(),
          adminApi.getOrders({ limit: "1" }),
          adminApi.getCampaigns({ limit: "1" }),
        ]);
        setStats({
          products: products.total,
          categories: categories.length,
          orders: orders.total,
          campaigns: campaigns.total,
        });
      } catch {
        setStats({ products: 0, categories: 0, orders: 0, campaigns: 0 });
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <Center py={100}>
        <Loader color="#C41E3A" />
      </Center>
    );
  }

  const cards = [
    {
      title: "Productos",
      value: stats?.products || 0,
      icon: IconPackage,
      color: "#C41E3A",
    },
    {
      title: "Categorías",
      value: stats?.categories || 0,
      icon: IconCategory,
      color: "#2563eb",
    },
    {
      title: "Pedidos",
      value: stats?.orders || 0,
      icon: IconShoppingCart,
      color: "#16a34a",
    },
    {
      title: "Campañas",
      value: stats?.campaigns || 0,
      icon: IconDiscount,
      color: "#9333ea",
    },
  ];

  return (
    <div>
      <Title order={2} mb="lg">
        Dashboard
      </Title>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
        {cards.map((card) => (
          <Card key={card.title} shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between">
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  {card.title}
                </Text>
                <Text size="xl" fw={700} mt={4}>
                  {card.value}
                </Text>
              </div>
              <card.icon size={32} color={card.color} stroke={1.5} />
            </Group>
          </Card>
        ))}
      </SimpleGrid>
    </div>
  );
}
