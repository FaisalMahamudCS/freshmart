"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Pencil, Trash2, Package, TrendingUp,
  AlertTriangle, ChevronDown, X, Save, Loader2,
  LayoutDashboard, LogOut
} from "lucide-react";
import { adminApi, groceryApi } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";
import Link from "next/link";

interface GroceryItem {
  id: number;
  name: string;
  description?: string;
  price: string;
  category: { id: number; name: string };
  inventory?: { stockLevel: number };
}

interface Category { id: number; name: string; }

interface ItemForm {
  name: string;
  description: string;
  price: string;
  categoryId: string;
  initialStock: string;
}

const emptyForm: ItemForm = { name: "", description: "", price: "", categoryId: "", initialStock: "" };

export default function AdminPage() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();

  const [items, setItems] = useState<GroceryItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GroceryItem | null>(null);
  const [form, setForm] = useState<ItemForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [stockEditing, setStockEditing] = useState<{ id: number; value: string } | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "ADMIN") {
      router.push("/login");
      return;
    }
    fetchAll();
  }, [isAuthenticated]);

  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const [itemsRes, catsRes] = await Promise.all([
        adminApi.getItems(),
        groceryApi.getCategories(),
      ]);
      setItems(itemsRes.data);
      setCategories(catsRes.data);
    } catch { toast.error("Failed to load data"); }
    finally { setIsLoading(false); }
  };

  const openAdd = () => { setEditingItem(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (item: GroceryItem) => {
    setEditingItem(item);
    setForm({
      name: item.name,
      description: item.description || "",
      price: item.price,
      categoryId: String(item.category.id),
      initialStock: String(item.inventory?.stockLevel ?? 0),
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.categoryId) {
      toast.error("Name, price, and category are required");
      return;
    }
    setSaving(true);
    try {
      if (editingItem) {
        await adminApi.updateItem(editingItem.id, {
          name: form.name,
          description: form.description || undefined,
          price: parseFloat(form.price),
          categoryId: parseInt(form.categoryId),
        });
        toast.success("Item updated!");
      } else {
        await adminApi.createItem({
          name: form.name,
          description: form.description || undefined,
          price: parseFloat(form.price),
          categoryId: parseInt(form.categoryId),
          initialStock: parseInt(form.initialStock) || 0,
        });
        toast.success("Item created!");
      }
      setModalOpen(false);
      fetchAll();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Save failed");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await adminApi.deleteItem(id);
      toast.success("Item deleted");
      fetchAll();
    } catch { toast.error("Delete failed"); }
  };

  const handleUpdateStock = async (id: number) => {
    if (!stockEditing || stockEditing.id !== id) return;
    try {
      await adminApi.updateStock(id, parseInt(stockEditing.value));
      toast.success("Stock updated!");
      setStockEditing(null);
      fetchAll();
    } catch { toast.error("Stock update failed"); }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    setAddingCategory(true);
    try {
      await adminApi.createCategory(newCategoryName.trim());
      toast.success(`Category "${newCategoryName}" added!`);
      setNewCategoryName("");
      const catsRes = await groceryApi.getCategories();
      setCategories(catsRes.data);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to add category");
    } finally { setAddingCategory(false); }
  };

  const lowStockItems = items.filter((i) => (i.inventory?.stockLevel ?? 0) <= 5);
  const outOfStock = items.filter((i) => (i.inventory?.stockLevel ?? 0) === 0);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Admin Sidebar / Top Nav */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-violet-500 rounded-xl flex items-center justify-center shadow-md shadow-violet-200">
              <LayoutDashboard size={18} className="text-white" />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-sm" style={{ fontFamily: "var(--font-heading)" }}>
                FreshMart <span className="text-violet-500">Admin</span>
              </span>
              <p className="text-xs text-slate-500 -mt-0.5">{user?.email}</p>
            </div>
          </Link>

          <div className="ml-auto flex items-center gap-3">
            <Link href="/" className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors">
              View Store
            </Link>
            <button
              onClick={() => { logout(); router.push("/login"); }}
              className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
            >
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: "Total Items", value: items.length, icon: Package, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Categories", value: categories.length, icon: TrendingUp, color: "text-violet-600", bg: "bg-violet-50" },
            { label: "Low Stock", value: lowStockItems.length, icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50" },
            { label: "Out of Stock", value: outOfStock.length, icon: X, color: "text-red-600", bg: "bg-red-50" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center`}>
                  <stat.icon size={18} className={stat.color} />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900" style={{ fontFamily: "var(--font-heading)" }}>
                {isLoading ? <span className="inline-block w-8 h-6 bg-slate-100 rounded animate-pulse" /> : stat.value}
              </p>
              <p className="text-sm text-slate-500 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Add Category */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-slate-100 p-5 mb-6 shadow-sm"
        >
          <h3 className="font-semibold text-slate-900 mb-3 text-sm" style={{ fontFamily: "var(--font-heading)" }}>
            Quick Add Category
          </h3>
          <div className="flex gap-3">
            <input
              id="new-category-input"
              type="text"
              placeholder="Category name (e.g. Vegetables, Dairy...)"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400"
            />
            <button
              id="add-category-btn"
              onClick={handleAddCategory}
              disabled={addingCategory || !newCategoryName.trim()}
              className="px-5 py-2.5 bg-violet-500 hover:bg-violet-600 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
            >
              {addingCategory ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
              Add
            </button>
          </div>
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {categories.map((c) => (
                <span key={c.id} className="text-xs px-3 py-1 bg-violet-50 text-violet-700 rounded-full border border-violet-100 font-medium">
                  {c.name}
                </span>
              ))}
            </div>
          )}
        </motion.div>

        {/* Items Table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
            <div>
              <h2 className="font-bold text-slate-900" style={{ fontFamily: "var(--font-heading)" }}>
                Grocery Items
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">{items.length} total items</p>
            </div>
            <button
              id="add-item-btn"
              onClick={openAdd}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm shadow-emerald-200 cursor-pointer"
            >
              <Plus size={15} />
              Add Item
            </button>
          </div>

          {isLoading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-3">📦</div>
              <p className="text-slate-600 font-medium">No items yet</p>
              <p className="text-slate-400 text-sm mt-1">Click "Add Item" to get started</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {["Item", "Category", "Price", "Stock", "Actions"].map((h) => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {items.map((item) => (
                    <motion.tr
                      key={item.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-slate-900 text-sm">{item.name}</p>
                          {item.description && (
                            <p className="text-xs text-slate-400 truncate max-w-[200px]">{item.description}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full font-medium">
                          {item.category?.name}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-emerald-600 text-sm">{formatPrice(item.price)}</span>
                      </td>
                      <td className="px-6 py-4">
                        {stockEditing?.id === item.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="0"
                              value={stockEditing.value}
                              onChange={(e) => setStockEditing({ id: item.id, value: e.target.value })}
                              className="w-20 px-2.5 py-1.5 rounded-lg border border-emerald-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                              autoFocus
                            />
                            <button
                              onClick={() => handleUpdateStock(item.id)}
                              className="p-1.5 bg-emerald-500 text-white rounded-lg cursor-pointer hover:bg-emerald-600"
                            >
                              <Save size={12} />
                            </button>
                            <button
                              onClick={() => setStockEditing(null)}
                              className="p-1.5 bg-slate-100 text-slate-500 rounded-lg cursor-pointer hover:bg-slate-200"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setStockEditing({ id: item.id, value: String(item.inventory?.stockLevel ?? 0) })}
                            className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
                              (item.inventory?.stockLevel ?? 0) === 0
                                ? "bg-red-50 text-red-600 hover:bg-red-100"
                                : (item.inventory?.stockLevel ?? 0) <= 5
                                  ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                                  : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            }`}
                          >
                            {item.inventory?.stockLevel ?? 0}
                            <Pencil size={10} />
                          </button>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            id={`edit-item-${item.id}`}
                            onClick={() => openEdit(item)}
                            className="p-2 rounded-lg hover:bg-blue-50 text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
                            title="Edit item"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            id={`delete-item-${item.id}`}
                            onClick={() => handleDelete(item.id, item.name)}
                            className="p-2 rounded-lg hover:bg-red-50 text-slate-500 hover:text-red-600 transition-colors cursor-pointer"
                            title="Delete item"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </main>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {modalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 30 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
                <div className="flex items-center justify-between px-7 py-5 border-b border-slate-100">
                  <div>
                    <h3 className="font-bold text-slate-900" style={{ fontFamily: "var(--font-heading)" }}>
                      {editingItem ? "Edit Item" : "Add New Item"}
                    </h3>
                    <p className="text-sm text-slate-500 mt-0.5">
                      {editingItem ? "Update grocery item details" : "Add a new grocery item to the catalog"}
                    </p>
                  </div>
                  <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl cursor-pointer">
                    <X size={18} className="text-slate-500" />
                  </button>
                </div>

                <div className="px-7 py-6 space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Item Name *</label>
                    <input
                      id="item-name-input"
                      type="text"
                      placeholder="e.g. Organic Broccoli"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                    <textarea
                      id="item-desc-input"
                      placeholder="Optional description..."
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      rows={2}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Price (USD) *</label>
                      <input
                        id="item-price-input"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        {editingItem ? "View Stock" : "Initial Stock"}
                      </label>
                      <input
                        id="item-stock-input"
                        type="number"
                        min="0"
                        placeholder="0"
                        value={form.initialStock}
                        onChange={(e) => setForm({ ...form, initialStock: e.target.value })}
                        disabled={!!editingItem}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 disabled:bg-slate-50 disabled:text-slate-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Category *</label>
                    <div className="relative">
                      <select
                        id="item-category-select"
                        value={form.categoryId}
                        onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 appearance-none"
                      >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 px-7 pb-7">
                  <button
                    onClick={() => setModalOpen(false)}
                    className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    id="save-item-btn"
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                  >
                    {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                    {editingItem ? "Save Changes" : "Add Item"}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
