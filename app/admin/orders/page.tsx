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
  Loader,
  Center,
  Text,
  ActionIcon,
} from "@mantine/core";
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

      <Group mb="md">
        <TextInput
          placeholder="Buscar por nombre, email o ID..."
          leftSection={<IconSearch size={16} />}
          value={search}
          onChange={(e) => { setSearch(e.currentTarget.value); setPage(1); }}
          style={{ flex: 1 }}
        />
        <Select
          placeholder="Estado"
          clearable
          data={Object.entries(statusLabels).map(([value, label]) => ({ value, label }))}
          value={status}
          onChange={(v) => { setStatus(v); setPage(1); }}
          w={160}
        />
      </Group>

      {loading ? (
        <Center py={50}><Loader color="#C41E3A" /></Center>
      ) : (
        <>
          <Table striped highlightOnHover withTableBorder>
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
                    <ActionIcon component={Link} href={`/admin/orders/${order.id}`} variant="subtle" color="blue">
                      <IconEye size={16} />
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
