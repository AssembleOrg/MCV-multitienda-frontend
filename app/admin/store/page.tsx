"use client";

import { useState, useEffect } from "react";
import {
  Title,
  TextInput,
  Textarea,
  Button,
  Paper,
  SimpleGrid,
  Group,
  Loader,
  Center,
  FileButton,
  Image,
} from "@mantine/core";
import { IconUpload } from "@tabler/icons-react";
import { adminApi, type StoreResponse } from "@/lib/api-client";
import { notifications } from "@mantine/notifications";

export default function AdminStorePage() {
  const [store, setStore] = useState<StoreResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    phone: "",
    email: "",
    address: "",
    instagram: "",
    facebook: "",
    whatsapp: "",
    tiktok: "",
    logo: "",
    metaTitle: "",
    metaDesc: "",
  });

  useEffect(() => {
    adminApi
      .getStore()
      .then((s) => {
        setStore(s);
        if (s) {
          setForm({
            name: s.name || "",
            description: s.description || "",
            phone: s.phone || "",
            email: s.email || "",
            address: s.address || "",
            instagram: s.instagram || "",
            facebook: s.facebook || "",
            whatsapp: s.whatsapp || "",
            tiktok: s.tiktok || "",
            logo: s.logo || "",
            metaTitle: "",
            metaDesc: "",
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleUploadLogo = async (file: File | null) => {
    if (!file) return;
    setUploading(true);
    try {
      const result = await adminApi.uploadFile(file, "store");
      setForm((f) => ({ ...f, logo: result.url }));
    } catch {
      notifications.show({ title: "Error", message: "Error al subir logo", color: "red" });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await adminApi.updateStore(form);
      setStore(updated);
      notifications.show({ title: "Guardado", message: "Configuración actualizada", color: "green" });
    } catch (err) {
      notifications.show({ title: "Error", message: err instanceof Error ? err.message : "Error", color: "red" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Center py={100}><Loader color="#C41E3A" /></Center>;

  return (
    <div>
      <Title order={2} mb="lg">Configuración de Tienda</Title>

      <Paper p="lg" withBorder>
        <Group mb="md" align="end">
          {form.logo && <Image src={form.logo} w={80} h={80} radius="sm" fit="contain" />}
          <FileButton onChange={handleUploadLogo} accept="image/*">
            {(props) => (
              <Button variant="outline" {...props} loading={uploading} leftSection={<IconUpload size={14} />}>
                {form.logo ? "Cambiar Logo" : "Subir Logo"}
              </Button>
            )}
          </FileButton>
        </Group>

        <SimpleGrid cols={{ base: 1, md: 2 }} mb="md">
          <TextInput label="Nombre de la Tienda" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.currentTarget.value }))} />
          <TextInput label="Email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.currentTarget.value }))} />
        </SimpleGrid>

        <Textarea label="Descripción" mb="md" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.currentTarget.value }))} />

        <SimpleGrid cols={{ base: 1, md: 2 }} mb="md">
          <TextInput label="Teléfono" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.currentTarget.value }))} />
          <TextInput label="Dirección" value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.currentTarget.value }))} />
        </SimpleGrid>

        <Title order={4} mt="lg" mb="sm">Redes Sociales</Title>
        <SimpleGrid cols={{ base: 1, md: 2 }} mb="md">
          <TextInput label="Instagram" placeholder="https://instagram.com/..." value={form.instagram} onChange={(e) => setForm((f) => ({ ...f, instagram: e.currentTarget.value }))} />
          <TextInput label="Facebook" placeholder="https://facebook.com/..." value={form.facebook} onChange={(e) => setForm((f) => ({ ...f, facebook: e.currentTarget.value }))} />
          <TextInput label="WhatsApp" placeholder="https://wa.me/..." value={form.whatsapp} onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.currentTarget.value }))} />
          <TextInput label="TikTok" placeholder="https://tiktok.com/@..." value={form.tiktok} onChange={(e) => setForm((f) => ({ ...f, tiktok: e.currentTarget.value }))} />
        </SimpleGrid>

        <Group mt="xl" justify="flex-end">
          <Button color="mcvRed" loading={saving} onClick={handleSave}>Guardar Configuración</Button>
        </Group>
      </Paper>
    </div>
  );
}
