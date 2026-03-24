"use client";

import { useEffect, useState } from "react";
import { Container, Title, SimpleGrid } from "@mantine/core";
import { api, type ProductResponse } from "@/lib/api-client";
import ProductCard from "@/components/products/ProductCard";
import { ProductCardSkeleton } from "@/components/ui/skeletons";
import { motion } from "framer-motion";

export default function FeaturedProducts() {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getProducts({ featured: "true", limit: "8" })
      .then((res) => setProducts(res.items))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="bg-white py-12">
      <Container size="xl">
        {/* Título con líneas animadas */}
        <div className="mb-10 flex items-center gap-4">
          <motion.div
            className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-[#C41E3A]/30 to-[#C41E3A]/50"
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Title
              order={2}
              className="px-4 text-xl font-bold tracking-wider text-gray-800"
            >
              <motion.span
                animate={{
                  textShadow: [
                    "0 0 0px transparent",
                    "0 0 15px rgba(196,30,58,0.4)",
                    "0 0 0px transparent",
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                DESTACADOS
              </motion.span>
            </Title>
          </motion.div>
          <motion.div
            className="h-[2px] flex-1 bg-gradient-to-l from-transparent via-[#C41E3A]/30 to-[#C41E3A]/50"
            initial={{ scaleX: 0, originX: 1 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
        </div>

        {loading ? (
          <SimpleGrid cols={{ base: 2, sm: 2, md: 3, lg: 4 }} spacing={{ base: "sm", md: "lg" }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </SimpleGrid>
        ) : (
          <SimpleGrid
            cols={{ base: 2, sm: 2, md: 3, lg: 4 }}
            spacing={{ base: "sm", md: "lg" }}
          >
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100,
                }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </SimpleGrid>
        )}
      </Container>
    </section>
  );
}
