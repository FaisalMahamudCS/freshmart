"use client";

import { motion } from "framer-motion";
import { Plus, ShoppingCart } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";

interface GroceryItem {
  id: number;
  name: string;
  description?: string;
  price: string;
  category: { id: number; name: string };
  inventory?: { stockLevel: number };
}

const getCategoryEmoji = (name: string) => {
  const map: Record<string, string> = {
    vegetables: "🥦", veggie: "🥦", vegetable: "🥦",
    fruits: "🍎", fruit: "🍎",
    dairy: "🥛", milk: "🥛",
    bakery: "🍞", bread: "🍞",
    meat: "🥩", poultry: "🍗",
    seafood: "🐟", fish: "🐟",
    snacks: "🍿", beverages: "🧃",
    frozen: "🧊", grains: "🌾", cereals: "🌾",
    organic: "🌿",
  };
  const lower = name.toLowerCase();
  return Object.entries(map).find(([k]) => lower.includes(k))?.[1] ?? "🛒";
};

export default function ProductCard({ item }: { item: GroceryItem }) {
  const { addItem } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const inStock = (item.inventory?.stockLevel ?? 0) > 0;
  const lowStock = (item.inventory?.stockLevel ?? 0) <= 5 && inStock;

  const handleAdd = () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    addItem(item.id, 1, item.name);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group bg-white rounded-2xl border border-slate-100 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-50 transition-all duration-300 overflow-hidden cursor-pointer"
    >
      {/* Image / Icon area */}
      <div className="relative h-44 bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center overflow-hidden">
        <motion.span
          className="text-6xl select-none"
          whileHover={{ scale: 1.15, rotate: [-3, 3, 0] }}
          transition={{ duration: 0.3 }}
        >
          {getCategoryEmoji(item.category?.name ?? "")}
        </motion.span>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {!inStock && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-100 text-red-700">
              Out of Stock
            </span>
          )}
          {lowStock && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
              Low Stock
            </span>
          )}
        </div>

        {/* Category badge */}
        <div className="absolute top-3 right-3">
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-white/80 text-slate-600 backdrop-blur-sm border border-white/60">
            {item.category?.name}
          </span>
        </div>

        {/* Quick Add overlay on hover */}
        {inStock && user?.role !== "ADMIN" && (
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="absolute inset-0 bg-emerald-500/10 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <button
              id={`quick-add-${item.id}`}
              onClick={handleAdd}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-emerald-200/50 transition-colors cursor-pointer"
            >
              <Plus size={15} />
              Quick Add
            </button>
          </motion.div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3
          className="font-semibold text-slate-900 truncate mb-1"
          style={{ fontFamily: "var(--font-heading)", fontSize: "15px" }}
        >
          {item.name}
        </h3>
        {item.description && (
          <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
            {item.description}
          </p>
        )}
        {!item.description && <div className="mb-3" />}

        <div className="flex items-center justify-between">
          <div>
            <span
              className="text-xl font-bold text-emerald-600"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {formatPrice(item.price)}
            </span>
            {item.inventory && (
              <p className="text-xs text-slate-400 mt-0.5">
                {item.inventory.stockLevel} left
              </p>
            )}
          </div>

          {inStock && user?.role !== "ADMIN" ? (
            <button
              id={`add-to-cart-${item.id}`}
              onClick={handleAdd}
              className="w-10 h-10 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl flex items-center justify-center transition-all duration-200 shadow-sm shadow-emerald-200 hover:shadow-md hover:shadow-emerald-200 cursor-pointer"
              aria-label={`Add ${item.name} to cart`}
            >
              <ShoppingCart size={16} />
            </button>
          ) : (
            <span className="text-xs text-slate-400 font-medium">
              {!inStock ? "Unavailable" : ""}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
