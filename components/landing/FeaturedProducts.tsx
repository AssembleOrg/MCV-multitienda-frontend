"use client";

import { Container, Title, SimpleGrid } from "@mantine/core";
import { getFeaturedProducts } from "@/lib/mock-data";
import ProductCard from "@/components/products/ProductCard";
import { motion } from "framer-motion";

export default function FeaturedProducts() {
  const featuredProducts = getFeaturedProducts().slice(0, 8);

  return (
    <section className="bg-white py-12">
      <Container size="xl">
        {/* Título con líneas animadas */}
        <div className="flex items-center gap-4 mb-10">
          <motion.div
            className="flex-1 h-[2px] bg-gradient-to-r from-transparent via-[#C41E3A]/30 to-[#C41E3A]/50"
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Title order={2} className="text-xl font-bold text-gray-800 px-4 tracking-wider">
              <motion.span
                animate={{
                  textShadow: [
                    "0 0 0px transparent",
                    "0 0 15px rgba(196,30,58,0.4)",
                    "0 0 0px transparent",
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                DESTACADOS
              </motion.span>
            </Title>
          </motion.div>
          <motion.div
            className="flex-1 h-[2px] bg-gradient-to-l from-transparent via-[#C41E3A]/30 to-[#C41E3A]/50"
            initial={{ scaleX: 0, originX: 1 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
        </div>

        {/* Grid de productos */}
        <SimpleGrid
          cols={{ base: 2, sm: 2, md: 3, lg: 4 }}
          spacing={{ base: "sm", md: "lg" }}
        >
          {featuredProducts.map((product, index) => (
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
      </Container>
    </section>
  );
}
