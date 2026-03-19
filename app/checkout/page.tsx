"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Container,
  Title,
  Text,
  Button,
  TextInput,
  SimpleGrid,
  Paper,
  Group,
  Divider,
  Center,
  Loader,
  Badge,
} from "@mantine/core";
import { IconArrowLeft, IconCheck } from "@tabler/icons-react";
import { useCartStore, useAuthStore } from "@/lib/store";
import { api } from "@/lib/api-client";
import { formatPrice } from "@/lib/utils";
import { notifications } from "@mantine/notifications";

export default function CheckoutPage() {
  return (
    <Suspense>
      <CheckoutContent />
    </Suspense>
  );
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const campaignCode = searchParams.get("code") || "";

  const items = useCartStore((s) => s.items);
  const getTotal = useCartStore((s) => s.getTotal);
  const clearCart = useCartStore((s) => s.clearCart);
  const user = useAuthStore((s) => s.user);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");

  const [contact, setContact] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
  });

  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const [notes, setNotes] = useState("");

  const subtotal = getTotal();

  if (items.length === 0 && !success) {
    return (
      <section className="bg-gray-50 py-16">
        <Container size="sm">
          <Center>
            <div className="text-center">
              <Text size="xl" fw={500} c="dimmed" mb="md">
                Tu carrito está vacío
              </Text>
              <Button component={Link} href="/productos" variant="outline" color="mcvRed">
                Ver catálogo
              </Button>
            </div>
          </Center>
        </Container>
      </section>
    );
  }

  if (success) {
    return (
      <section className="bg-gray-50 py-16">
        <Container size="sm">
          <Center>
            <Paper withBorder p="xl" radius="md" className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <IconCheck size={32} className="text-green-600" />
              </div>
              <Title order={2} mb="xs">
                ¡Pedido confirmado!
              </Title>
              <Text c="dimmed" mb="md">
                Tu pedido #{orderId.slice(0, 8)} fue creado exitosamente.
              </Text>
              <Text size="sm" c="dimmed" mb="lg">
                Te contactaremos a {contact.email} con los detalles.
              </Text>
              <Button component={Link} href="/productos" color="mcvRed">
                Seguir comprando
              </Button>
            </Paper>
          </Center>
        </Container>
      </section>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!contact.name || !contact.email || !contact.phone) {
      notifications.show({ title: "Error", message: "Completá los datos de contacto", color: "red" });
      return;
    }

    setLoading(true);
    try {
      const order = await api.createOrder({
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          variantIds: item.selectedVariants.map((v) => v.id),
        })),
        contactInfo: contact,
        shippingAddress: address.street
          ? { ...address, country: "Argentina" }
          : undefined,
        campaignCode: campaignCode || undefined,
        notes: notes || undefined,
      });

      setOrderId(order.id);
      setSuccess(true);
      clearCart();
    } catch (err) {
      notifications.show({
        title: "Error",
        message: err instanceof Error ? err.message : "Error al crear el pedido",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gray-50 py-8">
      <Container size="lg">
        <Group mb="lg">
          <Button
            component={Link}
            href="/carrito"
            variant="subtle"
            color="gray"
            leftSection={<IconArrowLeft size={16} />}
            size="sm"
          >
            Volver al carrito
          </Button>
          <Title order={1} className="text-2xl font-bold text-gray-800">
            Checkout
          </Title>
        </Group>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              {/* Contact */}
              <Paper withBorder p="lg">
                <Title order={3} mb="md">
                  Datos de contacto
                </Title>
                <SimpleGrid cols={{ base: 1, sm: 2 }}>
                  <TextInput
                    label="Nombre completo"
                    required
                    value={contact.name}
                    onChange={(e) =>
                      setContact((c) => ({ ...c, name: e.currentTarget.value }))
                    }
                  />
                  <TextInput
                    label="Email"
                    type="email"
                    required
                    value={contact.email}
                    onChange={(e) =>
                      setContact((c) => ({ ...c, email: e.currentTarget.value }))
                    }
                  />
                  <TextInput
                    label="Teléfono"
                    required
                    value={contact.phone}
                    onChange={(e) =>
                      setContact((c) => ({ ...c, phone: e.currentTarget.value }))
                    }
                  />
                </SimpleGrid>
              </Paper>

              {/* Address */}
              <Paper withBorder p="lg">
                <Title order={3} mb="md">
                  Dirección de envío
                </Title>
                <SimpleGrid cols={{ base: 1, sm: 2 }}>
                  <TextInput
                    label="Calle y número"
                    value={address.street}
                    onChange={(e) =>
                      setAddress((a) => ({ ...a, street: e.currentTarget.value }))
                    }
                    className="sm:col-span-2"
                  />
                  <TextInput
                    label="Ciudad"
                    value={address.city}
                    onChange={(e) =>
                      setAddress((a) => ({ ...a, city: e.currentTarget.value }))
                    }
                  />
                  <TextInput
                    label="Provincia"
                    value={address.state}
                    onChange={(e) =>
                      setAddress((a) => ({ ...a, state: e.currentTarget.value }))
                    }
                  />
                  <TextInput
                    label="Código postal"
                    value={address.zipCode}
                    onChange={(e) =>
                      setAddress((a) => ({ ...a, zipCode: e.currentTarget.value }))
                    }
                  />
                </SimpleGrid>
              </Paper>

              {/* Notes */}
              <Paper withBorder p="lg">
                <TextInput
                  label="Notas (opcional)"
                  placeholder="Indicaciones para el envío, etc."
                  value={notes}
                  onChange={(e) => setNotes(e.currentTarget.value)}
                />
              </Paper>
            </div>

            {/* Order Summary */}
            <Paper withBorder p="lg" className="h-fit">
              <Title order={3} mb="md">
                Tu pedido
              </Title>

              {items.map((item) => (
                <Group
                  key={`${item.productId}-${JSON.stringify(item.selectedVariants)}`}
                  justify="space-between"
                  mb="xs"
                >
                  <div>
                    <Text size="sm" lineClamp={1}>
                      {item.name} x{item.quantity}
                    </Text>
                    {item.selectedVariants.length > 0 && (
                      <Group gap={4}>
                        {item.selectedVariants.map((v) => (
                          <Badge key={v.id} size="xs" variant="light">
                            {v.value}
                          </Badge>
                        ))}
                      </Group>
                    )}
                  </div>
                  <Text size="sm" fw={500}>
                    {formatPrice(item.price * item.quantity)}
                  </Text>
                </Group>
              ))}

              <Divider my="sm" />

              <Group justify="space-between" mb="xs">
                <Text size="sm">Subtotal</Text>
                <Text size="sm">{formatPrice(subtotal)}</Text>
              </Group>

              {campaignCode && (
                <Badge color="green" variant="light" mb="xs" fullWidth>
                  Código: {campaignCode}
                </Badge>
              )}

              <Group justify="space-between" mb="xs">
                <Text size="sm">Envío</Text>
                <Text size="sm" c="green">
                  Gratis
                </Text>
              </Group>

              <Divider my="sm" />

              <Group justify="space-between" mb="lg">
                <Text fw={700} size="lg">
                  Total
                </Text>
                <Text fw={700} size="lg" c="#C41E3A">
                  {formatPrice(subtotal)}
                </Text>
              </Group>

              <Button
                type="submit"
                color="mcvRed"
                fullWidth
                size="md"
                loading={loading}
              >
                Confirmar pedido
              </Button>
            </Paper>
          </div>
        </form>
      </Container>
    </section>
  );
}
