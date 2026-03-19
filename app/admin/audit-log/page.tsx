"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Title,
  Table,
  Group,
  Select,
  TextInput,
  Pagination,
  Loader,
  Center,
  Text,
  Badge,
  Code,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { adminApi, type AuditLogResponse, type PaginatedData } from "@/lib/api-client";
import { formatDate } from "@/lib/utils";

const actionColors: Record<string, string> = {
  create: "green",
  update: "blue",
  delete: "red",
};

const actionLabels: Record<string, string> = {
  create: "Creación",
  update: "Edición",
  delete: "Eliminación",
};

const entityLabels: Record<string, string> = {
  product: "Producto",
  category: "Categoría",
  campaign: "Campaña",
  promo: "Promo",
  order: "Pedido",
  store: "Tienda",
  user: "Usuario",
};

export default function AdminAuditLogPage() {
  const [data, setData] = useState<PaginatedData<AuditLogResponse> | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [entity, setEntity] = useState<string | null>(null);
  const [action, setAction] = useState<string | null>(null);

  const loadLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = { page: String(page), limit: "30" };
      if (entity) params.entity = entity;
      if (action) params.action = action;
      setData(await adminApi.getAuditLog(params));
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [page, entity, action]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  return (
    <div>
      <Title order={2} mb="lg">Historial de Actividad (CRM)</Title>

      <Group mb="md">
        <Select
          placeholder="Entidad"
          clearable
          data={Object.entries(entityLabels).map(([value, label]) => ({ value, label }))}
          value={entity}
          onChange={(v) => { setEntity(v); setPage(1); }}
          w={160}
        />
        <Select
          placeholder="Acción"
          clearable
          data={Object.entries(actionLabels).map(([value, label]) => ({ value, label }))}
          value={action}
          onChange={(v) => { setAction(v); setPage(1); }}
          w={140}
        />
      </Group>

      {loading ? (
        <Center py={50}><Loader color="#C41E3A" /></Center>
      ) : (
        <>
          <Table striped highlightOnHover withTableBorder>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Fecha</Table.Th>
                <Table.Th>Admin</Table.Th>
                <Table.Th>Acción</Table.Th>
                <Table.Th>Entidad</Table.Th>
                <Table.Th>ID</Table.Th>
                <Table.Th>Cambios</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {data?.items.map((log) => (
                <Table.Tr key={log.id}>
                  <Table.Td>
                    <Text size="xs">{formatDate(log.createdAt)}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{log.admin.name}</Text>
                    <Text size="xs" c="dimmed">{log.admin.email}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge color={actionColors[log.action] || "gray"} variant="light">
                      {actionLabels[log.action] || log.action}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Badge variant="outline" color="dark">
                      {entityLabels[log.entity] || log.entity}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text size="xs" ff="monospace">{log.entityId.slice(0, 8)}...</Text>
                  </Table.Td>
                  <Table.Td>
                    {log.changes ? (
                      <Code block style={{ maxWidth: 300, maxHeight: 60, overflow: "auto", fontSize: 10 }}>
                        {JSON.stringify(log.changes, null, 2)}
                      </Code>
                    ) : (
                      "-"
                    )}
                  </Table.Td>
                </Table.Tr>
              ))}
              {data?.items.length === 0 && (
                <Table.Tr>
                  <Table.Td colSpan={6}>
                    <Text ta="center" c="dimmed" py="md">No hay registros</Text>
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
