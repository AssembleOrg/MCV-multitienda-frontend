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
  Loader,
  Center,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus, IconEdit, IconTrash } from "@tabler/icons-react";
import { adminApi, type CategoryResponse } from "@/lib/api-client";
import { notifications } from "@mantine/notifications";
import { slugify } from "@/lib/utils";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);
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

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Eliminar "${name}"?`)) return;
    try {
      await adminApi.deleteCategory(id);
      notifications.show({ title: "Eliminada", message: `${name} fue eliminada`, color: "green" });
      loadCategories();
    } catch (err) {
      notifications.show({ title: "Error", message: err instanceof Error ? err.message : "Error", color: "red" });
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
        <Center py={50}><Loader color="#C41E3A" /></Center>
      ) : (
        <Table striped highlightOnHover withTableBorder>
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
                    <ActionIcon variant="subtle" color="blue" onClick={() => handleEdit(cat)}>
                      <IconEdit size={16} />
                    </ActionIcon>
                    <ActionIcon variant="subtle" color="red" onClick={() => handleDelete(cat.id, cat.name)}>
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}

      <Modal opened={modalOpened} onClose={closeModal} title={editingId ? "Editar Categoría" : "Nueva Categoría"}>
        <TextInput
          label="Nombre"
          required
          mb="sm"
          value={form.name}
          onChange={(e) => {
            const name = e.currentTarget.value;
            setForm((f) => ({ ...f, name, ...(editingId ? {} : { slug: slugify(name) }) }));
          }}
        />
        <TextInput
          label="Slug"
          required
          mb="sm"
          value={form.slug}
          onChange={(e) => setForm((f) => ({ ...f, slug: e.currentTarget.value }))}
        />
        <TextInput
          label="Descripción"
          mb="sm"
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.currentTarget.value }))}
        />
        <TextInput
          label="Icono"
          mb="sm"
          placeholder="IconShirt"
          value={form.icon}
          onChange={(e) => setForm((f) => ({ ...f, icon: e.currentTarget.value }))}
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
    </div>
  );
}
