import { create } from "zustand";
import { persist } from "zustand/middleware";
import { cartApi, ordersApi } from "@/lib/api";
import toast from "react-hot-toast";

export interface CartItem {
  id: number;
  groceryItemId: number;
  quantity: number;
  item: {
    id: number;
    name: string;
    price: string;
    description?: string;
    category: { id: number; name: string };
    inventory: { stockLevel: number };
  };
}

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  isOpen: boolean;
  fetchCart: () => Promise<void>;
  addItem: (groceryItemId: number, quantity?: number, itemName?: string) => Promise<void>;
  updateItem: (cartItemId: number, quantity: number) => Promise<void>;
  removeItem: (cartItemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  checkout: () => Promise<void>;
  toggleCart: () => void;
  total: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      isOpen: false,

      fetchCart: async () => {
        try {
          set({ isLoading: true });
          const res = await cartApi.getCart();
          set({ items: res.data, isLoading: false });
        } catch {
          set({ isLoading: false });
        }
      },

      addItem: async (groceryItemId, quantity = 1, itemName = "Item") => {
        try {
          await cartApi.addToCart(groceryItemId, quantity);
          await get().fetchCart();
          toast.success(`${itemName} added to cart!`);
        } catch (err: any) {
          toast.error(err?.response?.data?.message || "Failed to add item");
        }
      },

      updateItem: async (cartItemId, quantity) => {
        try {
          await cartApi.updateQuantity(cartItemId, quantity);
          await get().fetchCart();
        } catch (err: any) {
          toast.error(err?.response?.data?.message || "Failed to update");
        }
      },

      removeItem: async (cartItemId) => {
        try {
          await cartApi.removeItem(cartItemId);
          await get().fetchCart();
          toast.success("Item removed from cart");
        } catch {
          toast.error("Failed to remove item");
        }
      },

      clearCart: async () => {
        try {
          await cartApi.clearCart();
          set({ items: [] });
        } catch {
          toast.error("Failed to clear cart");
        }
      },

      checkout: async () => {
        try {
          set({ isLoading: true });
          await ordersApi.checkout();
          set({ items: [], isLoading: false, isOpen: false });
          toast.success("Order placed successfully! 🎉");
        } catch (err: any) {
          set({ isLoading: false });
          toast.error(err?.response?.data?.message || "Checkout failed");
        }
      },

      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),

      total: () =>
        get().items.reduce(
          (sum, item) => sum + parseFloat(item.item.price) * item.quantity,
          0
        ),

      itemCount: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    {
      name: "freshmart-cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
