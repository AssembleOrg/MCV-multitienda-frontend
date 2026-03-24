"use client";

import { Card, Skeleton, Group } from "@mantine/core";

export function StatCardSkeleton() {
  return (
    <Card radius="sm" shadow="sm" padding="lg" withBorder>
      <Group justify="space-between" mb="md">
        <Skeleton height={36} width={36} radius="md" />
        <Skeleton height={10} width="50%" radius="sm" />
      </Group>
      <Skeleton height={28} width="35%" radius="sm" />
    </Card>
  );
}
