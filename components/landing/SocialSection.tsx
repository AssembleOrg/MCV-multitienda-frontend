"use client";

import { Container } from "@mantine/core";
import { motion } from "framer-motion";
import { Instagram, Facebook } from "lucide-react";
import { FaTiktok } from "react-icons/fa";

const socials = [
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: FaTiktok, label: "TikTok", href: "#" },
  { icon: Facebook, label: "Facebook", href: "#" },
];

export default function SocialSection() {
  return (
    <section className="bg-gradient-to-b from-[#1a1a1a] to-[#252525] py-16 relative overflow-hidden">
      {/* Neon line top */}
      <div className="absolute top-0 left-0 right-0 neon-wave" />

      {/* Corner glows */}
      <motion.div
        className="absolute top-0 left-0 w-40 h-40 bg-[#C41E3A] rounded-full blur-3xl"
        animate={{ opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-40 h-40 bg-[#C41E3A] rounded-full blur-3xl"
        animate={{ opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
      />

      <Container size="xl" className="relative z-10">
        <div className="text-center">
          {/* Título */}
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-white mb-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            CADA DÍA SOMOS MÁS
          </motion.h2>

          <motion.p
            className="text-2xl md:text-3xl font-bold mb-12 tracking-widest"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.span
              className="text-[#C41E3A]"
              animate={{
                textShadow: [
                  "0 0 10px #C41E3A",
                  "0 0 30px #C41E3A, 0 0 50px rgba(196,30,58,0.5)",
                  "0 0 10px #C41E3A",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              ¡SUMATE!
            </motion.span>
          </motion.p>

          {/* Social Icons - Grandes */}
          <div className="flex items-center justify-center gap-8 md:gap-16">
            {socials.map((social, index) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-4"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                whileHover={{ scale: 1.1, y: -8 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="p-6 md:p-8 rounded-2xl bg-white/5 backdrop-blur-sm border-2 border-white/10 transition-all duration-300"
                  whileHover={{
                    boxShadow: "0 0 30px rgba(196, 30, 58, 0.5)",
                    borderColor: "#C41E3A",
                    backgroundColor: "rgba(255,255,255,0.1)",
                  }}
                >
                  <social.icon
                    size={56}
                    className="text-white group-hover:text-[#C41E3A] transition-colors duration-300"
                  />
                </motion.div>
                <span className="text-gray-400 group-hover:text-white text-base font-semibold tracking-wide transition-colors duration-300">
                  {social.label}
                </span>
              </motion.a>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
