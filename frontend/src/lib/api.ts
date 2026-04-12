import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Inject JWT token into every request
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("freshmart_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("freshmart_token");
      localStorage.removeItem("freshmart_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ── Auth ──
export const authApi = {
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),
  register: (email: string, password: string, role: string = "USER") =>
    api.post("/auth/register", { email, password, role }),
};

// ── Grocery (Public / User) ──
export const groceryApi = {
  getItems: () => api.get("/grocery/items"),
  getCategories: () => api.get("/grocery/categories"),
};

// ── Grocery (Admin) ──
export const adminApi = {
  getItems: () => api.get("/grocery/admin/items"),
  createItem: (data: {
    name: string;
    description?: string;
    price: number;
    categoryId: number;
    initialStock?: number;
  }) => api.post("/grocery/admin/items", data),
  updateItem: (
    id: number,
    data: { name?: string; description?: string; price?: number; categoryId?: number }
  ) => api.put(`/grocery/admin/items/${id}`, data),
  deleteItem: (id: number) => api.delete(`/grocery/admin/items/${id}`),
  updateStock: (id: number, stockLevel: number) =>
    api.put(`/grocery/admin/items/${id}/stock`, { stockLevel }),
  createCategory: (name: string) =>
    api.post("/grocery/admin/categories", { name }),
};

// ── Cart ──
export const cartApi = {
  getCart: () => api.get("/cart"),
  addToCart: (groceryItemId: number, quantity: number) =>
    api.post("/cart", { groceryItemId, quantity }),
  updateQuantity: (cartItemId: number, quantity: number) =>
    api.put(`/cart/${cartItemId}`, { quantity }),
  removeItem: (cartItemId: number) => api.delete(`/cart/${cartItemId}`),
  clearCart: () => api.delete("/cart"),
};

// ── Orders ──
export const ordersApi = {
  checkout: () => api.post("/orders/checkout"),
  getOrders: () => api.get("/orders"),
  getOrder: (id: string) => api.get(`/orders/${id}`),
};

export default api;
