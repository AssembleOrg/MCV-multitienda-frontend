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
import { adminApi, type PromoResponse } from "@/lib/api-client";
import { notifications } from "@mantine/notifications";

export default function AdminPromosPage() {
  const [promos, setPromos] = useState<PromoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ text: "", link: "", sortOrder: 0, active: true });

  const loadPromos = useCallback(async () => {
    setLoading(true);
    try {
      setPromos(await adminApi.getPromos());
    } catch {
      notifications.show({ title: "Error", message: "Error al cargar promos", color: "red" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPromos();
  }, [loadPromos]);

  const handleNew = () => {
    setEditingId(null);
    setForm({ text: "", link: "", sortOrder: 0, active: true });
    openModal();
  };

  const handleEdit = (promo: PromoResponse) => {
    setEditingId(promo.id);
    setForm({ text: promo.text, link: promo.link || "", sortOrder: promo.sortOrder, active: promo.active });
    openModal();
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingId) {
        await adminApi.updatePromo(editingId, form);
      } else {
        await adminApi.createPromo(form);
      }
      closeModal();
      loadPromos();
      notifications.show({ title: "Guardado", message: "Promo guardada", color: "green" });
    } catch (err) {
      notifications.show({ title: "Error", message: err instanceof Error ? err.message : "Error", color: "red" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar esta promo?")) return;
    try {
      await adminApi.deletePromo(id);
      loadPromos();
      notifications.show({ title: "Eliminada", message: "Promo eliminada", color: "green" });
    } catch (err) {
      notifications.show({ title: "Error", message: err instanceof Error ? err.message : "Error", color: "red" });
    }
  };

  return (
    <div>
      <Group justify="space-between" mb="lg">
        <Title order={2}>Promos (Banner Slider)</Title>
        <Button leftSection={<IconPlus size={16} />} color="mcvRed" onClick={handleNew}>Nueva Promo</Button>
      </Group>

      {loading ? (
        <Center py={50}><Loader color="#C41E3A" /></Center>
      ) : (
        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Texto</Table.Th>
              <Table.Th>Link</Table.Th>
              <Table.Th>Orden</Table.Th>
              <Table.Th>Estado</Table.Th>
              <Table.Th>Acciones</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {promos.map((promo) => (
              <Table.Tr key={promo.id}>
                <Table.Td fw={500}>{promo.text}</Table.Td>
                <Table.Td>{promo.link || "-"}</Table.Td>
                <Table.Td>{promo.sortOrder}</Table.Td>
                <Table.Td>
                  <Badge color={promo.active ? "green" : "gray"} variant="light">
                    {promo.active ? "Activa" : "Inactiva"}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Group gap={4}>
                    <ActionIcon variant="light" color="gray" size="md" radius="md" style={{ border: "1px solid #E5E5E5" }} onClick={() => handleEdit(promo)}><IconEdit size={15} stroke={1.5} /></ActionIcon>
                    <ActionIcon variant="light" color="red" size="md" radius="md" style={{ border: "1px solid #fecaca" }} onClick={() => handleDelete(promo.id)}><IconTrash size={15} stroke={1.5} /></ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}

      <Modal opened={modalOpened} onClose={closeModal} title={editingId ? "Editar Promo" : "Nueva Promo"}>
        <TextInput label="Texto" required mb="sm" value={form.text} onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))} />
        <TextInput label="Link (opcional)" mb="sm" value={form.link} onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))} />
        <NumberInput label="Orden" mb="sm" min={0} value={form.sortOrder} onChange={(v) => setForm((f) => ({ ...f, sortOrder: Number(v) || 0 }))} />
        <Switch label="Activa" mb="md" checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.currentTarget.checked }))} />
        <Group justify="flex-end">
          <Button variant="outline" onClick={closeModal}>Cancelar</Button>
          <Button color="mcvRed" loading={saving} onClick={handleSave}>{editingId ? "Guardar" : "Crear"}</Button>
        </Group>
      </Modal>
    </div>
  );
}
