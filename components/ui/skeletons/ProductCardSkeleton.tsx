"use client";

import { Card, Skeleton } from "@mantine/core";

export function ProductCardSkeleton() {
  return (
    <Card radius="sm" shadow="sm" padding={0} style={{ overflow: "hidden" }}>
      {/* Image area — replica el aspect-[3/4] del ProductCard */}
      <Skeleton height={0} style={{ paddingBottom: "133.33%" }} radius={0} />

      {/* Info area */}
      <div style={{ padding: "12px" }}>
        <Skeleton height={10} radius="sm" mb={8} />
        <Skeleton height={10} radius="sm" width="70%" mb={12} />
        <Skeleton height={14} radius="sm" width="40%" />
      </div>
    </Card>
  );
}
