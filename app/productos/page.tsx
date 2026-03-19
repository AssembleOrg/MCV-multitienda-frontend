"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Container,
  Title,
  SimpleGrid,
  Select,
  TextInput,
  Group,
  Pagination,
  Center,
  Loader,
  Text,
  RangeSlider,
  Badge,
  ActionIcon,
} from "@mantine/core";
import { IconSearch, IconX } from "@tabler/icons-react";
import { api, type ProductResponse, type CategoryResponse } from "@/lib/api-client";
import ProductCard from "@/components/products/ProductCard";
import { motion } from "framer-motion";

export default function ProductsPage() {
  return (
    <Suspense>
      <ProductsContent />
    </Suspense>
  );
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("categoria") || "");
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);

  useEffect(() => {
    api.getCategories().then(setCategories).catch(() => {});
  }, []);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {
        page: String(page),
        limit: "12",
        sortBy,
      };
      if (search) params.search = search;
      if (category) params.category = category;
      if (priceRange[0] > 0) params.minPrice = String(priceRange[0]);
      if (priceRange[1] < 1000000) params.maxPrice = String(priceRange[1]);

      const result = await api.getProducts(params);
      setProducts(result.items);
      setTotal(result.total);
      setTotalPages(result.totalPages);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, category, sortBy, priceRange]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Sync URL params on mount
  useEffect(() => {
    const cat = searchParams.get("categoria");
    const q = searchParams.get("search");
    if (cat) setCategory(cat);
    if (q) setSearch(q);
  }, [searchParams]);

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setSortBy("newest");
    setPriceRange([0, 1000000]);
    setPage(1);
    router.push("/productos");
  };

  const hasFilters = search || category || sortBy !== "newest" || priceRange[0] > 0 || priceRange[1] < 1000000;

  return (
    <section className="bg-gray-50 py-8">
      <Container size="xl">
        <Title order={1} className="mb-6 text-2xl font-bold text-gray-800">
          Catálogo
        </Title>

        {/* Filters */}
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <Group gap="md" grow wrap="wrap">
            <TextInput
              placeholder="Buscar productos..."
              leftSection={<IconSearch size={16} />}
              value={search}
              onChange={(e) => {
                setSearch(e.currentTarget.value);
                setPage(1);
              }}
            />
            <Select
              placeholder="Categoría"
              clearable
              data={categories.map((c) => ({ value: c.slug, label: c.name }))}
              value={category}
              onChange={(v) => {
                setCategory(v || "");
                setPage(1);
              }}
            />
            <Select
              placeholder="Ordenar por"
              data={[
                { value: "newest", label: "Más recientes" },
                { value: "price-asc", label: "Menor precio" },
                { value: "price-desc", label: "Mayor precio" },
                { value: "name", label: "Nombre A-Z" },
              ]}
              value={sortBy}
              onChange={(v) => {
                setSortBy(v || "newest");
                setPage(1);
              }}
            />
          </Group>

          {hasFilters && (
            <Group mt="sm" justify="space-between">
              <Text size="sm" c="dimmed">
                {total} producto{total !== 1 ? "s" : ""} encontrado{total !== 1 ? "s" : ""}
              </Text>
              <Badge
                variant="light"
                color="red"
                rightSection={
                  <ActionIcon size="xs" variant="transparent" color="red" onClick={clearFilters}>
                    <IconX size={12} />
                  </ActionIcon>
                }
                style={{ cursor: "pointer" }}
                onClick={clearFilters}
              >
                Limpiar filtros
              </Badge>
            </Group>
          )}
        </div>

        {/* Products Grid */}
        {loading ? (
          <Center py={80}>
            <Loader color="#C41E3A" />
          </Center>
        ) : products.length === 0 ? (
          <Center py={80}>
            <div className="text-center">
              <Text size="lg" fw={500} c="dimmed">
                No se encontraron productos
              </Text>
              <Text size="sm" c="dimmed" mt="xs">
                Probá con otros filtros o términos de búsqueda
              </Text>
            </div>
          </Center>
        ) : (
          <>
            <SimpleGrid cols={{ base: 2, sm: 2, md: 3, lg: 4 }} spacing={{ base: "sm", md: "lg" }}>
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </SimpleGrid>

            {totalPages > 1 && (
              <Center mt="xl">
                <Pagination
                  total={totalPages}
                  value={page}
                  onChange={setPage}
                  color="mcvRed"
                />
              </Center>
            )}
          </>
        )}
      </Container>
    </section>
  );
}
