"use client";

import Image from "next/image";
import { Container } from "@mantine/core";
import { motion } from "framer-motion";

export default function WelcomeBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#1a1a1a] via-[#252525] to-[#1a1a1a] py-10">
      {/* Neon borders top and bottom */}
      <motion.div
        className="absolute top-0 right-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-[#C41E3A] to-transparent"
        animate={{
          opacity: [0.5, 1, 0.5],
          boxShadow: [
            "0 0 10px #C41E3A",
            "0 0 30px #C41E3A, 0 0 50px rgba(196,30,58,0.5)",
            "0 0 10px #C41E3A",
          ],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-0 bottom-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-[#C41E3A] to-transparent"
        animate={{
          opacity: [0.5, 1, 0.5],
          boxShadow: [
            "0 0 10px #C41E3A",
            "0 0 30px #C41E3A, 0 0 50px rgba(196,30,58,0.5)",
            "0 0 10px #C41E3A",
          ],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {/* Corner glows */}
      {[
        { pos: "top-0 left-0", delay: 0 },
        { pos: "top-0 right-0", delay: 0.5 },
        { pos: "bottom-0 left-0", delay: 1 },
        { pos: "bottom-0 right-0", delay: 1.5 },
      ].map((corner, i) => (
        <motion.div
          key={i}
          className={`absolute ${corner.pos} h-24 w-24 rounded-full bg-[#C41E3A] blur-3xl`}
          animate={{
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: corner.delay,
          }}
        />
      ))}

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-1.5 w-1.5 rounded-full bg-[#C41E3A]"
          style={{
            left: `${15 + i * 14}%`,
            top: "50%",
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 1, 0.3],
            scale: [1, 1.5, 1],
            boxShadow: [
              "0 0 5px #C41E3A",
              "0 0 15px #C41E3A, 0 0 25px rgba(196,30,58,0.5)",
              "0 0 5px #C41E3A",
            ],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.3,
          }}
        />
      ))}

      <Container size="xl" className="relative z-10">
        <div className="flex flex-col items-center justify-center">
          {/* Logo centrado con glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              animate={{
                filter: [
                  "drop-shadow(0 0 10px rgba(196,30,58,0.5))",
                  "drop-shadow(0 0 25px rgba(196,30,58,0.8))",
                  "drop-shadow(0 0 10px rgba(196,30,58,0.5))",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Image
                src="/logo-sinbg.svg"
                alt="MCV Multitienda"
                width={140}
                height={140}
                className="mb-3"
                priority
              />
            </motion.div>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            className="text-lg font-medium tracking-widest text-gray-300"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Tu estilo, nuestra pasión
          </motion.p>
        </div>
      </Container>
    </section>
  );
}
