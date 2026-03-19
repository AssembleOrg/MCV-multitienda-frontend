"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Table,
  NumberInput,
  TextInput,
  ActionIcon,
  Paper,
  Badge,
  Center,
  Divider,
} from "@mantine/core";
import { IconTrash, IconArrowLeft, IconTag } from "@tabler/icons-react";
import { useCartStore } from "@/lib/store";
import { api } from "@/lib/api-client";
import { formatPrice } from "@/lib/utils";
import { notifications } from "@mantine/notifications";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const getTotal = useCartStore((s) => s.getTotal);

  const [campaignCode, setCampaignCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCode, setAppliedCode] = useState("");
  const [validating, setValidating] = useState(false);

  const subtotal = getTotal();
  const total = subtotal - discount;

  const handleApplyCode = async () => {
    if (!campaignCode.trim()) return;
    setValidating(true);
    try {
      const result = await api.validateCampaign({
        code: campaignCode,
        cartTotal: subtotal,
      });
      setDiscount(result.discount);
      setAppliedCode(campaignCode.toUpperCase());
      notifications.show({
        title: "Código aplicado",
        message: `Descuento de ${formatPrice(result.discount)}`,
        color: "green",
      });
    } catch (err) {
      setDiscount(0);
      setAppliedCode("");
      notifications.show({
        title: "Código inválido",
        message: err instanceof Error ? err.message : "Código no válido",
        color: "red",
      });
    } finally {
      setValidating(false);
    }
  };

  if (items.length === 0) {
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

  return (
    <section className="bg-gray-50 py-8">
      <Container size="xl">
        <Group mb="lg">
          <Button
            component={Link}
            href="/productos"
            variant="subtle"
            color="gray"
            leftSection={<IconArrowLeft size={16} />}
            size="sm"
          >
            Seguir comprando
          </Button>
          <Title order={1} className="text-2xl font-bold text-gray-800">
            Carrito ({items.length})
          </Title>
        </Group>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Items */}
          <div className="lg:col-span-2">
            <Paper withBorder p="md">
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Producto</Table.Th>
                    <Table.Th>Precio</Table.Th>
                    <Table.Th>Cantidad</Table.Th>
                    <Table.Th>Subtotal</Table.Th>
                    <Table.Th />
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {items.map((item) => (
                    <Table.Tr key={`${item.productId}-${JSON.stringify(item.selectedVariants)}`}>
                      <Table.Td>
                        <Group gap="sm">
                          <div className="relative h-14 w-14 overflow-hidden rounded-md border border-gray-200 bg-gray-50">
                            {item.image ? (
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover"
                                sizes="56px"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-lg text-gray-300">
                                {item.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div>
                            <Text size="sm" fw={500}>
                              {item.name}
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
                        </Group>
                      </Table.Td>
                      <Table.Td>{formatPrice(item.price)}</Table.Td>
                      <Table.Td>
                        <NumberInput
                          value={item.quantity}
                          onChange={(v) => updateQuantity(item.productId, Number(v) || 1)}
                          min={1}
                          max={99}
                          w={80}
                          size="xs"
                        />
                      </Table.Td>
                      <Table.Td fw={500}>
                        {formatPrice(item.price * item.quantity)}
                      </Table.Td>
                      <Table.Td>
                        <ActionIcon
                          color="red"
                          variant="subtle"
                          onClick={() => removeItem(item.productId)}
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Paper>
          </div>

          {/* Summary */}
          <div>
            <Paper withBorder p="lg">
              <Title order={3} mb="md">
                Resumen
              </Title>

              {/* Campaign Code */}
              <Group gap="xs" mb="md">
                <TextInput
                  placeholder="Código de descuento"
                  leftSection={<IconTag size={14} />}
                  value={campaignCode}
                  onChange={(e) => setCampaignCode(e.currentTarget.value)}
                  style={{ flex: 1 }}
                  size="sm"
                />
                <Button
                  size="sm"
                  variant="outline"
                  color="mcvRed"
                  loading={validating}
                  onClick={handleApplyCode}
                >
                  Aplicar
                </Button>
              </Group>

              {appliedCode && (
                <Badge color="green" variant="light" mb="sm" fullWidth>
                  Código {appliedCode} aplicado
                </Badge>
              )}

              <Divider my="sm" />

              <Group justify="space-between" mb="xs">
                <Text size="sm">Subtotal</Text>
                <Text size="sm">{formatPrice(subtotal)}</Text>
              </Group>

              {discount > 0 && (
                <Group justify="space-between" mb="xs">
                  <Text size="sm" c="green">
                    Descuento
                  </Text>
                  <Text size="sm" c="green">
                    -{formatPrice(discount)}
                  </Text>
                </Group>
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
                  {formatPrice(total)}
                </Text>
              </Group>

              <Button
                component={Link}
                href={`/checkout${appliedCode ? `?code=${appliedCode}` : ""}`}
                color="mcvRed"
                fullWidth
                size="md"
              >
                Finalizar compra
              </Button>
            </Paper>
          </div>
        </div>
      </Container>
    </section>
  );
}
