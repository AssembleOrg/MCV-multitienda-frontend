"use client";

import { motion } from "framer-motion";

const promos = [
  "6 CUOTAS SIN INTERÉS",
  "20% OFF EN ELECTRÓNICA",
  "ENVÍO GRATIS +$50.000",
  "NUEVOS INGRESOS SEMANALES",
];

export default function PromoSlider() {
  // Duplicar contenido para loop infinito seamless
  const allPromos = [...promos, ...promos, ...promos];

  return (
    <div className="bg-[#C41E3A] py-3 overflow-hidden relative">
      {/* Glow superior e inferior */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />

      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: ["0%", "-33.33%"] }}
        transition={{
          x: {
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          },
        }}
      >
        {allPromos.map((promo, i) => (
          <span
            key={i}
            className="text-white font-bold text-sm tracking-wider px-8 flex items-center gap-2"
          >
            <span className="text-white/70">★</span>
            {promo}
            <span className="text-white/70">★</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
