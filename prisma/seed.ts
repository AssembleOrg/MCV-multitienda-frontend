import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { createClient } from "@supabase/supabase-js";

const connectionString =
  process.env.DIRECT_URL || process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL or DIRECT_URL required");

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // ============================================
  // Store Configuration
  // ============================================
  const store = await prisma.multitienda_store.upsert({
    where: { id: "store-1" },
    update: {},
    create: {
      id: "store-1",
      name: "MCV Multitienda",
      description: "Tu tienda online de confianza",
      phone: "11 1234-5678",
      email: "contacto@mcv.com",
      instagram: "https://instagram.com/mcvmultitienda",
      facebook: "https://facebook.com/mcvmultitienda",
      whatsapp: "https://wa.me/5491112345678",
      currency: "ARS",
      metaTitle: "MCV Multitienda - Tu tienda online",
      metaDesc:
        "Encuentra los mejores productos en Ropa, Moda, Celulares y Electrónica",
    },
  });
  console.log("Store created:", store.name);

  // ============================================
  // Admin User (create in Supabase Auth + our DB)
  // ============================================
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const adminEmail = "admin@mcv.com";
  const adminPassword = "admin123";

  // Create in Supabase Auth (service role can create users directly)
  const { data: authData, error: authError } =
    await supabaseAdmin.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true, // Skip email verification
    });

  if (authError && !authError.message.includes("already been registered")) {
    console.error("Supabase Auth error:", authError.message);
  }

  const authUserId = authData?.user?.id;

  if (authUserId) {
    const admin = await prisma.multitienda_user.upsert({
      where: { email: adminEmail },
      update: {},
      create: {
        id: authUserId, // Same ID as Supabase Auth
        email: adminEmail,
        password: "",
        name: "Admin",
        lastName: "MCV",
        role: "admin",
      },
    });
    console.log("Admin created:", admin.email, "(Supabase Auth + DB)");
  } else {
    console.log("Admin already exists in Supabase Auth, skipping DB upsert");
  }

  // ============================================
  // Categories
  // ============================================
  const categoriesData = [
    { name: "Ropa", slug: "ropa", description: "Encuentra la mejor ropa para todas las ocasiones", icon: "IconShirt", sortOrder: 1 },
    { name: "Moda", slug: "moda", description: "Accesorios y tendencias de moda", icon: "IconSparkles", sortOrder: 2 },
    { name: "Celulares", slug: "celulares", description: "Los mejores smartphones del mercado", icon: "IconDeviceMobile", sortOrder: 3 },
    { name: "Electrónica", slug: "electronica", description: "Gadgets y dispositivos electrónicos", icon: "IconDeviceLaptop", sortOrder: 4 },
  ];

  const categories = [];
  for (const cat of categoriesData) {
    const category = await prisma.multitienda_category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categories.push(category);
  }
  console.log("Categories created:", categories.length);

  // ============================================
  // Products
  // ============================================
  const productsData = [
    // ROPA
    {
      name: "Remera Oversize Negra",
      slug: "remera-oversize-negra",
      description: "Remera oversize de algodón premium. Corte moderno y cómodo para el día a día.",
      price: 15000,
      originalPrice: 18000,
      stock: 50,
      sku: "ROP-001",
      featured: true,
      categoryId: categories[0].id,
      variants: [
        { name: "Talle", type: "size", value: "S", stock: 15 },
        { name: "Talle", type: "size", value: "M", stock: 20 },
        { name: "Talle", type: "size", value: "L", stock: 10 },
        { name: "Talle", type: "size", value: "XL", stock: 5 },
      ],
    },
    {
      name: "Jean Slim Fit Azul",
      slug: "jean-slim-fit-azul",
      description: "Jean de corte slim fit en denim de alta calidad. Perfecto para cualquier ocasión.",
      price: 35000,
      stock: 30,
      sku: "ROP-002",
      featured: true,
      categoryId: categories[0].id,
      variants: [
        { name: "Talle", type: "size", value: "28", stock: 8 },
        { name: "Talle", type: "size", value: "30", stock: 10 },
        { name: "Talle", type: "size", value: "32", stock: 8 },
        { name: "Talle", type: "size", value: "34", stock: 4 },
      ],
    },
    {
      name: "Campera de Cuero Sintético",
      slug: "campera-cuero-sintetico",
      description: "Campera estilo biker en cuero sintético de alta calidad. Look urbano y moderno.",
      price: 75000,
      originalPrice: 85000,
      stock: 15,
      sku: "ROP-003",
      featured: true,
      categoryId: categories[0].id,
    },
    // MODA
    {
      name: "Gorra Snapback Negra",
      slug: "gorra-snapback-negra",
      description: "Gorra snapback con bordado premium. Ajuste perfecto para cualquier cabeza.",
      price: 12000,
      stock: 40,
      sku: "MOD-001",
      categoryId: categories[1].id,
    },
    {
      name: "Anteojos de Sol Aviador",
      slug: "anteojos-sol-aviador",
      description: "Anteojos estilo aviador con protección UV400. Marco metálico resistente.",
      price: 25000,
      originalPrice: 30000,
      stock: 25,
      sku: "MOD-002",
      featured: true,
      categoryId: categories[1].id,
    },
    {
      name: "Reloj Digital Sport",
      slug: "reloj-digital-sport",
      description: "Reloj digital resistente al agua. Múltiples funciones y diseño deportivo.",
      price: 45000,
      stock: 20,
      sku: "MOD-003",
      categoryId: categories[1].id,
    },
    // CELULARES
    {
      name: "Smartphone Pro Max 256GB",
      slug: "smartphone-pro-max-256gb",
      description: "El smartphone más potente del mercado. Cámara de 108MP, pantalla AMOLED 120Hz.",
      price: 850000,
      originalPrice: 950000,
      stock: 10,
      sku: "CEL-001",
      featured: true,
      categoryId: categories[2].id,
      variants: [
        { name: "Color", type: "color", value: "Negro", stock: 4 },
        { name: "Color", type: "color", value: "Blanco", stock: 3 },
        { name: "Color", type: "color", value: "Azul", stock: 3 },
      ],
    },
    {
      name: "Smartphone Lite 128GB",
      slug: "smartphone-lite-128gb",
      description: "Smartphone con excelente relación precio-calidad. Ideal para el uso diario.",
      price: 350000,
      stock: 25,
      sku: "CEL-002",
      featured: true,
      categoryId: categories[2].id,
      variants: [
        { name: "Color", type: "color", value: "Negro", stock: 10 },
        { name: "Color", type: "color", value: "Verde", stock: 8 },
        { name: "Color", type: "color", value: "Dorado", stock: 7 },
      ],
    },
    {
      name: "Auriculares Bluetooth Pro",
      slug: "auriculares-bluetooth-pro",
      description: "Auriculares inalámbricos con cancelación de ruido activa. 30 horas de batería.",
      price: 120000,
      originalPrice: 145000,
      stock: 35,
      sku: "CEL-003",
      featured: true,
      categoryId: categories[2].id,
    },
    // ELECTRÓNICA
    {
      name: "Tablet 10 pulgadas 64GB",
      slug: "tablet-10-pulgadas-64gb",
      description: "Tablet perfecta para entretenimiento y productividad. Pantalla Full HD.",
      price: 280000,
      stock: 15,
      sku: "ELE-001",
      featured: true,
      categoryId: categories[3].id,
    },
    {
      name: "Smartwatch Fitness",
      slug: "smartwatch-fitness",
      description: "Smartwatch con monitor de ritmo cardíaco, GPS y resistencia al agua.",
      price: 95000,
      originalPrice: 110000,
      stock: 30,
      sku: "ELE-002",
      featured: true,
      categoryId: categories[3].id,
    },
    {
      name: "Parlante Bluetooth Portátil",
      slug: "parlante-bluetooth-portatil",
      description: "Parlante portátil con sonido 360°. Resistente al agua y 12 horas de batería.",
      price: 55000,
      stock: 40,
      sku: "ELE-003",
      categoryId: categories[3].id,
    },
  ];

  for (const p of productsData) {
    const { variants, ...productData } = p;
    const product = await prisma.multitienda_product.upsert({
      where: { sku: productData.sku },
      update: {},
      create: {
        ...productData,
        originalPrice: productData.originalPrice || null,
        featured: productData.featured || false,
        variants: variants
          ? { create: variants.map((v) => ({ ...v, priceModifier: 0 })) }
          : undefined,
      },
    });
    console.log("Product created:", product.name);
  }

  // ============================================
  // Promos
  // ============================================
  const promosData = [
    { text: "3 CUOTAS SIN INTERÉS", sortOrder: 1 },
    { text: "10% OFF EN EFECTIVO", sortOrder: 2 },
    { text: "ENVÍO GRATIS +$50.000", sortOrder: 3 },
    { text: "INGRESOS SEMANALES", sortOrder: 4 },
  ];

  for (const promo of promosData) {
    await prisma.multitienda_promo.create({ data: promo });
  }
  console.log("Promos created:", promosData.length);

  // ============================================
  // Sample Campaign
  // ============================================
  await prisma.multitienda_campaign.create({
    data: {
      name: "Descuento de Bienvenida",
      code: "BIENVENIDO10",
      description: "10% de descuento en tu primera compra",
      type: "percentage",
      value: 10,
      maxDiscount: 50000,
      maxUsesPerUser: 1,
      startDate: new Date("2024-01-01"),
      endDate: new Date("2026-12-31"),
      active: true,
    },
  });
  console.log("Sample campaign created");

  // ============================================
  // Whitelisted Emails
  // ============================================
  const whitelistedEmails = [
    { email: "admin@mcv.com", role: "admin", note: "Admin principal" },
  ];

  for (const wl of whitelistedEmails) {
    await prisma.multitienda_whitelisted_email.upsert({
      where: { email: wl.email },
      update: {},
      create: wl,
    });
  }
  console.log("Whitelisted emails created:", whitelistedEmails.length);

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
