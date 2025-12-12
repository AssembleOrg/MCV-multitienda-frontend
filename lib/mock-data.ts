import type { Product, Category } from "@/types";

// Categorías de la tienda
export const categories: Category[] = [
  {
    id: "ropa",
    name: "Ropa",
    slug: "ropa",
    description: "Encuentra la mejor ropa para todas las ocasiones",
    icon: "IconShirt",
  },
  {
    id: "moda",
    name: "Moda",
    slug: "moda",
    description: "Accesorios y tendencias de moda",
    icon: "IconSparkles",
  },
  {
    id: "celulares",
    name: "Celulares",
    slug: "celulares",
    description: "Los mejores smartphones del mercado",
    icon: "IconDeviceMobile",
  },
  {
    id: "electronica",
    name: "Electrónica",
    slug: "electronica",
    description: "Gadgets y dispositivos electrónicos",
    icon: "IconDeviceLaptop",
  },
];

// Productos de ejemplo
export const products: Product[] = [
  // ROPA
  {
    id: "1",
    name: "Remera Oversize Negra",
    slug: "remera-oversize-negra",
    description:
      "Remera oversize de algodón premium. Corte moderno y cómodo para el día a día.",
    price: 15000,
    originalPrice: 18000,
    images: ["/images/products/remera-1.jpg"],
    category: categories[0],
    stock: 50,
    sku: "ROP-001",
    featured: true,
    variants: [
      { id: "v1", name: "Talle", type: "size", value: "S", stock: 15 },
      { id: "v2", name: "Talle", type: "size", value: "M", stock: 20 },
      { id: "v3", name: "Talle", type: "size", value: "L", stock: 10 },
      { id: "v4", name: "Talle", type: "size", value: "XL", stock: 5 },
    ],
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    name: "Jean Slim Fit Azul",
    slug: "jean-slim-fit-azul",
    description:
      "Jean de corte slim fit en denim de alta calidad. Perfecto para cualquier ocasión.",
    price: 35000,
    images: ["/images/products/jean-1.jpg"],
    category: categories[0],
    stock: 30,
    sku: "ROP-002",
    featured: true,
    variants: [
      { id: "v5", name: "Talle", type: "size", value: "28", stock: 8 },
      { id: "v6", name: "Talle", type: "size", value: "30", stock: 10 },
      { id: "v7", name: "Talle", type: "size", value: "32", stock: 8 },
      { id: "v8", name: "Talle", type: "size", value: "34", stock: 4 },
    ],
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
  },
  {
    id: "3",
    name: "Campera de Cuero Sintético",
    slug: "campera-cuero-sintetico",
    description:
      "Campera estilo biker en cuero sintético de alta calidad. Look urbano y moderno.",
    price: 75000,
    originalPrice: 85000,
    images: ["/images/products/campera-1.jpg"],
    category: categories[0],
    stock: 15,
    sku: "ROP-003",
    featured: true,
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
  },

  // MODA (Accesorios)
  {
    id: "4",
    name: "Gorra Snapback Negra",
    slug: "gorra-snapback-negra",
    description:
      "Gorra snapback con bordado premium. Ajuste perfecto para cualquier cabeza.",
    price: 12000,
    images: ["/images/products/gorra-1.jpg"],
    category: categories[1],
    stock: 40,
    sku: "MOD-001",
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "5",
    name: "Anteojos de Sol Aviador",
    slug: "anteojos-sol-aviador",
    description:
      "Anteojos estilo aviador con protección UV400. Marco metálico resistente.",
    price: 25000,
    originalPrice: 30000,
    images: ["/images/products/anteojos-1.jpg"],
    category: categories[1],
    stock: 25,
    sku: "MOD-002",
    featured: true,
    createdAt: new Date("2024-01-25"),
    updatedAt: new Date("2024-01-25"),
  },
  {
    id: "6",
    name: "Reloj Digital Sport",
    slug: "reloj-digital-sport",
    description:
      "Reloj digital resistente al agua. Múltiples funciones y diseño deportivo.",
    price: 45000,
    images: ["/images/products/reloj-1.jpg"],
    category: categories[1],
    stock: 20,
    sku: "MOD-003",
    createdAt: new Date("2024-02-05"),
    updatedAt: new Date("2024-02-05"),
  },

  // CELULARES
  {
    id: "7",
    name: "Smartphone Pro Max 256GB",
    slug: "smartphone-pro-max-256gb",
    description:
      "El smartphone más potente del mercado. Cámara de 108MP, pantalla AMOLED 120Hz.",
    price: 850000,
    originalPrice: 950000,
    images: ["/images/products/celular-1.jpg"],
    category: categories[2],
    stock: 10,
    sku: "CEL-001",
    featured: true,
    variants: [
      { id: "v9", name: "Color", type: "color", value: "Negro", stock: 4 },
      { id: "v10", name: "Color", type: "color", value: "Blanco", stock: 3 },
      { id: "v11", name: "Color", type: "color", value: "Azul", stock: 3 },
    ],
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2024-02-10"),
  },
  {
    id: "8",
    name: "Smartphone Lite 128GB",
    slug: "smartphone-lite-128gb",
    description:
      "Smartphone con excelente relación precio-calidad. Ideal para el uso diario.",
    price: 350000,
    images: ["/images/products/celular-2.jpg"],
    category: categories[2],
    stock: 25,
    sku: "CEL-002",
    featured: true,
    variants: [
      { id: "v12", name: "Color", type: "color", value: "Negro", stock: 10 },
      { id: "v13", name: "Color", type: "color", value: "Verde", stock: 8 },
      { id: "v14", name: "Color", type: "color", value: "Dorado", stock: 7 },
    ],
    createdAt: new Date("2024-02-15"),
    updatedAt: new Date("2024-02-15"),
  },
  {
    id: "9",
    name: "Auriculares Bluetooth Pro",
    slug: "auriculares-bluetooth-pro",
    description:
      "Auriculares inalámbricos con cancelación de ruido activa. 30 horas de batería.",
    price: 120000,
    originalPrice: 145000,
    images: ["/images/products/auriculares-1.jpg"],
    category: categories[2],
    stock: 35,
    sku: "CEL-003",
    featured: true,
    createdAt: new Date("2024-01-30"),
    updatedAt: new Date("2024-01-30"),
  },

  // ELECTRÓNICA
  {
    id: "10",
    name: "Tablet 10 pulgadas 64GB",
    slug: "tablet-10-pulgadas-64gb",
    description:
      "Tablet perfecta para entretenimiento y productividad. Pantalla Full HD.",
    price: 280000,
    images: ["/images/products/tablet-1.jpg"],
    category: categories[3],
    stock: 15,
    sku: "ELE-001",
    featured: true,
    createdAt: new Date("2024-02-20"),
    updatedAt: new Date("2024-02-20"),
  },
  {
    id: "11",
    name: "Smartwatch Fitness",
    slug: "smartwatch-fitness",
    description:
      "Smartwatch con monitor de ritmo cardíaco, GPS y resistencia al agua.",
    price: 95000,
    originalPrice: 110000,
    images: ["/images/products/smartwatch-1.jpg"],
    category: categories[3],
    stock: 30,
    sku: "ELE-002",
    featured: true,
    createdAt: new Date("2024-02-25"),
    updatedAt: new Date("2024-02-25"),
  },
  {
    id: "12",
    name: "Parlante Bluetooth Portátil",
    slug: "parlante-bluetooth-portatil",
    description:
      "Parlante portátil con sonido 360°. Resistente al agua y 12 horas de batería.",
    price: 55000,
    images: ["/images/products/parlante-1.jpg"],
    category: categories[3],
    stock: 40,
    sku: "ELE-003",
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-03-01"),
  },
];

// Funciones helper para obtener datos
export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.category.slug === categorySlug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export function searchProducts(query: string): Product[] {
  const lowerQuery = query.toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.category.name.toLowerCase().includes(lowerQuery)
  );
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
