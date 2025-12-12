"use client";

import Link from "next/link";
import { Card, Text } from "@mantine/core";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.div
      whileHover={{ y: -12, scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group"
    >
      <Link href={`/productos/${product.slug}`}>
        <Card
          shadow="sm"
          padding="sm"
          radius="md"
          className="h-full border-2 border-gray-200 hover:border-[#C41E3A]/50 hover:shadow-[0_0_30px_rgba(196,30,58,0.25)] transition-all duration-300 cursor-pointer overflow-hidden relative"
        >
          {/* Shimmer overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out z-10 pointer-events-none" />

          {/* Imagen */}
          <Card.Section className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center overflow-hidden relative">
            <motion.div
              className="text-gray-300 text-5xl font-light"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.3 }}
            >
              {product.name.charAt(0)}
            </motion.div>

            {/* Corner glow on hover */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-[#C41E3A]/0 group-hover:bg-[#C41E3A]/10 blur-2xl transition-all duration-500" />
          </Card.Section>

          {/* Info */}
          <div className="pt-4 relative">
            <Text
              className="text-gray-800 font-semibold text-sm line-clamp-2 mb-2 uppercase tracking-wide group-hover:text-gray-900 transition-colors"
              style={{ minHeight: "2.5rem" }}
            >
              {product.name}
            </Text>

            <Text className="text-xl font-bold text-[#C41E3A] group-hover:scale-105 transition-transform inline-block">
              {formatPrice(product.price)}
            </Text>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
