"use client";

import { SimpleGrid, Skeleton, Group, Stack } from "@mantine/core";

export function ProductDetailSkeleton() {
  return (
    <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
      {/* Galería */}
      <div>
        <Skeleton height={0} style={{ paddingBottom: "100%" }} radius="sm" />
        <Group mt="xs" gap="xs">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} height={64} width={64} radius="sm" />
          ))}
        </Group>
      </div>

      {/* Info */}
      <Stack gap="md" pt={4}>
        <Skeleton height={22} width="30%" radius="sm" />
        <Skeleton height={32} width="80%" radius="sm" />
        <div>
          <Skeleton height={13} width="100%" mb={6} radius="sm" />
          <Skeleton height={13} width="90%" mb={6} radius="sm" />
          <Skeleton height={13} width="70%" radius="sm" />
        </div>
        <Skeleton height={28} width="40%" radius="sm" />
        <Group gap="xs">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} height={36} width={72} radius="sm" />
          ))}
        </Group>
        <Group gap="sm">
          <Skeleton height={44} width={100} radius="sm" />
          <Skeleton height={44} style={{ flex: 1 }} radius="sm" />
        </Group>
      </Stack>
    </SimpleGrid>
  );
}
