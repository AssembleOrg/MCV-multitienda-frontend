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
  Center,
  Text,
  Box,
  Card,
  Stack,
  Skeleton,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { TableSkeleton } from "@/components/ui/skeletons";
import { IconPlus, IconEdit, IconTrash } from "@tabler/icons-react";
import { adminApi, type CampaignResponse, type PaginatedData } from "@/lib/api-client";
import { notifications } from "@mantine/notifications";
import { formatDate } from "@/lib/utils";

export default function AdminCampaignsPage() {
  const [data, setData] = useState<PaginatedData<CampaignResponse> | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [deleting, setDeleting] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<{ id: string; name: string } | null>(null);
  const [confirmOpened, { open: openConfirm, close: closeConfirm }] = useDisclosure(false);
  const isMobile = useMediaQuery("(max-width: 48em)");

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

  const handleDelete = (id: string, name: string) => {
    setPendingDelete({ id, name });
    openConfirm();
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await adminApi.deleteCampaign(pendingDelete.id);
      notifications.show({ title: "Eliminada", message: `${pendingDelete.name} fue eliminada`, color: "green" });
      closeConfirm();
      loadCampaigns();
    } catch (err) {
      notifications.show({ title: "Error", message: err instanceof Error ? err.message : "Error", color: "red" });
    } finally {
      setDeleting(false);
      setPendingDelete(null);
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
              {data?.items.map((campaign) => {
                const status = getCampaignStatus(campaign);
                return (
                  <Card key={campaign.id} component={Link} href={`/admin/campaigns/${campaign.id}`} withBorder padding="sm" radius="sm" style={{ cursor: "pointer", textDecoration: "none", color: "inherit" }}>
                    <Group justify="space-between" wrap="nowrap">
                      <div style={{ minWidth: 0 }}>
                        <Text size="sm" fw={600} truncate>{campaign.name}</Text>
                        <Text size="xs" c="dimmed" ff="monospace">{campaign.code}</Text>
                      </div>
                      <ActionIcon variant="light" color="red" size="lg" radius="md" style={{ border: "1px solid #fecaca", flexShrink: 0 }} onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDelete(campaign.id, campaign.name); }}>
                        <IconTrash size={16} stroke={1.5} />
                      </ActionIcon>
                    </Group>
                    <Group gap="xs" mt={6}>
                      <Text size="sm" fw={500}>
                        {campaign.type === "percentage" ? `${campaign.value}%` : `$${campaign.value.toLocaleString()}`}
                      </Text>
                      <Badge size="xs" color={status.color} variant="light">{status.label}</Badge>
                      <Text size="xs" c="dimmed">
                        {campaign.currentUses}{campaign.maxUses ? `/${campaign.maxUses}` : ""} usos
                      </Text>
                    </Group>
                  </Card>
                );
              })}
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
                            <ActionIcon component={Link} href={`/admin/campaigns/${campaign.id}`} variant="light" color="gray" size="md" radius="md" style={{ border: "1px solid #E5E5E5" }}>
                              <IconEdit size={15} stroke={1.5} />
                            </ActionIcon>
                            <ActionIcon variant="light" color="red" size="md" radius="md" style={{ border: "1px solid #fecaca" }} onClick={() => handleDelete(campaign.id, campaign.name)}>
                              <IconTrash size={15} stroke={1.5} />
                            </ActionIcon>
                          </Group>
                        </Table.Td>
                      </Table.Tr>
                    );
                  })}
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
