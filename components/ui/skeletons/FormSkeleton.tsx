"use client";

import { Skeleton, Stack } from "@mantine/core";

interface FormSkeletonProps {
  fields?: number;
}

export function FormSkeleton({ fields = 6 }: FormSkeletonProps) {
  return (
    <Stack gap="md">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i}>
          <Skeleton height={12} width="20%" radius="sm" mb={6} />
          <Skeleton height={36} radius="sm" />
        </div>
      ))}
      <Skeleton height={36} width={120} radius="sm" mt="sm" />
    </Stack>
  );
}
