"use client";

import { Skeleton, Table } from "@mantine/core";

interface TableSkeletonProps {
  rows?: number;
  cols?: number;
}

export function TableSkeleton({ rows = 8, cols = 6 }: TableSkeletonProps) {
  return (
    <Table withTableBorder>
      <Table.Tbody>
        {Array.from({ length: rows }).map((_, i) => (
          <Table.Tr key={i}>
            {Array.from({ length: cols }).map((_, j) => (
              <Table.Td key={j}>
                <Skeleton height={14} radius="sm" width={j === 0 ? "80%" : "60%"} />
              </Table.Td>
            ))}
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
}
