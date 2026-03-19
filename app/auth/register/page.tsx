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
  SimpleGrid,
} from "@mantine/core";
import { api } from "@/lib/api-client";
import { useAuthStore } from "@/lib/store";

export default function RegisterPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [form, setForm] = useState({
    name: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { user } = await api.register(form);
      setUser(user);
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al registrar");
    } finally {
      setLoading(false);
    }
  };

  const update =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <Container size={480} className="py-16">
      <Title className="text-center text-2xl font-bold text-gray-800">
        Crear cuenta
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        ¿Ya tenés cuenta?{" "}
        <Anchor component={Link} href="/auth/login" size="sm">
          Iniciar sesión
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={handleSubmit}>
          <SimpleGrid cols={2}>
            <TextInput
              label="Nombre"
              placeholder="Juan"
              required
              value={form.name}
              onChange={update("name")}
            />
            <TextInput
              label="Apellido"
              placeholder="Pérez"
              value={form.lastName}
              onChange={update("lastName")}
            />
          </SimpleGrid>

          <TextInput
            label="Email"
            placeholder="tu@email.com"
            required
            mt="md"
            value={form.email}
            onChange={update("email")}
          />

          <TextInput
            label="Teléfono"
            placeholder="11 1234-5678"
            mt="md"
            value={form.phone}
            onChange={update("phone")}
          />

          <PasswordInput
            label="Contraseña"
            placeholder="Mínimo 6 caracteres"
            required
            mt="md"
            value={form.password}
            onChange={update("password")}
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
            Crear cuenta
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
