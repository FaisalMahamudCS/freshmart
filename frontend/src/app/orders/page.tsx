"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Package, Clock, CheckCircle, XCircle, ChevronRight, ShoppingBag } from "lucide-react";
import { ordersApi } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import { formatPrice } from "@/lib/utils";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";

interface OrderItem {
  id: number;
  quantity: number;
  priceAtBooking: string;
  item: { id: number; name: string; price: string };
}

interface Order {
  id: string;
  totalPrice: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | "CANCELLED";
  createdAt: string;
  items: OrderItem[];
}

const statusConfig: Record<Order["status"], { icon: typeof Clock; color: string; bg: string; label: string }> = {
  PENDING: { icon: Clock, color: "text-amber-600", bg: "bg-amber-50", label: "Pending" },
  PROCESSING: { icon: Package, color: "text-blue-600", bg: "bg-blue-50", label: "Processing" },
  COMPLETED: { icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50", label: "Completed" },
  FAILED: { icon: XCircle, color: "text-red-600", bg: "bg-red-50", label: "Failed" },
  CANCELLED: { icon: XCircle, color: "text-slate-600", bg: "bg-slate-100", label: "Cancelled" },
};

export default function OrdersPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) { router.push("/login"); return; }
    ordersApi.getOrders()
      .then((res) => setOrders(res.data))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 pt-32 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900" style={{ fontFamily: "var(--font-heading)" }}>
              My Orders
            </h1>
            <p className="text-slate-500 mt-1">{orders.length} order{orders.length !== 1 ? "s" : ""} total</p>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl h-32 animate-pulse" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-3xl border border-slate-100">
              <div className="text-6xl mb-4">📦</div>
              <p className="text-xl font-semibold text-slate-700 mb-2">No orders yet</p>
              <p className="text-slate-400 mb-6">Your order history will appear here</p>
              <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-medium transition-colors cursor-pointer">
                <ShoppingBag size={17} />
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order, idx) => {
                const cfg = statusConfig[order.status];
                const StatusIcon = cfg.icon;
                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.06 }}
                    className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="px-6 py-5 flex items-center justify-between border-b border-slate-50">
                      <div>
                        <p className="text-xs text-slate-400 mb-1 font-mono">#{order.id.slice(0, 8).toUpperCase()}</p>
                        <p className="font-semibold text-slate-900" style={{ fontFamily: "var(--font-heading)" }}>
                          {formatPrice(order.totalPrice)}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString("en-US", {
                            year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit"
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl ${cfg.bg}`}>
                          <StatusIcon size={13} className={cfg.color} />
                          <span className={`text-xs font-semibold ${cfg.color}`}>{cfg.label}</span>
                        </div>
                        <ChevronRight size={16} className="text-slate-400" />
                      </div>
                    </div>
                    <div className="px-6 py-4">
                      <p className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">
                        {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {order.items.map((item) => (
                          <span key={item.id} className="text-xs px-3 py-1.5 bg-slate-50 border border-slate-100 text-slate-700 rounded-xl font-medium">
                            {item.item?.name} × {item.quantity}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
