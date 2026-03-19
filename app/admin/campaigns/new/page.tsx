"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Title,
  TextInput,
  Textarea,
  NumberInput,
  Switch,
  Button,
  Select,
  SimpleGrid,
  Paper,
  Group,
} from "@mantine/core";
import { adminApi } from "@/lib/api-client";
import { notifications } from "@mantine/notifications";

export default function NewCampaignPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    code: "",
    description: "",
    type: "percentage",
    value: 0,
    minPurchase: 0,
    maxDiscount: 0,
    maxUses: 0,
    maxUsesPerUser: 0,
    startDate: "",
    endDate: "",
    active: true,
  });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await adminApi.createCampaign({
        ...form,
        minPurchase: form.minPurchase || null,
        maxDiscount: form.maxDiscount || null,
        maxUses: form.maxUses || null,
        maxUsesPerUser: form.maxUsesPerUser || null,
      });
      notifications.show({ title: "Creada", message: "Campaña creada exitosamente", color: "green" });
      router.push("/admin/campaigns");
    } catch (err) {
      notifications.show({
        title: "Error",
        message: err instanceof Error ? err.message : "Error al crear campaña",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Title order={2} mb="lg">Nueva Campaña</Title>

      <Paper p="lg" withBorder>
        <SimpleGrid cols={{ base: 1, md: 2 }} mb="md">
          <TextInput
            label="Nombre"
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.currentTarget.value }))}
          />
          <TextInput
            label="Código"
            required
            placeholder="DESCUENTO10"
            value={form.code}
            onChange={(e) => setForm((f) => ({ ...f, code: e.currentTarget.value.toUpperCase() }))}
          />
        </SimpleGrid>

        <Textarea
          label="Descripción"
          mb="md"
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.currentTarget.value }))}
        />

        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} mb="md">
          <Select
            label="Tipo"
            required
            data={[
              { value: "percentage", label: "Porcentaje (%)" },
              { value: "fixed", label: "Monto Fijo ($)" },
            ]}
            value={form.type}
            onChange={(v) => setForm((f) => ({ ...f, type: v || "percentage" }))}
          />
          <NumberInput
            label={form.type === "percentage" ? "Porcentaje" : "Monto"}
            required
            min={0}
            max={form.type === "percentage" ? 100 : undefined}
            value={form.value}
            onChange={(v) => setForm((f) => ({ ...f, value: Number(v) || 0 }))}
          />
          <NumberInput
            label="Compra Mínima"
            min={0}
            value={form.minPurchase}
            onChange={(v) => setForm((f) => ({ ...f, minPurchase: Number(v) || 0 }))}
          />
        </SimpleGrid>

        <SimpleGrid cols={{ base: 1, sm: 3 }} mb="md">
          <NumberInput
            label="Descuento Máximo"
            min={0}
            value={form.maxDiscount}
            onChange={(v) => setForm((f) => ({ ...f, maxDiscount: Number(v) || 0 }))}
          />
          <NumberInput
            label="Usos Máximos (total)"
            min={0}
            value={form.maxUses}
            onChange={(v) => setForm((f) => ({ ...f, maxUses: Number(v) || 0 }))}
          />
          <NumberInput
            label="Usos por Usuario"
            min={0}
            value={form.maxUsesPerUser}
            onChange={(v) => setForm((f) => ({ ...f, maxUsesPerUser: Number(v) || 0 }))}
          />
        </SimpleGrid>

        <SimpleGrid cols={{ base: 1, sm: 3 }} mb="md">
          <TextInput
            label="Fecha Inicio"
            type="datetime-local"
            required
            value={form.startDate}
            onChange={(e) => setForm((f) => ({ ...f, startDate: e.currentTarget.value }))}
          />
          <TextInput
            label="Fecha Fin"
            type="datetime-local"
            required
            value={form.endDate}
            onChange={(e) => setForm((f) => ({ ...f, endDate: e.currentTarget.value }))}
          />
          <Switch
            label="Activa"
            mt={28}
            checked={form.active}
            onChange={(e) => setForm((f) => ({ ...f, active: e.currentTarget.checked }))}
          />
        </SimpleGrid>

        <Group mt="xl" justify="flex-end">
          <Button variant="outline" onClick={() => router.push("/admin/campaigns")}>Cancelar</Button>
          <Button color="mcvRed" loading={loading} onClick={handleSubmit}>Crear Campaña</Button>
        </Group>
      </Paper>
    </div>
  );
}
