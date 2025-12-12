"use client";

import Link from "next/link";
import { Container, Title } from "@mantine/core";
import { categories } from "@/lib/mock-data";
import { motion } from "framer-motion";

export default function CategoriesSection() {
  return (
    <section className="bg-white pt-10 pb-4">
      <Container size="xl">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Title
            order={2}
            className="mb-4 text-center text-lg font-bold tracking-wider text-gray-800"
          >
            CATEGORÍAS PRINCIPALES
          </Title>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 md:flex md:flex-wrap md:justify-center md:gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                type: "spring",
                stiffness: 200,
              }}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <Link
                href={`/productos?categoria=${category.slug}`}
                className="relative block w-full text-center rounded-lg border-2 border-white/20 bg-gradient-to-r from-[#C41E3A] to-[#9B1830] px-4 py-2.5 md:px-8 md:py-3 text-xs md:text-sm font-bold tracking-wide shadow-lg transition-all duration-300 hover:from-[#9B1830] hover:to-[#C41E3A]"
                style={{ color: "white" }}
              >
                {category.name.toUpperCase()}
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
