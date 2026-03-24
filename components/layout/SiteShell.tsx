"use client";

import { usePathname } from "next/navigation";
import TopBar from "@/components/layout/TopBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import type { StoreResponse } from "@/lib/api-client";

interface SiteShellProps {
  children: React.ReactNode;
  storeConfig?: StoreResponse | null;
}

export function SiteShell({ children, storeConfig }: SiteShellProps) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      {!isAdmin && (
        <TopBar phone={storeConfig?.phone} email={storeConfig?.email} />
      )}
      {!isAdmin && <Navbar />}
      {children}
      {!isAdmin && (
        <Footer
          storeName={storeConfig?.name}
          instagram={storeConfig?.instagram}
          facebook={storeConfig?.facebook}
          whatsapp={storeConfig?.whatsapp}
          phone={storeConfig?.phone}
          email={storeConfig?.email}
        />
      )}
    </>
  );
}
