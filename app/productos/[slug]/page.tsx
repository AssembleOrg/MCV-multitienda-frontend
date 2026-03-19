"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Badge,
  NumberInput,
  SimpleGrid,
  Loader,
  Center,
  Breadcrumbs,
  Anchor,
} from "@mantine/core";
import { IconShoppingCart, IconArrowLeft } from "@tabler/icons-react";
import { api, type ProductResponse } from "@/lib/api-client";
import { useCartStore } from "@/lib/store";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import { notifications } from "@mantine/notifications";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<
    Record<string, { id: string; name: string; type: string; value: string }>
  >({});
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    api
      .getProduct(slug)
      .then((p) => setProduct(p))
      .catch(() => router.push("/productos"))
      .finally(() => setLoading(false));
  }, [slug, router]);

  if (loading) {
    return (
      <Center py={100}>
        <Loader color="#C41E3A" />
      </Center>
    );
  }

  if (!product) return null;

  const discount = product.originalPrice
    ? calculateDiscount(product.originalPrice, product.price)
    : 0;

  // Group variants by type
  const variantGroups: Record<
    string,
    { id: string; name: string; type: string; value: string; stock: number }[]
  > = {};
  product.variants.forEach((v) => {
    if (!variantGroups[v.type]) variantGroups[v.type] = [];
    variantGroups[v.type].push({
      id: v.id,
      name: v.name,
      type: v.type,
      value: v.value,
      stock: v.stock,
    });
  });

  // Filter images by selected color variant
  const selectedColorVariant = selectedVariants["color"];
  const displayImages =
    selectedColorVariant && product.images.some((img) => img.variantId === selectedColorVariant.id)
      ? product.images.filter(
          (img) => img.variantId === selectedColorVariant.id || !img.variantId,
        )
      : product.images;

  const typeLabels: Record<string, string> = {
    size: "Talle",
    color: "Color",
    storage: "Almacenamiento",
  };

  const handleAddToCart = () => {
    const mainImage = displayImages[0]?.url || null;
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: mainImage,
      quantity,
      selectedVariants: Object.values(selectedVariants),
    });
    notifications.show({
      title: "Agregado al carrito",
      message: `${product.name} x${quantity}`,
      color: "green",
    });
  };

  return (
    <section className="bg-white py-8">
      <Container size="xl">
        <Breadcrumbs mb="lg" separator="›">
          <Anchor component={Link} href="/" size="sm" c="dimmed">
            Inicio
          </Anchor>
          <Anchor component={Link} href="/productos" size="sm" c="dimmed">
            Catálogo
          </Anchor>
          <Text size="sm" c="dark">
            {product.name}
          </Text>
        </Breadcrumbs>

        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
          {/* Gallery */}
          <div>
            <div className="relative mb-3 aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
              <AnimatePresence mode="wait">
                {displayImages.length > 0 ? (
                  <motion.div
                    key={displayImages[selectedImageIndex]?.id || selectedImageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="relative h-full w-full"
                  >
                    <Image
                      src={displayImages[selectedImageIndex]?.url || ""}
                      alt={displayImages[selectedImageIndex]?.alt || product.name}
                      fill
                      className="object-contain p-4"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />
                  </motion.div>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Text size="xl" c="dimmed" fw={200} className="text-8xl">
                      {product.name.charAt(0)}
                    </Text>
                  </div>
                )}
              </AnimatePresence>

              {discount > 0 && (
                <Badge
                  color="red"
                  size="lg"
                  className="absolute top-3 left-3"
                >
                  -{discount}%
                </Badge>
              )}
            </div>

            {/* Thumbnails */}
            {displayImages.length > 1 && (
              <Group gap="xs">
                {displayImages.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImageIndex(i)}
                    className={`relative h-16 w-16 overflow-hidden rounded-md border-2 transition-all ${
                      i === selectedImageIndex
                        ? "border-[#C41E3A] shadow-md"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={img.alt || ""}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </button>
                ))}
              </Group>
            )}
          </div>

          {/* Product Info */}
          <div>
            <Badge variant="light" color="gray" mb="xs">
              {product.category.name}
            </Badge>

            <Title order={1} className="mb-2 text-2xl font-bold text-gray-900">
              {product.name}
            </Title>

            <Text c="dimmed" mb="md" className="text-sm leading-relaxed">
              {product.description}
            </Text>

            {/* Price */}
            <div className="mb-6">
              <Group gap="sm" align="baseline">
                <Text className="text-3xl font-bold text-[#C41E3A]">
                  {formatPrice(product.price)}
                </Text>
                {product.originalPrice && (
                  <Text size="lg" c="dimmed" td="line-through">
                    {formatPrice(product.originalPrice)}
                  </Text>
                )}
              </Group>
              <Text size="xs" c="dimmed" mt={2}>
                SKU: {product.sku}
              </Text>
            </div>

            {/* Variants */}
            {Object.entries(variantGroups).map(([type, variants]) => (
              <div key={type} className="mb-4">
                <Text fw={500} size="sm" mb="xs">
                  {typeLabels[type] || type}
                </Text>
                <Group gap="xs">
                  {variants.map((v) => {
                    const isSelected = selectedVariants[type]?.id === v.id;
                    const outOfStock = v.stock <= 0;
                    return (
                      <Button
                        key={v.id}
                        size="xs"
                        variant={isSelected ? "filled" : "outline"}
                        color={isSelected ? "mcvRed" : "gray"}
                        disabled={outOfStock}
                        onClick={() =>
                          setSelectedVariants((prev) => ({
                            ...prev,
                            [type]: { id: v.id, name: v.name, type: v.type, value: v.value },
                          }))
                        }
                      >
                        {v.value}
                        {outOfStock && " (agotado)"}
                      </Button>
                    );
                  })}
                </Group>
              </div>
            ))}

            {/* Stock */}
            <div className="mb-4">
              {product.stock > 0 ? (
                <Badge color="green" variant="light" size="sm">
                  {product.stock} en stock
                </Badge>
              ) : (
                <Badge color="red" variant="light" size="sm">
                  Sin stock
                </Badge>
              )}
            </div>

            {/* Quantity + Add to Cart */}
            <Group gap="md" mt="lg">
              <NumberInput
                value={quantity}
                onChange={(v) => setQuantity(Number(v) || 1)}
                min={1}
                max={product.stock}
                w={100}
              />
              <Button
                color="mcvRed"
                size="md"
                leftSection={<IconShoppingCart size={18} />}
                disabled={product.stock <= 0}
                onClick={handleAddToCart}
                className="flex-1"
              >
                Agregar al carrito
              </Button>
            </Group>
          </div>
        </SimpleGrid>
      </Container>
    </section>
  );
}
