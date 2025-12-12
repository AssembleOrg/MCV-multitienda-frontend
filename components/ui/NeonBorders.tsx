"use client";

import { motion } from "framer-motion";

interface NeonBordersProps {
  intensity?: number;
  className?: string;
  color?: string;
}

/**
 * NeonBorders - Componente de bordes animados con efecto neón
 * Adaptado de Kansaco para usar el color primario (rojo neón)
 */
export const NeonBorders = ({
  intensity = 0.6,
  className = "",
  color = "var(--primary)",
}: NeonBordersProps) => {
  const glowColor = color;
  const glowShadow = `0 0 20px ${color}`;
  const glowShadowStrong = `0 0 50px ${color}, 0 0 80px ${color}`;

  return (
    <motion.div
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{ opacity: intensity }}
      initial={{ opacity: 0 }}
      animate={{ opacity: intensity }}
      transition={{ duration: 1, delay: 0.5 }}
    >
      {/* Top Border */}
      <motion.div
        className="absolute left-0 right-0 top-0 h-[2px]"
        style={{
          background: `linear-gradient(90deg, transparent, ${glowColor}, transparent)`,
        }}
        animate={{
          opacity: [0.6, 1, 0.6],
          boxShadow: [glowShadow, glowShadowStrong, glowShadow],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Right Border */}
      <motion.div
        className="absolute bottom-0 right-0 top-0 w-[2px]"
        style={{
          background: `linear-gradient(180deg, transparent, ${glowColor}, transparent)`,
        }}
        animate={{
          opacity: [0.6, 1, 0.6],
          boxShadow: [glowShadow, glowShadowStrong, glowShadow],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />

      {/* Bottom Border */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[2px]"
        style={{
          background: `linear-gradient(90deg, transparent, ${glowColor}, transparent)`,
        }}
        animate={{
          opacity: [0.6, 1, 0.6],
          boxShadow: [glowShadow, glowShadowStrong, glowShadow],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      {/* Left Border */}
      <motion.div
        className="absolute bottom-0 left-0 top-0 w-[2px]"
        style={{
          background: `linear-gradient(180deg, transparent, ${glowColor}, transparent)`,
        }}
        animate={{
          opacity: [0.6, 1, 0.6],
          boxShadow: [glowShadow, glowShadowStrong, glowShadow],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
      />

      {/* Corner Glows */}
      {[
        { position: "left-0 top-0", delay: 0 },
        { position: "right-0 top-0", delay: 0.75 },
        { position: "right-0 bottom-0", delay: 1.5 },
        { position: "left-0 bottom-0", delay: 2.25 },
      ].map((corner, index) => (
        <motion.div
          key={index}
          className={`absolute ${corner.position} h-8 w-8 rounded-full blur-md`}
          style={{ backgroundColor: glowColor }}
          animate={{
            opacity: [0.7, 1, 0.7],
            scale: [1, 2, 1],
            boxShadow: [
              `0 0 30px ${glowColor}`,
              `0 0 60px ${glowColor}, 0 0 100px ${glowColor}`,
              `0 0 30px ${glowColor}`,
            ],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: corner.delay,
          }}
        />
      ))}
    </motion.div>
  );
};

/**
 * NeonLine - Línea horizontal con efecto neón
 */
export const NeonLine = ({
  className = "",
  color = "var(--primary)",
}: {
  className?: string;
  color?: string;
}) => (
  <motion.div
    className={`h-[2px] w-full ${className}`}
    style={{
      background: `linear-gradient(90deg, transparent, ${color}, ${color}, transparent)`,
      boxShadow: `0 0 10px ${color}, 0 0 20px ${color}`,
    }}
    animate={{
      opacity: [0.7, 1, 0.7],
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

/**
 * GlowingDot - Punto animado con efecto pulsante
 */
export const GlowingDot = ({
  className = "",
  color = "var(--primary)",
  size = "h-2 w-2",
}: {
  className?: string;
  color?: string;
  size?: string;
}) => (
  <motion.div
    className={`rounded-full ${size} ${className}`}
    style={{ backgroundColor: color }}
    animate={{
      opacity: [0.5, 1, 0.5],
      scale: [1, 1.2, 1],
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

export default NeonBorders;
