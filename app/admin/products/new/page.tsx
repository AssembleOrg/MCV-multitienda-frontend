"use client";

import { useState, useEffect } from "react";
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
  Text,
  ActionIcon,
} from "@mantine/core";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { adminApi, type CategoryResponse } from "@/lib/api-client";
import { notifications } from "@mantine/notifications";
import { slugify } from "@/lib/utils";
import SortableImageGrid, {
  type ImageItem,
} from "@/components/admin/SortableImageGrid";

interface VariantForm {
  name: string;
  type: string;
  value: string;
  stock: number;
}

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [variants, setVariants] = useState<VariantForm[]>([]);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    price: 0,
    originalPrice: 0,
    stock: 0,
    sku: "",
    featured: false,
    active: true,
    categoryId: "",
  });

  useEffect(() => {
    adminApi.getCategories().then(setCategories).catch(() => {});
  }, []);

  const handleNameChange = (name: string) => {
    setForm((f) => ({ ...f, name, slug: slugify(name) }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await adminApi.createProduct({
        ...form,
        originalPrice: form.originalPrice || undefined,
        variants: variants.length > 0 ? variants : undefined,
        images:
          images.length > 0
            ? images.map((img) => ({
                url: img.url,
                alt: img.alt || null,
                variantId: img.variantId || null,
              }))
            : undefined,
      });
      notifications.show({
        title: "Creado",
        message: "Producto creado exitosamente",
        color: "green",
      });
      router.push("/admin/products");
    } catch (err) {
      notifications.show({
        title: "Error",
        message:
          err instanceof Error ? err.message : "Error al crear producto",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Title order={2} mb="lg">
        Nuevo Producto
      </Title>

      <Paper p="lg" withBorder>
        <SimpleGrid cols={{ base: 1, md: 2 }} mb="md">
          <TextInput
            label="Nombre"
            required
            value={form.name}
            onChange={(e) => handleNameChange(e.target.value)}
          />
          <TextInput
            label="Slug"
            required
            value={form.slug}
            onChange={(e) =>
              setForm((f) => ({ ...f, slug: e.target.value }))
            }
          />
        </SimpleGrid>

        <Textarea
          label="Descripción"
          required
          mb="md"
          minRows={3}
          value={form.description}
          onChange={(e) =>
            setForm((f) => ({ ...f, description: e.target.value }))
          }
        />

        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} mb="md">
          <NumberInput
            label="Precio"
            required
            min={0}
            value={form.price}
            onChange={(v) =>
              setForm((f) => ({ ...f, price: Number(v) || 0 }))
            }
          />
          <NumberInput
            label="Precio Original"
            min={0}
            value={form.originalPrice}
            onChange={(v) =>
              setForm((f) => ({ ...f, originalPrice: Number(v) || 0 }))
            }
          />
          <NumberInput
            label="Stock"
            min={0}
            value={form.stock}
            onChange={(v) =>
              setForm((f) => ({ ...f, stock: Number(v) || 0 }))
            }
          />
          <TextInput
            label="SKU"
            required
            value={form.sku}
            onChange={(e) =>
              setForm((f) => ({ ...f, sku: e.target.value }))
            }
          />
        </SimpleGrid>

        <SimpleGrid cols={{ base: 1, sm: 3 }} mb="md">
          <Select
            label="Categoría"
            required
            data={categories.map((c) => ({ value: c.id, label: c.name }))}
            value={form.categoryId}
            onChange={(v) => setForm((f) => ({ ...f, categoryId: v || "" }))}
          />
          <Switch
            label="Destacado"
            mt={28}
            checked={form.featured}
            onChange={(e) =>
              setForm((f) => ({ ...f, featured: e.currentTarget.checked }))
            }
          />
          <Switch
            label="Activo"
            mt={28}
            checked={form.active}
            onChange={(e) =>
              setForm((f) => ({ ...f, active: e.currentTarget.checked }))
            }
          />
        </SimpleGrid>

        {/* Variants */}
        <Group justify="space-between" mb="xs">
          <Text fw={500}>Variantes</Text>
          <Button
            variant="light"
            size="xs"
            leftSection={<IconPlus size={14} />}
            onClick={() =>
              setVariants((v) => [
                ...v,
                { name: "", type: "size", value: "", stock: 0 },
              ])
            }
          >
            Agregar variante
          </Button>
        </Group>
        {variants.map((variant, i) => (
          <Group key={i} mb="xs" align="end">
            <TextInput
              label="Nombre"
              size="xs"
              w={100}
              value={variant.name}
              onChange={(e) => {
                const copy = [...variants];
                copy[i].name = e.target.value;
                setVariants(copy);
              }}
            />
            <Select
              label="Tipo"
              size="xs"
              w={100}
              data={[
                { value: "size", label: "Talle" },
                { value: "color", label: "Color" },
                { value: "storage", label: "Storage" },
              ]}
              value={variant.type}
              onChange={(v) => {
                const copy = [...variants];
                copy[i].type = v || "size";
                setVariants(copy);
              }}
            />
            <TextInput
              label="Valor"
              size="xs"
              w={80}
              value={variant.value}
              onChange={(e) => {
                const copy = [...variants];
                copy[i].value = e.target.value;
                setVariants(copy);
              }}
            />
            <NumberInput
              label="Stock"
              size="xs"
              w={80}
              min={0}
              value={variant.stock}
              onChange={(v) => {
                const copy = [...variants];
                copy[i].stock = Number(v) || 0;
                setVariants(copy);
              }}
            />
            <ActionIcon
              color="red"
              variant="subtle"
              mb={2}
              onClick={() =>
                setVariants((v) => v.filter((_, idx) => idx !== i))
              }
            >
              <IconTrash size={16} />
            </ActionIcon>
          </Group>
        ))}

        {/* Images with drag & drop */}
        <div className="mt-4">
          <SortableImageGrid
            images={images}
            onChange={setImages}
            variants={variants.map((v, i) => ({
              id: `temp-${i}`,
              ...v,
            }))}
          />
        </div>

        <Group mt="xl" justify="flex-end">
          <Button
            variant="outline"
            onClick={() => router.push("/admin/products")}
          >
            Cancelar
          </Button>
          <Button color="mcvRed" loading={loading} onClick={handleSubmit}>
            Crear Producto
          </Button>
        </Group>
      </Paper>
    </div>
  );
}
