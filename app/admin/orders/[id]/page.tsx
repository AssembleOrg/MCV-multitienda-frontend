"use client";

import { useState, useEffect, use } from "react";
import {
  Title,
  Paper,
  Group,
  Text,
  Badge,
  Select,
  Textarea,
  Button,
  Table,
  SimpleGrid,
  Loader,
  Center,
} from "@mantine/core";
import { adminApi, type OrderResponse } from "@/lib/api-client";
import { formatPrice, formatDate } from "@/lib/utils";
import { notifications } from "@mantine/notifications";

const statusLabels: Record<string, string> = {
  pending: "Pendiente",
  confirmed: "Confirmado",
  processing: "Procesando",
  shipped: "Enviado",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

const statusColors: Record<string, string> = {
  pending: "yellow",
  confirmed: "blue",
  processing: "cyan",
  shipped: "indigo",
  delivered: "green",
  cancelled: "red",
};

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    adminApi
      .getOrder(id)
      .then((o) => {
        setOrder(o);
        setStatus(o.status);
        setNotes(o.notes || "");
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpdate = async () => {
    setSaving(true);
    try {
      const updated = await adminApi.updateOrder(id, { status, notes });
      setOrder(updated);
      notifications.show({ title: "Actualizado", message: "Pedido actualizado", color: "green" });
    } catch (err) {
      notifications.show({ title: "Error", message: err instanceof Error ? err.message : "Error", color: "red" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Center py={100}><Loader color="#C41E3A" /></Center>;
  if (!order) return <Text>Pedido no encontrado</Text>;

  return (
    <div>
      <Group justify="space-between" mb="lg">
        <Title order={2}>Pedido #{order.id.slice(0, 8)}</Title>
        <Badge size="lg" color={statusColors[order.status] || "gray"} variant="light">
          {statusLabels[order.status] || order.status}
        </Badge>
      </Group>

      <SimpleGrid cols={{ base: 1, md: 2 }} mb="lg">
        <Paper p="md" withBorder>
          <Text fw={700} mb="xs">Cliente</Text>
          <Text size="sm">{order.contactName || order.user?.name || "-"}</Text>
          <Text size="sm" c="dimmed">{order.contactEmail || order.user?.email || "-"}</Text>
          <Text size="sm" c="dimmed">{order.contactPhone || "-"}</Text>
        </Paper>
        <Paper p="md" withBorder>
          <Text fw={700} mb="xs">Resumen</Text>
          <Group justify="space-between"><Text size="sm">Subtotal:</Text><Text size="sm">{formatPrice(order.subtotal)}</Text></Group>
          <Group justify="space-between"><Text size="sm">Envío:</Text><Text size="sm">{formatPrice(order.shippingCost)}</Text></Group>
          {order.discount > 0 && <Group justify="space-between"><Text size="sm" c="green">Descuento:</Text><Text size="sm" c="green">-{formatPrice(order.discount)}</Text></Group>}
          <Group justify="space-between" mt="xs"><Text fw={700}>Total:</Text><Text fw={700} size="lg">{formatPrice(order.total)}</Text></Group>
          <Text size="xs" c="dimmed" mt="xs">{formatDate(order.createdAt)}</Text>
        </Paper>
      </SimpleGrid>

      <Paper p="md" withBorder mb="lg">
        <Text fw={700} mb="xs">Productos</Text>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Producto</Table.Th>
              <Table.Th>SKU</Table.Th>
              <Table.Th>Cantidad</Table.Th>
              <Table.Th>Precio</Table.Th>
              <Table.Th>Subtotal</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {order.items.map((item) => (
              <Table.Tr key={item.id}>
                <Table.Td>{item.product.name}</Table.Td>
                <Table.Td ff="monospace">{item.product.sku}</Table.Td>
                <Table.Td>{item.quantity}</Table.Td>
                <Table.Td>{formatPrice(item.price)}</Table.Td>
                <Table.Td fw={500}>{formatPrice(item.price * item.quantity)}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Paper>

      <Paper p="md" withBorder>
        <Text fw={700} mb="xs">Actualizar Estado</Text>
        <Group align="end">
          <Select
            label="Estado"
            data={Object.entries(statusLabels).map(([value, label]) => ({ value, label }))}
            value={status}
            onChange={(v) => setStatus(v || "")}
            w={200}
          />
          <Textarea
            label="Notas"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            style={{ flex: 1 }}
          />
          <Button color="mcvRed" loading={saving} onClick={handleUpdate}>
            Actualizar
          </Button>
        </Group>
      </Paper>
    </div>
  );
}
