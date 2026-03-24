"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Title,
  Table,
  Group,
  TextInput,
  Badge,
  Select,
  Pagination,
  Center,
  Text,
  ActionIcon,
  Box,
  Card,
  Stack,
  Skeleton,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { TableSkeleton } from "@/components/ui/skeletons";
import { IconSearch, IconEye } from "@tabler/icons-react";
import { adminApi, type OrderResponse, type PaginatedData } from "@/lib/api-client";
import { formatPrice, formatDate } from "@/lib/utils";
import { notifications } from "@mantine/notifications";

const statusColors: Record<string, string> = {
  pending: "yellow",
  confirmed: "blue",
  processing: "cyan",
  shipped: "indigo",
  delivered: "green",
  cancelled: "red",
};

const statusLabels: Record<string, string> = {
  pending: "Pendiente",
  confirmed: "Confirmado",
  processing: "Procesando",
  shipped: "Enviado",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

export default function AdminOrdersPage() {
  const [data, setData] = useState<PaginatedData<OrderResponse> | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const isMobile = useMediaQuery("(max-width: 48em)");

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = { page: String(page), limit: "20" };
      if (search) params.search = search;
      if (status) params.status = status;
      setData(await adminApi.getOrders(params));
    } catch {
      notifications.show({ title: "Error", message: "Error al cargar pedidos", color: "red" });
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  return (
    <div>
      <Title order={2} mb="lg">Pedidos</Title>

      <Group mb="md" wrap="wrap">
        <TextInput
          placeholder="Buscar por nombre, email o ID..."
          leftSection={<IconSearch size={16} />}
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          style={{ flex: 1, minWidth: 180 }}
        />
        <Select
          placeholder="Estado"
          clearable
          data={Object.entries(statusLabels).map(([value, label]) => ({ value, label }))}
          value={status}
          onChange={(v) => { setStatus(v); setPage(1); }}
          style={{ minWidth: 140 }}
        />
      </Group>

      {loading ? (
        isMobile ? (
          <Stack gap="xs">
            {Array.from({ length: 5 }).map((_, i) => (
              <Card key={i} withBorder padding="sm" radius="sm">
                <Skeleton height={14} width="60%" mb={8} radius="sm" />
                <Skeleton height={11} width="40%" radius="sm" />
              </Card>
            ))}
          </Stack>
        ) : (
          <TableSkeleton rows={8} cols={7} />
        )
      ) : (
        <>
          {isMobile ? (
            <Stack gap="xs">
              {data?.items.length === 0 && (
                <Text ta="center" c="dimmed" py="md">No hay pedidos</Text>
              )}
              {data?.items.map((order) => (
                <Card key={order.id} component={Link} href={`/admin/orders/${order.id}`} withBorder padding="sm" radius="sm" style={{ cursor: "pointer", textDecoration: "none", color: "inherit" }}>
                  <Group justify="space-between" wrap="nowrap">
                    <div style={{ minWidth: 0 }}>
                      <Text size="sm" fw={600} truncate>
                        {order.contactName || order.user?.name || "-"}
                      </Text>
                      <Text size="xs" c="dimmed" truncate>
                        {order.contactEmail || order.user?.email || ""}
                      </Text>
                    </div>
                  </Group>
                  <Group gap="xs" mt={6}>
                    <Text size="sm" fw={500}>{formatPrice(order.total)}</Text>
                    <Badge size="xs" color={statusColors[order.status] || "gray"} variant="light">
                      {statusLabels[order.status] || order.status}
                    </Badge>
                    <Text size="xs" c="dimmed">{formatDate(order.createdAt)}</Text>
                  </Group>
                </Card>
              ))}
            </Stack>
          ) : (
            <Box style={{ overflowX: "auto", border: "1px solid #E5E5E5", borderRadius: 8 }}>
              <Table highlightOnHover styles={{
                thead: { background: "#FAFAFA" },
                th: { fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600, color: "#888", paddingTop: 10, paddingBottom: 10 },
                tr: { borderBottom: "1px solid #F0F0F0" },
                td: { height: 44, verticalAlign: "middle" },
              }}>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>ID</Table.Th>
                    <Table.Th>Cliente</Table.Th>
                    <Table.Th>Total</Table.Th>
                    <Table.Th>Items</Table.Th>
                    <Table.Th>Estado</Table.Th>
                    <Table.Th>Fecha</Table.Th>
                    <Table.Th>Ver</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {data?.items.map((order) => (
                    <Table.Tr key={order.id}>
                      <Table.Td>
                        <Text size="xs" ff="monospace">{order.id.slice(0, 8)}...</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{order.contactName || order.user?.name || "-"}</Text>
                        <Text size="xs" c="dimmed">{order.contactEmail || order.user?.email || ""}</Text>
                      </Table.Td>
                      <Table.Td fw={500}>{formatPrice(order.total)}</Table.Td>
                      <Table.Td>{order.items.length}</Table.Td>
                      <Table.Td>
                        <Badge color={statusColors[order.status] || "gray"} variant="light">
                          {statusLabels[order.status] || order.status}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Text size="xs">{formatDate(order.createdAt)}</Text>
                      </Table.Td>
                      <Table.Td>
                        <ActionIcon component={Link} href={`/admin/orders/${order.id}`} variant="light" color="gray" size="md" radius="md" style={{ border: "1px solid #E5E5E5" }}>
                          <IconEye size={15} stroke={1.5} />
                        </ActionIcon>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                  {data?.items.length === 0 && (
                    <Table.Tr>
                      <Table.Td colSpan={7}>
                        <Text ta="center" c="dimmed" py="md">No hay pedidos</Text>
                      </Table.Td>
                    </Table.Tr>
                  )}
                </Table.Tbody>
              </Table>
            </Box>
          )}

          {data && data.totalPages > 1 && (
            <Center mt="lg">
              <Pagination total={data.totalPages} value={page} onChange={setPage} color="mcvRed" />
            </Center>
          )}
        </>
      )}
    </div>
  );
}
