"use client";

import { useState, useEffect, use } from "react";
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
  Loader,
  Center,
} from "@mantine/core";
import { adminApi, type CampaignResponse } from "@/lib/api-client";
import { notifications } from "@mantine/notifications";

export default function EditCampaignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [campaign, setCampaign] = useState<CampaignResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
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

  useEffect(() => {
    adminApi
      .getCampaign(id)
      .then((c) => {
        setCampaign(c);
        setForm({
          name: c.name,
          code: c.code,
          description: c.description || "",
          type: c.type,
          value: c.value,
          minPurchase: c.minPurchase || 0,
          maxDiscount: c.maxDiscount || 0,
          maxUses: c.maxUses || 0,
          maxUsesPerUser: c.maxUsesPerUser || 0,
          startDate: new Date(c.startDate).toISOString().slice(0, 16),
          endDate: new Date(c.endDate).toISOString().slice(0, 16),
          active: c.active,
        });
      })
      .catch(() => router.push("/admin/campaigns"))
      .finally(() => setPageLoading(false));
  }, [id, router]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await adminApi.updateCampaign(id, {
        ...form,
        minPurchase: form.minPurchase || null,
        maxDiscount: form.maxDiscount || null,
        maxUses: form.maxUses || null,
        maxUsesPerUser: form.maxUsesPerUser || null,
      });
      notifications.show({ title: "Actualizada", message: "Campaña actualizada", color: "green" });
      router.push("/admin/campaigns");
    } catch (err) {
      notifications.show({ title: "Error", message: err instanceof Error ? err.message : "Error", color: "red" });
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) return <Center py={100}><Loader color="#C41E3A" /></Center>;
  if (!campaign) return null;

  return (
    <div>
      <Title order={2} mb="lg">Editar: {campaign.name}</Title>

      <Paper p="lg" withBorder>
        <SimpleGrid cols={{ base: 1, md: 2 }} mb="md">
          <TextInput label="Nombre" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          <TextInput label="Código" required value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))} />
        </SimpleGrid>

        <Textarea label="Descripción" mb="md" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />

        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} mb="md">
          <Select
            label="Tipo"
            required
            data={[{ value: "percentage", label: "Porcentaje (%)" }, { value: "fixed", label: "Monto Fijo ($)" }]}
            value={form.type}
            onChange={(v) => setForm((f) => ({ ...f, type: v || "percentage" }))}
          />
          <NumberInput label={form.type === "percentage" ? "Porcentaje" : "Monto"} required min={0} value={form.value} onChange={(v) => setForm((f) => ({ ...f, value: Number(v) || 0 }))} />
          <NumberInput label="Compra Mínima" min={0} value={form.minPurchase} onChange={(v) => setForm((f) => ({ ...f, minPurchase: Number(v) || 0 }))} />
        </SimpleGrid>

        <SimpleGrid cols={{ base: 1, sm: 3 }} mb="md">
          <NumberInput label="Descuento Máximo" min={0} value={form.maxDiscount} onChange={(v) => setForm((f) => ({ ...f, maxDiscount: Number(v) || 0 }))} />
          <NumberInput label="Usos Máximos" min={0} value={form.maxUses} onChange={(v) => setForm((f) => ({ ...f, maxUses: Number(v) || 0 }))} />
          <NumberInput label="Usos por Usuario" min={0} value={form.maxUsesPerUser} onChange={(v) => setForm((f) => ({ ...f, maxUsesPerUser: Number(v) || 0 }))} />
        </SimpleGrid>

        <SimpleGrid cols={{ base: 1, sm: 3 }} mb="md">
          <TextInput label="Fecha Inicio" type="datetime-local" required value={form.startDate} onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))} />
          <TextInput label="Fecha Fin" type="datetime-local" required value={form.endDate} onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))} />
          <Switch label="Activa" mt={28} checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.currentTarget.checked }))} />
        </SimpleGrid>

        <Group mt="xl" justify="flex-end">
          <Button variant="outline" onClick={() => router.push("/admin/campaigns")}>Cancelar</Button>
          <Button color="mcvRed" loading={loading} onClick={handleSubmit}>Guardar Cambios</Button>
        </Group>
      </Paper>
    </div>
  );
}
