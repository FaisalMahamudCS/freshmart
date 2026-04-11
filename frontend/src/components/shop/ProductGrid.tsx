"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, X } from "lucide-react";
import { groceryApi } from "@/lib/api";
import ProductCard from "@/components/ui/ProductCard";

interface GroceryItem {
  id: number;
  name: string;
  description?: string;
  price: string;
  category: { id: number; name: string };
  inventory?: { stockLevel: number };
}

interface Category {
  id: number;
  name: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export default function ProductGrid() {
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [itemsRes, catsRes] = await Promise.all([
          groceryApi.getItems(),
          groceryApi.getCategories(),
        ]);
        setItems(itemsRes.data);
        setCategories(catsRes.data);
      } catch {
        // Items may require auth — show empty state
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory ? item.category?.id === selectedCategory : true;
    return matchesSearch && matchesCat;
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-slate-100 rounded-2xl h-64 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="product-search"
            type="text"
            placeholder="Search groceries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-3 rounded-2xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 text-sm transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-1.5 text-sm text-slate-500 px-2">
            <Filter size={14} /> Filter:
          </span>
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
              selectedCategory === null
                ? "bg-emerald-500 text-white shadow-sm"
                : "bg-white border border-slate-200 text-slate-700 hover:border-emerald-300"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id === selectedCategory ? null : cat.id)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-emerald-500 text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-700 hover:border-emerald-300"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-slate-500 mb-5">
        Showing <span className="font-semibold text-slate-700">{filtered.length}</span> items
        {selectedCategory && categories.find(c => c.id === selectedCategory) && (
          <> in <span className="font-semibold text-emerald-600">{categories.find(c => c.id === selectedCategory)?.name}</span></>
        )}
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-slate-600 font-medium text-lg">No items found</p>
          <p className="text-slate-400 text-sm mt-1">Try adjusting your search or filters</p>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
        >
          {filtered.map((item) => (
            <motion.div key={item.id} variants={itemVariants}>
              <ProductCard item={item} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
