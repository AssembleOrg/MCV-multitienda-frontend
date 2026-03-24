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
  Text,
  ActionIcon,
  Loader,
  Center,
} from "@mantine/core";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import {
  adminApi,
  type CategoryResponse,
  type ProductResponse,
} from "@/lib/api-client";
import { notifications } from "@mantine/notifications";
import SortableImageGrid, {
  type ImageItem,
} from "@/components/admin/SortableImageGrid";

interface VariantForm {
  id?: string;
  name: string;
  type: string;
  value: string;
  stock: number;
}

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
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
    Promise.all([adminApi.getProduct(id), adminApi.getCategories()])
      .then(([prod, cats]) => {
        setProduct(prod);
        setCategories(cats);
        setForm({
          name: prod.name,
          slug: prod.slug,
          description: prod.description,
          price: prod.price,
          originalPrice: prod.originalPrice || 0,
          stock: prod.stock,
          sku: prod.sku,
          featured: prod.featured,
          active: prod.active,
          categoryId: prod.categoryId,
        });
        setImages(
          prod.images.map((img) => ({
            id: img.id,
            url: img.url,
            alt: img.alt || "",
            variantId: img.variantId || null,
          })),
        );
        setVariants(
          prod.variants.map((v) => ({
            id: v.id,
            name: v.name,
            type: v.type,
            value: v.value,
            stock: v.stock,
          })),
        );
      })
      .catch(() => {
        notifications.show({
          title: "Error",
          message: "Producto no encontrado",
          color: "red",
        });
        router.push("/admin/products");
      })
      .finally(() => setPageLoading(false));
  }, [id, router]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await adminApi.updateProduct(id, {
        ...form,
        originalPrice: form.originalPrice || null,
        variants:
          variants.length > 0
            ? variants.map((v) => ({
                name: v.name,
                type: v.type,
                value: v.value,
                stock: v.stock,
              }))
            : undefined,
        images: images.map((img) => ({
          url: img.url,
          alt: img.alt || null,
          variantId: img.variantId || null,
        })),
      });
      notifications.show({
        title: "Actualizado",
        message: "Producto actualizado exitosamente",
        color: "green",
      });
      router.push("/admin/products");
    } catch (err) {
      notifications.show({
        title: "Error",
        message:
          err instanceof Error ? err.message : "Error al actualizar",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <Center py={100}>
        <Loader color="#C41E3A" />
      </Center>
    );
  }

  if (!product) return null;

  return (
    <div>
      <Title order={2} mb="lg">
        Editar: {product.name}
      </Title>

      <Paper p="lg" withBorder>
        <SimpleGrid cols={{ base: 1, md: 2 }} mb="md">
          <TextInput
            label="Nombre"
            required
            value={form.name}
            onChange={(e) =>
              setForm((f) => ({ ...f, name: e.target.value }))
            }
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
              id: v.id || `temp-${i}`,
              name: v.name,
              type: v.type,
              value: v.value,
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
            Guardar Cambios
          </Button>
        </Group>
      </Paper>
    </div>
  );
}
