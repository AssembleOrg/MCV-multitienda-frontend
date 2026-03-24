"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Title,
  Table,
  Button,
  Group,
  ActionIcon,
  Badge,
  Modal,
  TextInput,
  NumberInput,
  Switch,
  Box,
  Card,
  Stack,
  Text,
  Skeleton,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { TableSkeleton } from "@/components/ui/skeletons";
import { IconPlus, IconEdit, IconTrash } from "@tabler/icons-react";
import { adminApi, type CategoryResponse } from "@/lib/api-client";
import { notifications } from "@mantine/notifications";
import { slugify } from "@/lib/utils";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<{ id: string; name: string } | null>(null);
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);
  const [confirmOpened, { open: openConfirm, close: closeConfirm }] = useDisclosure(false);
  const isMobile = useMediaQuery("(max-width: 48em)");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    icon: "",
    sortOrder: 0,
    active: true,
  });

  const loadCategories = useCallback(async () => {
    setLoading(true);
    try {
      const result = await adminApi.getCategories();
      setCategories(result);
    } catch {
      notifications.show({ title: "Error", message: "Error al cargar categorías", color: "red" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleNew = () => {
    setEditingId(null);
    setForm({ name: "", slug: "", description: "", icon: "", sortOrder: 0, active: true });
    openModal();
  };

  const handleEdit = (cat: CategoryResponse) => {
    setEditingId(cat.id);
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
      icon: cat.icon || "",
      sortOrder: cat.sortOrder,
      active: cat.active,
    });
    openModal();
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingId) {
        await adminApi.updateCategory(editingId, form);
        notifications.show({ title: "Actualizado", message: "Categoría actualizada", color: "green" });
      } else {
        await adminApi.createCategory(form);
        notifications.show({ title: "Creada", message: "Categoría creada", color: "green" });
      }
      closeModal();
      loadCategories();
    } catch (err) {
      notifications.show({ title: "Error", message: err instanceof Error ? err.message : "Error", color: "red" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: string, name: string) => {
    setPendingDelete({ id, name });
    openConfirm();
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await adminApi.deleteCategory(pendingDelete.id);
      notifications.show({ title: "Eliminada", message: `${pendingDelete.name} fue eliminada`, color: "green" });
      closeConfirm();
      loadCategories();
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
        <Title order={2}>Categorías</Title>
        <Button leftSection={<IconPlus size={16} />} color="mcvRed" onClick={handleNew}>
          Nueva Categoría
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
          <TableSkeleton rows={6} cols={6} />
        )
      ) : isMobile ? (
        <Stack gap="xs">
          {categories.map((cat) => (
            <Card key={cat.id} withBorder padding="sm" radius="sm" style={{ cursor: "pointer" }} onClick={() => handleEdit(cat)}>
              <Group justify="space-between" wrap="nowrap">
                <div style={{ minWidth: 0 }}>
                  <Text size="sm" fw={600} truncate>{cat.name}</Text>
                  <Text size="xs" c="dimmed">{cat._count?.products || 0} productos</Text>
                </div>
                <ActionIcon variant="light" color="red" size="lg" radius="md" style={{ border: "1px solid #fecaca", flexShrink: 0 }} onClick={(e) => { e.stopPropagation(); handleDelete(cat.id, cat.name); }}>
                  <IconTrash size={16} stroke={1.5} />
                </ActionIcon>
              </Group>
              <Group gap="xs" mt={6}>
                <Badge size="xs" color={cat.active ? "green" : "gray"} variant="light">
                  {cat.active ? "Activa" : "Inactiva"}
                </Badge>
                <Text size="xs" c="dimmed">Orden: {cat.sortOrder}</Text>
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
                <Table.Th>Slug</Table.Th>
                <Table.Th>Productos</Table.Th>
                <Table.Th>Orden</Table.Th>
                <Table.Th>Estado</Table.Th>
                <Table.Th>Acciones</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {categories.map((cat) => (
                <Table.Tr key={cat.id}>
                  <Table.Td fw={500}>{cat.name}</Table.Td>
                  <Table.Td ff="monospace">{cat.slug}</Table.Td>
                  <Table.Td>{cat._count?.products || 0}</Table.Td>
                  <Table.Td>{cat.sortOrder}</Table.Td>
                  <Table.Td>
                    <Badge color={cat.active ? "green" : "gray"} variant="light">
                      {cat.active ? "Activa" : "Inactiva"}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Group gap={4}>
                      <ActionIcon variant="light" color="gray" size="md" radius="md" style={{ border: "1px solid #E5E5E5" }} onClick={() => handleEdit(cat)}>
                        <IconEdit size={15} stroke={1.5} />
                      </ActionIcon>
                      <ActionIcon variant="light" color="red" size="md" radius="md" style={{ border: "1px solid #fecaca" }} onClick={() => handleDelete(cat.id, cat.name)}>
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

      <Modal opened={modalOpened} onClose={closeModal} title={editingId ? "Editar Categoría" : "Nueva Categoría"}>
        <TextInput
          label="Nombre"
          required
          mb="sm"
          value={form.name}
          onChange={(e) => {
            const name = e.target.value;
            setForm((f) => ({ ...f, name, ...(editingId ? {} : { slug: slugify(name) }) }));
          }}
        />
        <TextInput
          label="Slug"
          required
          mb="sm"
          value={form.slug}
          onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
        />
        <TextInput
          label="Descripción"
          mb="sm"
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
        />
        <TextInput
          label="Icono"
          mb="sm"
          placeholder="IconShirt"
          value={form.icon}
          onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
        />
        <NumberInput
          label="Orden"
          mb="sm"
          min={0}
          value={form.sortOrder}
          onChange={(v) => setForm((f) => ({ ...f, sortOrder: Number(v) || 0 }))}
        />
        <Switch
          label="Activa"
          mb="md"
          checked={form.active}
          onChange={(e) => setForm((f) => ({ ...f, active: e.currentTarget.checked }))}
        />
        <Group justify="flex-end">
          <Button variant="outline" onClick={closeModal}>Cancelar</Button>
          <Button color="mcvRed" loading={saving} onClick={handleSave}>
            {editingId ? "Guardar" : "Crear"}
          </Button>
        </Group>
      </Modal>

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
