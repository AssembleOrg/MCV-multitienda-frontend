"use client";

import Image from "next/image";
import { Container, Title, Text, SimpleGrid } from "@mantine/core";
import { IconTruck, IconCreditCard, IconRefresh, IconHeadset } from "@tabler/icons-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: IconTruck,
    title: "Envíos a todo el país",
    description: "Realizamos envíos a todas las provincias con seguimiento en tiempo real.",
  },
  {
    icon: IconCreditCard,
    title: "Múltiples medios de pago",
    description: "Aceptamos tarjetas de crédito, débito, transferencia y efectivo.",
  },
  {
    icon: IconRefresh,
    title: "Cambios y devoluciones",
    description: "Tenés 30 días para realizar cambios o devoluciones sin costo.",
  },
  {
    icon: IconHeadset,
    title: "Atención personalizada",
    description: "Nuestro equipo está disponible para ayudarte en lo que necesites.",
  },
];

export default function NosotrosPage() {
  return (
    <section className="bg-white">
      {/* Hero */}
      <div className="relative bg-[#1a1a1a] py-20">
        <Container size="lg" className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Image
              src="/logo-sinbg.svg"
              alt="MCV Multitienda"
              width={120}
              height={120}
              className="mx-auto mb-6 rounded-lg"
            />
            <Title order={1} className="mb-4 text-3xl font-bold text-white">
              Sobre Nosotros
            </Title>
            <Text c="gray.4" size="lg" maw={600} className="mx-auto">
              Somos MCV Multitienda, tu tienda online de confianza. Ofrecemos
              los mejores productos en ropa, moda, celulares y electrónica con
              la mejor atención y los mejores precios.
            </Text>
          </motion.div>
        </Container>
        <div className="neon-wave absolute right-0 bottom-0 left-0" />
      </div>

      {/* Features */}
      <Container size="lg" className="py-16">
        <Title order={2} className="mb-10 text-center text-2xl font-bold text-gray-800">
          ¿Por qué elegirnos?
        </Title>
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="xl">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
                <feature.icon size={28} className="text-[#C41E3A]" />
              </div>
              <Text fw={600} mb="xs">
                {feature.title}
              </Text>
              <Text size="sm" c="dimmed">
                {feature.description}
              </Text>
            </motion.div>
          ))}
        </SimpleGrid>
      </Container>

      {/* Mission */}
      <div className="bg-gray-50 py-16">
        <Container size="md" className="text-center">
          <Title order={2} className="mb-6 text-2xl font-bold text-gray-800">
            Nuestra Misión
          </Title>
          <Text size="lg" c="dimmed" className="leading-relaxed">
            Brindar a nuestros clientes una experiencia de compra única,
            ofreciendo productos de calidad a precios accesibles. Nos
            comprometemos a la excelencia en el servicio, la innovación
            constante y la satisfacción total de quienes confían en nosotros.
          </Text>
        </Container>
      </div>
    </section>
  );
}
