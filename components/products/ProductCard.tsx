"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, Text } from "@mantine/core";
import { type ProductResponse } from "@/lib/api-client";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: ProductResponse;
}

export default function ProductCard({ product }: ProductCardProps) {
  const mainImage = product.images?.[0];

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
          className="relative h-full cursor-pointer overflow-hidden border-2 border-gray-200 transition-all duration-300 hover:border-[#C41E3A]/50 hover:shadow-[0_0_30px_rgba(196,30,58,0.25)]"
        >
          {/* Shimmer overlay */}
          <div className="pointer-events-none absolute inset-0 z-10 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />

          {/* Imagen */}
          <Card.Section className="relative flex aspect-[3/4] items-center justify-center overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
            {mainImage ? (
              <Image
                src={mainImage.url}
                alt={mainImage.alt || product.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            ) : (
              <motion.div
                className="text-5xl font-light text-gray-300"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                {product.name.charAt(0)}
              </motion.div>
            )}

            <div className="absolute top-0 right-0 h-20 w-20 bg-[#C41E3A]/0 blur-2xl transition-all duration-500 group-hover:bg-[#C41E3A]/10" />
          </Card.Section>

          {/* Info */}
          <div className="relative pt-4">
            <Text
              className="mb-2 text-sm font-semibold tracking-wide text-gray-800 uppercase line-clamp-2 transition-colors group-hover:text-gray-900"
              style={{ minHeight: "2.5rem" }}
            >
              {product.name}
            </Text>

            <div className="mt-2">
              {product.originalPrice && (
                <div className="mb-1 flex items-center gap-1.5">
                  <span style={{ fontSize: 11, color: "#9ca3af", textDecoration: "line-through" }}>
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span style={{ fontSize: 10, background: "#C41E3A", color: "#fff", borderRadius: 4, padding: "1px 5px", fontWeight: 700 }}>
                    -{calculateDiscount(product.originalPrice, product.price)}%
                  </span>
                </div>
              )}
              <span
                style={{ fontSize: 20, fontWeight: 800, color: "#111", display: "inline-block", lineHeight: 1 }}
                className="transition-transform group-hover:scale-105"
              >
                {formatPrice(product.price)}
              </span>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
