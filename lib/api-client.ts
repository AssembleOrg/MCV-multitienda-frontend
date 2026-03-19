const API_BASE = "/api/v1";

async function fetcher<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  const json = await res.json();

  if (!json.success) {
    throw new Error(json.error || "Error desconocido");
  }

  return json.data;
}

// ============================================
// Public API
// ============================================
export const api = {
  // Products
  getProducts: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params)}` : "";
    return fetcher<{
      items: ProductResponse[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>(`/products${query}`);
  },

  getProduct: (slug: string) =>
    fetcher<ProductResponse>(`/products/${slug}`),

  // Categories
  getCategories: () =>
    fetcher<CategoryResponse[]>("/categories"),

  // Store config
  getStore: () => fetcher<StoreResponse>("/store"),

  // Promos
  getPromos: () =>
    fetcher<PromoResponse[]>("/promos"),

  // Campaign validation
  validateCampaign: (data: {
    code: string;
    cartTotal: number;
    productIds?: string[];
    categoryIds?: string[];
    userId?: string;
  }) =>
    fetcher<{ valid: boolean; campaign: { id: string; name: string; code: string; type: string; value: number }; discount: number }>(
      "/campaigns/validate",
      { method: "POST", body: JSON.stringify(data) },
    ),

  // Orders
  createOrder: (data: {
    items: { productId: string; quantity: number; variantIds?: string[] }[];
    contactInfo: { name: string; email: string; phone: string };
    shippingAddress?: { street: string; city: string; state: string; zipCode: string; country?: string };
    campaignCode?: string;
    notes?: string;
  }) =>
    fetcher<OrderResponse>("/orders", { method: "POST", body: JSON.stringify(data) }),

  // Auth — cookies are set by the server (httpOnly), no tokens in client
  login: (email: string, password: string) =>
    fetcher<{ user: UserResponse }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (data: { email: string; password: string; name: string; lastName?: string; phone?: string }) =>
    fetcher<{ user: UserResponse }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getMe: () => fetcher<UserResponse>("/auth/me"),

  logout: () => fetcher("/auth/logout", { method: "POST" }),
};

// ============================================
// Admin API
// ============================================
export const adminApi = {
  // Products
  getProducts: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params)}` : "";
    return fetcher<PaginatedData<ProductResponse>>(`/admin/products${query}`);
  },
  getProduct: (id: string) => fetcher<ProductResponse>(`/admin/products/${id}`),
  createProduct: (data: Record<string, unknown>) =>
    fetcher<ProductResponse>("/admin/products", { method: "POST", body: JSON.stringify(data) }),
  updateProduct: (id: string, data: Record<string, unknown>) =>
    fetcher<ProductResponse>(`/admin/products/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteProduct: (id: string) =>
    fetcher(`/admin/products/${id}`, { method: "DELETE" }),

  // Categories
  getCategories: () => fetcher<CategoryResponse[]>("/admin/categories"),
  createCategory: (data: Record<string, unknown>) =>
    fetcher<CategoryResponse>("/admin/categories", { method: "POST", body: JSON.stringify(data) }),
  updateCategory: (id: string, data: Record<string, unknown>) =>
    fetcher<CategoryResponse>(`/admin/categories/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteCategory: (id: string) =>
    fetcher(`/admin/categories/${id}`, { method: "DELETE" }),

  // Campaigns
  getCampaigns: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params)}` : "";
    return fetcher<PaginatedData<CampaignResponse>>(`/admin/campaigns${query}`);
  },
  getCampaign: (id: string) => fetcher<CampaignResponse>(`/admin/campaigns/${id}`),
  createCampaign: (data: Record<string, unknown>) =>
    fetcher<CampaignResponse>("/admin/campaigns", { method: "POST", body: JSON.stringify(data) }),
  updateCampaign: (id: string, data: Record<string, unknown>) =>
    fetcher<CampaignResponse>(`/admin/campaigns/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteCampaign: (id: string) =>
    fetcher(`/admin/campaigns/${id}`, { method: "DELETE" }),

  // Promos
  getPromos: () => fetcher<PromoResponse[]>("/admin/promos"),
  createPromo: (data: Record<string, unknown>) =>
    fetcher<PromoResponse>("/admin/promos", { method: "POST", body: JSON.stringify(data) }),
  updatePromo: (id: string, data: Record<string, unknown>) =>
    fetcher<PromoResponse>(`/admin/promos/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deletePromo: (id: string) =>
    fetcher(`/admin/promos/${id}`, { method: "DELETE" }),

  // Orders
  getOrders: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params)}` : "";
    return fetcher<PaginatedData<OrderResponse>>(`/admin/orders${query}`);
  },
  getOrder: (id: string) => fetcher<OrderResponse>(`/admin/orders/${id}`),
  updateOrder: (id: string, data: Record<string, unknown>) =>
    fetcher<OrderResponse>(`/admin/orders/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  // Store
  getStore: () => fetcher<StoreResponse>("/admin/store"),
  updateStore: (data: Record<string, unknown>) =>
    fetcher<StoreResponse>("/admin/store", { method: "PUT", body: JSON.stringify(data) }),

  // Upload
  uploadFile: async (file: File, folder = "products") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const res = await fetch(`${API_BASE}/admin/upload`, {
      method: "POST",
      body: formData,
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error);
    return json.data as { url: string; key: string };
  },

  // Whitelist
  getWhitelist: () => fetcher<WhitelistResponse[]>("/admin/whitelist"),
  addWhitelist: (data: Record<string, unknown>) =>
    fetcher<WhitelistResponse>("/admin/whitelist", { method: "POST", body: JSON.stringify(data) }),
  updateWhitelist: (id: string, data: Record<string, unknown>) =>
    fetcher<WhitelistResponse>(`/admin/whitelist/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteWhitelist: (id: string) =>
    fetcher(`/admin/whitelist/${id}`, { method: "DELETE" }),

  // Audit Log
  getAuditLog: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params)}` : "";
    return fetcher<PaginatedData<AuditLogResponse>>(`/admin/audit-log${query}`);
  },
};

// ============================================
// Response Types
// ============================================
export interface ProductResponse {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice: number | null;
  stock: number;
  sku: string;
  featured: boolean;
  active: boolean;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  category: CategoryResponse;
  images: ProductImageResponse[];
  variants: ProductVariantResponse[];
}

export interface ProductImageResponse {
  id: string;
  url: string;
  alt: string | null;
  sortOrder: number;
  variantId: string | null;
}

export interface ProductVariantResponse {
  id: string;
  name: string;
  type: string;
  value: string;
  priceModifier: number | null;
  stock: number;
}

export interface CategoryResponse {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  image: string | null;
  sortOrder: number;
  active: boolean;
  _count?: { products: number };
}

export interface StoreResponse {
  id?: string;
  name: string;
  description: string | null;
  logo: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  instagram: string | null;
  facebook: string | null;
  whatsapp: string | null;
  tiktok: string | null;
  currency: string;
}

export interface PromoResponse {
  id: string;
  text: string;
  link: string | null;
  active: boolean;
  sortOrder: number;
}

export interface CampaignResponse {
  id: string;
  name: string;
  code: string;
  description: string | null;
  type: string;
  value: number;
  minPurchase: number | null;
  maxDiscount: number | null;
  maxUses: number | null;
  maxUsesPerUser: number | null;
  currentUses: number;
  startDate: string;
  endDate: string;
  active: boolean;
  categoryIds: string[];
  productIds: string[];
  _count?: { usages: number; orders: number };
}

export interface OrderResponse {
  id: string;
  status: string;
  total: number;
  subtotal: number;
  shippingCost: number;
  discount: number;
  contactName: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  user: { id: string; name: string; email: string } | null;
  items: {
    id: string;
    quantity: number;
    price: number;
    product: { id: string; name: string; sku: string };
  }[];
  campaign: { id: string; name: string; code: string } | null;
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  lastName: string | null;
  role: string;
}


export interface WhitelistResponse {
  id: string;
  email: string;
  role: string;
  note: string | null;
  active: boolean;
  createdAt: string;
}

export interface AuditLogResponse {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  changes: Record<string, unknown> | null;
  ip: string | null;
  createdAt: string;
  admin: { id: string; name: string; email: string };
}

export interface PaginatedData<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
