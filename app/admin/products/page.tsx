"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Title,
  Table,
  Button,
  Group,
  TextInput,
  Badge,
  ActionIcon,
  Pagination,
  Text,
  Box,
  Card,
  Stack,
  Skeleton,
  Center,
} from "@mantine/core";
import { useMediaQuery, useDisclosure } from "@mantine/hooks";
import { IconSearch, IconPlus, IconEdit, IconTrash } from "@tabler/icons-react";
import { adminApi, type ProductResponse, type PaginatedData } from "@/lib/api-client";
import { formatPrice } from "@/lib/utils";
import { notifications } from "@mantine/notifications";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { TableSkeleton } from "@/components/ui/skeletons";

export default function AdminProductsPage() {
  const [data, setData] = useState<PaginatedData<ProductResponse> | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleting, setDeleting] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<{ id: string; name: string } | null>(null);
  const [confirmOpened, { open: openConfirm, close: closeConfirm }] = useDisclosure(false);
  const isMobile = useMediaQuery("(max-width: 48em)");

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = { page: String(page), limit: "20" };
      if (search) params.search = search;
      const result = await adminApi.getProducts(params);
      setData(result);
    } catch {
      notifications.show({ title: "Error", message: "No se pudieron cargar los productos", color: "red" });
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleDelete = (id: string, name: string) => {
    setPendingDelete({ id, name });
    openConfirm();
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await adminApi.deleteProduct(pendingDelete.id);
      notifications.show({ title: "Eliminado", message: `${pendingDelete.name} fue eliminado`, color: "green" });
      closeConfirm();
      loadProducts();
    } catch (err) {
      notifications.show({ title: "Error", message: err instanceof Error ? err.message : "Error", color: "red" });
    } finally {
      setDeleting(false);
      setPendingDelete(null);
    }
  };

  return (
    <div>
      <Group justify="space-between" mb="lg">
        <Title order={2}>Productos</Title>
        <Button
          component={Link}
          href="/admin/products/new"
          leftSection={<IconPlus size={16} />}
          color="mcvRed"
        >
          Nuevo Producto
        </Button>
      </Group>

      <TextInput
        placeholder="Buscar por nombre o SKU..."
        leftSection={<IconSearch size={16} />}
        mb="md"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
      />

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
          <TableSkeleton rows={8} cols={6} />
        )
      ) : (
        <>
          {isMobile ? (
            <Stack gap="xs">
              {data?.items.map((product) => (
                <Card key={product.id} component={Link} href={`/admin/products/${product.id}`} withBorder padding="sm" radius="sm" style={{ cursor: "pointer", textDecoration: "none", color: "inherit" }}>
                  <Group justify="space-between" wrap="nowrap">
                    <div style={{ minWidth: 0 }}>
                      <Text size="sm" fw={600} truncate>{product.name}</Text>
                      <Text size="xs" c="dimmed">{product.category.name} · {product.sku}</Text>
                    </div>
                    <ActionIcon variant="light" color="red" size="lg" radius="md" style={{ border: "1px solid #fecaca", flexShrink: 0 }} onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDelete(product.id, product.name); }}>
                      <IconTrash size={16} stroke={1.5} />
                    </ActionIcon>
                  </Group>
                  <Group gap="xs" mt={6}>
                    <Text size="sm" fw={500}>{formatPrice(product.price)}</Text>
                    <Badge size="xs" color={product.stock > 0 ? "green" : "red"} variant="light">
                      Stock: {product.stock}
                    </Badge>
                    <Badge size="xs" color={product.active ? "green" : "gray"} variant="light">
                      {product.active ? "Activo" : "Inactivo"}
                    </Badge>
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
                    <Table.Th>Nombre</Table.Th>
                    <Table.Th>SKU</Table.Th>
                    <Table.Th>Precio</Table.Th>
                    <Table.Th>Stock</Table.Th>
                    <Table.Th>Estado</Table.Th>
                    <Table.Th>Acciones</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {data?.items.map((product) => (
                    <Table.Tr key={product.id}>
                      <Table.Td>
                        <Text size="sm" fw={500}>{product.name}</Text>
                        <Text size="xs" c="dimmed">{product.category.name}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" ff="monospace">{product.sku}</Text>
                      </Table.Td>
                      <Table.Td>{formatPrice(product.price)}</Table.Td>
                      <Table.Td>
                        <Badge color={product.stock > 0 ? "green" : "red"} variant="light">
                          {product.stock}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Badge color={product.active ? "green" : "gray"} variant="light">
                          {product.active ? "Activo" : "Inactivo"}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Group gap={4}>
                          <ActionIcon component={Link} href={`/admin/products/${product.id}`} variant="light" color="gray" size="md" radius="md" style={{ border: "1px solid #E5E5E5" }}>
                            <IconEdit size={15} stroke={1.5} />
                          </ActionIcon>
                          <ActionIcon variant="light" color="red" size="md" radius="md" style={{ border: "1px solid #fecaca" }} onClick={() => handleDelete(product.id, product.name)}>
                            <IconTrash size={15} stroke={1.5} />
                          </ActionIcon>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  ))}
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
      <ConfirmModal
        opened={confirmOpened}
        onClose={() => { closeConfirm(); setPendingDelete(null); }}
        onConfirm={confirmDelete}
        loading={deleting}
        title={`¿Eliminar "${pendingDelete?.name}"?`}
        message="Esta acción no se puede deshacer."
      />
    </div>
  );
}
