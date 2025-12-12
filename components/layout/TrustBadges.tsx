"use client";

import { Container } from "@mantine/core";
import { Truck, CreditCard, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const badges = [
  {
    icon: Truck,
    text: "Entregas a todo el país",
  },
  {
    icon: CreditCard,
    text: "Tarjetas de crédito o efectivo",
  },
  {
    icon: ShieldCheck,
    text: "Productos reembolsables",
  },
];

export default function TrustBadges() {
  return (
    <div className="border-b border-gray-200 bg-white py-4">
      <Container size="xl">
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
          {badges.map((badge, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.15,
                type: "spring",
                stiffness: 150,
              }}
              whileHover={{ scale: 1.05, y: -2 }}
              className="group flex cursor-default items-center gap-3"
            >
              {/* Icon container con glow */}
              <motion.div
                className="relative rounded-full bg-gradient-to-br from-[#C41E3A]/10 to-[#C41E3A]/5 p-2"
                animate={{
                  boxShadow: [
                    "0 0 0px rgba(196, 30, 58, 0)",
                    "0 0 15px rgba(196, 30, 58, 0.4)",
                    "0 0 0px rgba(196, 30, 58, 0)",
                  ],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.5,
                }}
              >
                <badge.icon
                  size={20}
                  className="text-[#C41E3A] transition-transform duration-300 group-hover:scale-110"
                />
              </motion.div>

              <span className="text-sm font-medium text-gray-700 transition-colors group-hover:text-gray-900">
                {badge.text}
              </span>
            </motion.div>
          ))}
        </div>
      </Container>
    </div>
  );
}
