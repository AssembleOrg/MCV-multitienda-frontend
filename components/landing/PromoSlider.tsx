"use client";

import { useState, useEffect } from "react";
import { api, type PromoResponse } from "@/lib/api-client";
import { motion, AnimatePresence } from "framer-motion";

export default function PromoSlider() {
  const [promos, setPromos] = useState<PromoResponse[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    api.getPromos().then(setPromos).catch(() => setPromos([]));
  }, []);

  useEffect(() => {
    if (promos.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % promos.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [promos.length]);

  if (promos.length === 0) return null;

  const allPromos = [...promos, ...promos, ...promos];

  return (
    <div className="relative overflow-hidden bg-[#C41E3A] py-3">
      <div className="absolute top-0 right-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      <div className="absolute right-0 bottom-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />

      {/* Mobile */}
      <div className="text-center md:hidden">
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
            {promos[currentIndex]?.text}
            <span className="text-white/70">★</span>
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Desktop */}
      <motion.div
        className="hidden whitespace-nowrap md:flex"
        animate={{ x: ["0%", "-33.33%"] }}
        transition={{ x: { duration: 25, repeat: Infinity, ease: "linear" } }}
      >
        {allPromos.map((promo, i) => (
          <span
            key={i}
            className="flex items-center gap-2 px-8 text-sm font-bold tracking-wider text-white"
          >
            <span className="text-white/70">★</span>
            {promo.text}
            <span className="text-white/70">★</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
