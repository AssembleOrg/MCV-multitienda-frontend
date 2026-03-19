"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Title,
  Table,
  Button,
  Group,
  ActionIcon,
  Badge,
  Pagination,
  Loader,
  Center,
  Text,
} from "@mantine/core";
import { IconPlus, IconEdit, IconTrash } from "@tabler/icons-react";
import { adminApi, type CampaignResponse, type PaginatedData } from "@/lib/api-client";
import { notifications } from "@mantine/notifications";
import { formatDate } from "@/lib/utils";

export default function AdminCampaignsPage() {
  const [data, setData] = useState<PaginatedData<CampaignResponse> | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const loadCampaigns = useCallback(async () => {
    setLoading(true);
    try {
      const result = await adminApi.getCampaigns({ page: String(page), limit: "20" });
      setData(result);
    } catch {
      notifications.show({ title: "Error", message: "Error al cargar campañas", color: "red" });
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    loadCampaigns();
  }, [loadCampaigns]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Eliminar "${name}"?`)) return;
    try {
      await adminApi.deleteCampaign(id);
      notifications.show({ title: "Eliminada", message: `${name} fue eliminada`, color: "green" });
      loadCampaigns();
    } catch (err) {
      notifications.show({ title: "Error", message: err instanceof Error ? err.message : "Error", color: "red" });
    }
  };

  const getCampaignStatus = (campaign: CampaignResponse) => {
    const now = new Date();
    const start = new Date(campaign.startDate);
    const end = new Date(campaign.endDate);
    if (!campaign.active) return { label: "Inactiva", color: "gray" };
    if (now < start) return { label: "Programada", color: "blue" };
    if (now > end) return { label: "Expirada", color: "red" };
    return { label: "Activa", color: "green" };
  };

  return (
    <div>
      <Group justify="space-between" mb="lg">
        <Title order={2}>Campañas de Descuento</Title>
        <Button component={Link} href="/admin/campaigns/new" leftSection={<IconPlus size={16} />} color="mcvRed">
          Nueva Campaña
        </Button>
      </Group>

      {loading ? (
        <Center py={50}><Loader color="#C41E3A" /></Center>
      ) : (
        <>
          <Table striped highlightOnHover withTableBorder>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Nombre</Table.Th>
                <Table.Th>Código</Table.Th>
                <Table.Th>Descuento</Table.Th>
                <Table.Th>Período</Table.Th>
                <Table.Th>Usos</Table.Th>
                <Table.Th>Estado</Table.Th>
                <Table.Th>Acciones</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {data?.items.map((campaign) => {
                const status = getCampaignStatus(campaign);
                return (
                  <Table.Tr key={campaign.id}>
                    <Table.Td fw={500}>{campaign.name}</Table.Td>
                    <Table.Td>
                      <Badge variant="outline" color="dark">{campaign.code}</Badge>
                    </Table.Td>
                    <Table.Td>
                      {campaign.type === "percentage"
                        ? `${campaign.value}%`
                        : `$${campaign.value.toLocaleString()}`}
                    </Table.Td>
                    <Table.Td>
                      <Text size="xs">{formatDate(campaign.startDate)}</Text>
                      <Text size="xs" c="dimmed">{formatDate(campaign.endDate)}</Text>
                    </Table.Td>
                    <Table.Td>
                      {campaign.currentUses}
                      {campaign.maxUses ? `/${campaign.maxUses}` : ""}
                    </Table.Td>
                    <Table.Td>
                      <Badge color={status.color} variant="light">{status.label}</Badge>
                    </Table.Td>
                    <Table.Td>
                      <Group gap={4}>
                        <ActionIcon component={Link} href={`/admin/campaigns/${campaign.id}`} variant="subtle" color="blue">
                          <IconEdit size={16} />
                        </ActionIcon>
                        <ActionIcon variant="subtle" color="red" onClick={() => handleDelete(campaign.id, campaign.name)}>
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                );
              })}
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
