"use client";

import { createTheme, MantineColorsTuple } from "@mantine/core";

// Paleta rojo MCV (del logo)
const mcvRed: MantineColorsTuple = [
  "#ffeaed", // 0 - más claro
  "#ffd5da", // 1
  "#ffabb5", // 2
  "#ff8190", // 3
  "#f5576c", // 4
  "#C41E3A", // 5 - base (rojo del logo)
  "#b01a34", // 6
  "#9B1830", // 7
  "#87152a", // 8
  "#731224", // 9 - más oscuro
];

export const theme = createTheme({
  primaryColor: "mcvRed",
  colors: {
    mcvRed,
  },
  fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
  headings: {
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
    fontWeight: "600",
  },
  radius: {
    xs: "0.25rem",
    sm: "0.375rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
  },
  defaultRadius: "sm",
  components: {
    Button: {
      defaultProps: {
        radius: "sm",
      },
    },
    Card: {
      defaultProps: {
        radius: "sm",
        shadow: "sm",
      },
    },
    TextInput: {
      defaultProps: {
        radius: "sm",
      },
    },
    Container: {
      defaultProps: {
        size: "xl",
      },
    },
  },
});
