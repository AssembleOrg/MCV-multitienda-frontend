"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Container,
  Paper,
  Title,
  TextInput,
  PasswordInput,
  Button,
  Text,
  Anchor,
} from "@mantine/core";
import { api } from "@/lib/api-client";
import { useAuthStore } from "@/lib/store";

export default function LoginPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { user } = await api.login(email, password);
      setUser(user);
      router.push(user.role === "admin" ? "/admin" : "/");
      router.refresh(); // Refresh server components to pick up new cookies
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={420} className="py-16">
      <Title className="text-center text-2xl font-bold text-gray-800">
        Iniciar sesión
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        ¿No tenés cuenta?{" "}
        <Anchor component={Link} href="/auth/register" size="sm">
          Crear cuenta
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Email"
            placeholder="tu@email.com"
            required
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
          />
          <PasswordInput
            label="Contraseña"
            placeholder="Tu contraseña"
            required
            mt="md"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
          />

          {error && (
            <Text c="red" size="sm" mt="sm">
              {error}
            </Text>
          )}

          <Button
            fullWidth
            mt="xl"
            type="submit"
            loading={loading}
            color="mcvRed"
          >
            Iniciar sesión
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
