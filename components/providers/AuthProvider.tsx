"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/store";
import { api } from "@/lib/api-client";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    // Hydrate auth state from httpOnly cookies via server
    api
      .getMe()
      .then((user) => setUser(user))
      .catch(() => setUser(null));
  }, [setUser]);

  return <>{children}</>;
}
