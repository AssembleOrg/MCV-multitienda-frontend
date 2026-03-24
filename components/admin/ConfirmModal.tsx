"use client";

import { Modal, Text, Group, Button } from "@mantine/core";

interface ConfirmModalProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  loading?: boolean;
}

export function ConfirmModal({
  opened,
  onClose,
  onConfirm,
  title = "¿Confirmar eliminación?",
  message = "Esta acción no se puede deshacer.",
  loading = false,
}: ConfirmModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<Text fw={600} size="sm">{title}</Text>}
      size="sm"
      centered
      styles={{
        header: { borderBottom: "1px solid #F0F0F0", paddingBottom: 12 },
        body: { paddingTop: 16 },
      }}
    >
      <Text size="sm" c="dimmed" mb="lg">{message}</Text>
      <Group justify="flex-end" gap="sm">
        <Button variant="subtle" color="gray" size="sm" onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button color="red" size="sm" loading={loading} onClick={onConfirm}>
          Eliminar
        </Button>
      </Group>
    </Modal>
  );
}
