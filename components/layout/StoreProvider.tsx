import { prisma } from "@/lib/prisma";
import { SiteShell } from "./SiteShell";

export async function StoreProvider({ children }: { children: React.ReactNode }) {
  const store = await prisma.multitienda_store.findFirst().catch(() => null);
  return <SiteShell storeConfig={store ?? null}>{children}</SiteShell>;
}
