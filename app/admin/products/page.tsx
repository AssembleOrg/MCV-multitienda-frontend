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
  Loader,
  Center,
  Text,
} from "@mantine/core";
import { IconSearch, IconPlus, IconEdit, IconTrash } from "@tabler/icons-react";
import { adminApi, type ProductResponse, type PaginatedData } from "@/lib/api-client";
import { formatPrice } from "@/lib/utils";
import { notifications } from "@mantine/notifications";

export default function AdminProductsPage() {
  const [data, setData] = useState<PaginatedData<ProductResponse> | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

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

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Eliminar "${name}"?`)) return;
    try {
      await adminApi.deleteProduct(id);
      notifications.show({ title: "Eliminado", message: `${name} fue eliminado`, color: "green" });
      loadProducts();
    } catch (err) {
      notifications.show({ title: "Error", message: err instanceof Error ? err.message : "Error", color: "red" });
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
          setSearch(e.currentTarget.value);
          setPage(1);
        }}
      />

      {loading ? (
        <Center py={50}>
          <Loader color="#C41E3A" />
        </Center>
      ) : (
        <>
          <Table striped highlightOnHover withTableBorder>
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
                    <Text size="sm" fw={500}>
                      {product.name}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {product.category.name}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" ff="monospace">
                      {product.sku}
                    </Text>
                  </Table.Td>
                  <Table.Td>{formatPrice(product.price)}</Table.Td>
                  <Table.Td>
                    <Badge color={product.stock > 0 ? "green" : "red"} variant="light">
                      {product.stock}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      color={product.active ? "green" : "gray"}
                      variant="light"
                    >
                      {product.active ? "Activo" : "Inactivo"}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Group gap={4}>
                      <ActionIcon
                        component={Link}
                        href={`/admin/products/${product.id}`}
                        variant="subtle"
                        color="blue"
                      >
                        <IconEdit size={16} />
                      </ActionIcon>
                      <ActionIcon
                        variant="subtle"
                        color="red"
                        onClick={() => handleDelete(product.id, product.name)}
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>

          {data && data.totalPages > 1 && (
            <Center mt="lg">
              <Pagination
                total={data.totalPages}
                value={page}
                onChange={setPage}
                color="mcvRed"
              />
            </Center>
          )}
        </>
      )}
    </div>
  );
}
