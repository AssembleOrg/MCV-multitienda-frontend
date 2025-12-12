"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const promos = [
  "3 CUOTAS SIN INTERÉS",
  "10% OFF EN EFECTIVO",
  "ENVÍO GRATIS +$50.000",
  "INGRESOS SEMANALES",
];

export default function PromoSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Rotar promos en mobile cada 3 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % promos.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Duplicar contenido para loop infinito seamless (desktop)
  const allPromos = [...promos, ...promos, ...promos];

  return (
    <div className="relative overflow-hidden bg-[#C41E3A] py-3">
      {/* Glow superior e inferior */}
      <div className="absolute top-0 right-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      <div className="absolute right-0 bottom-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />

      {/* Mobile - Static rotate */}
      <div className="md:hidden text-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={currentIndex}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.3 }}
            className="inline-flex items-center gap-2 text-sm font-bold tracking-wider text-white"
          >
            <span className="text-white/70">★</span>
            {promos[currentIndex]}
            <span className="text-white/70">★</span>
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Desktop - Marquee */}
      <motion.div
        className="hidden md:flex whitespace-nowrap"
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
            className="flex items-center gap-2 px-8 text-sm font-bold tracking-wider text-white"
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
