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
  Select,
  Switch,
  Loader,
  Center,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus, IconEdit, IconTrash } from "@tabler/icons-react";
import { adminApi, type WhitelistResponse } from "@/lib/api-client";
import { notifications } from "@mantine/notifications";
import { formatDate } from "@/lib/utils";

export default function AdminWhitelistPage() {
  const [emails, setEmails] = useState<WhitelistResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpened, { open: openModal, close: closeModal }] =
    useDisclosure(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    email: "",
    role: "customer",
    note: "",
    active: true,
  });

  const loadEmails = useCallback(async () => {
    setLoading(true);
    try {
      setEmails(await adminApi.getWhitelist());
    } catch {
      notifications.show({
        title: "Error",
        message: "Error al cargar whitelist",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEmails();
  }, [loadEmails]);

  const handleNew = () => {
    setEditingId(null);
    setForm({ email: "", role: "customer", note: "", active: true });
    openModal();
  };

  const handleEdit = (entry: WhitelistResponse) => {
    setEditingId(entry.id);
    setForm({
      email: entry.email,
      role: entry.role,
      note: entry.note || "",
      active: entry.active,
    });
    openModal();
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingId) {
        await adminApi.updateWhitelist(editingId, form);
      } else {
        await adminApi.addWhitelist(form);
      }
      closeModal();
      loadEmails();
      notifications.show({
        title: "Guardado",
        message: editingId ? "Email actualizado" : "Email agregado",
        color: "green",
      });
    } catch (err) {
      notifications.show({
        title: "Error",
        message: err instanceof Error ? err.message : "Error",
        color: "red",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, email: string) => {
    if (!confirm(`¿Eliminar "${email}" de la whitelist?`)) return;
    try {
      await adminApi.deleteWhitelist(id);
      loadEmails();
      notifications.show({
        title: "Eliminado",
        message: `${email} eliminado`,
        color: "green",
      });
    } catch (err) {
      notifications.show({
        title: "Error",
        message: err instanceof Error ? err.message : "Error",
        color: "red",
      });
    }
  };

  return (
    <div>
      <Group justify="space-between" mb="lg">
        <Title order={2}>Emails Autorizados</Title>
        <Button
          leftSection={<IconPlus size={16} />}
          color="mcvRed"
          onClick={handleNew}
        >
          Agregar Email
        </Button>
      </Group>

      <Text size="sm" c="dimmed" mb="md">
        Solo los emails en esta lista pueden registrarse en la app.
      </Text>

      {loading ? (
        <Center py={50}>
          <Loader color="#C41E3A" />
        </Center>
      ) : (
        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Email</Table.Th>
              <Table.Th>Rol</Table.Th>
              <Table.Th>Nota</Table.Th>
              <Table.Th>Estado</Table.Th>
              <Table.Th>Fecha</Table.Th>
              <Table.Th>Acciones</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {emails.map((entry) => (
              <Table.Tr key={entry.id}>
                <Table.Td fw={500}>{entry.email}</Table.Td>
                <Table.Td>
                  <Badge
                    color={entry.role === "admin" ? "red" : "blue"}
                    variant="light"
                  >
                    {entry.role === "admin" ? "Admin" : "Cliente"}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" c="dimmed">
                    {entry.note || "-"}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Badge
                    color={entry.active ? "green" : "gray"}
                    variant="light"
                  >
                    {entry.active ? "Activo" : "Inactivo"}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Text size="xs">{formatDate(entry.createdAt)}</Text>
                </Table.Td>
                <Table.Td>
                  <Group gap={4}>
                    <ActionIcon
                      variant="light"
                      color="gray"
                      size="md"
                      radius="md"
                      style={{ border: "1px solid #E5E5E5" }}
                      onClick={() => handleEdit(entry)}
                    >
                      <IconEdit size={15} stroke={1.5} />
                    </ActionIcon>
                    <ActionIcon
                      variant="light"
                      color="red"
                      size="md"
                      radius="md"
                      style={{ border: "1px solid #fecaca" }}
                      onClick={() => handleDelete(entry.id, entry.email)}
                    >
                      <IconTrash size={15} stroke={1.5} />
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
            {emails.length === 0 && (
              <Table.Tr>
                <Table.Td colSpan={6}>
                  <Text ta="center" c="dimmed" py="md">
                    No hay emails en la whitelist
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      )}

      <Modal
        opened={modalOpened}
        onClose={closeModal}
        title={editingId ? "Editar Email" : "Agregar Email"}
      >
        <TextInput
          label="Email"
          required
          mb="sm"
          placeholder="usuario@email.com"
          value={form.email}
          onChange={(e) =>
            setForm((f) => ({ ...f, email: e.target.value }))
          }
          disabled={!!editingId}
        />
        <Select
          label="Rol"
          mb="sm"
          data={[
            { value: "customer", label: "Cliente" },
            { value: "admin", label: "Administrador" },
          ]}
          value={form.role}
          onChange={(v) => setForm((f) => ({ ...f, role: v || "customer" }))}
        />
        <TextInput
          label="Nota (opcional)"
          mb="sm"
          placeholder="Referencia o motivo"
          value={form.note}
          onChange={(e) =>
            setForm((f) => ({ ...f, note: e.target.value }))
          }
        />
        <Switch
          label="Activo"
          mb="md"
          checked={form.active}
          onChange={(e) =>
            setForm((f) => ({ ...f, active: e.currentTarget.checked }))
          }
        />
        <Group justify="flex-end">
          <Button variant="outline" onClick={closeModal}>
            Cancelar
          </Button>
          <Button color="mcvRed" loading={saving} onClick={handleSave}>
            {editingId ? "Guardar" : "Agregar"}
          </Button>
        </Group>
      </Modal>
    </div>
  );
}
