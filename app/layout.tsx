import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { theme } from "@/lib/theme";
import { StoreProvider } from "@/components/layout/StoreProvider";
import AuthProvider from "@/components/providers/AuthProvider";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "MCV Multitienda - Tu tienda online",
  description:
    "Encuentra los mejores productos en Ropa, Moda, Celulares y Electrónica",
  keywords: ["ecommerce", "tienda online", "ropa", "moda", "celulares", "electronica", "MCV"],
  icons: {
    icon: [
      { url: "/web-app-manifest-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/web-app-manifest-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/web-app-manifest-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${montserrat.variable} font-sans antialiased bg-white`}>
        <MantineProvider theme={theme} defaultColorScheme="light">
          <Notifications position="top-right" />
          <AuthProvider>
            <StoreProvider>
              {children}
            </StoreProvider>
          </AuthProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
