"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import { ShoppingBag, Leaf, Truck, Shield, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import ProductGrid from "@/components/shop/ProductGrid";
import { getCategoryEmoji, getCategoryImage } from "@/lib/utils";

const trustFeatures = [
  { icon: Truck, label: "Fast Delivery", desc: "Same day in your area", color: "text-emerald-600", bg: "bg-emerald-50" },
  { icon: Leaf, label: "100% Organic", desc: "Certified fresh produce", color: "text-teal-600", bg: "bg-teal-50" },
  { icon: Shield, label: "Secure Payment", desc: "SSL encrypted checkout", color: "text-violet-600", bg: "bg-violet-50" },
  { icon: Star, label: "Top Quality", desc: "Hand-picked daily", color: "text-amber-600", bg: "bg-amber-50" },
];

const categories = [
  { name: "Vegetables", color: "from-emerald-400 to-green-500" },
  { name: "Fruits", color: "from-red-400 to-rose-500" },
  { name: "Dairy", color: "from-blue-400 to-sky-500" },
  { name: "Bakery", color: "from-amber-400 to-orange-500" },
  { name: "Seafood", color: "from-cyan-400 to-teal-500" },
  { name: "Grains", color: "from-yellow-400 to-amber-500" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(180deg, #ECFDF5 0%, #FFFFFF 30%)" }}>
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-6"
              >
                <Leaf size={14} />
                Fresh from the farm, straight to you
              </motion.div>

              <h1
                className="text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Your Premium{" "}
                <span className="text-transparent bg-clip-text"
                  style={{ backgroundImage: "linear-gradient(135deg, #10B981, #059669)" }}>
                  Grocery
                </span>{" "}
                Destination
              </h1>

              <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-lg">
                Shop the freshest organic produce, dairy, and pantry staples.
                Hand-picked daily for quality you can taste — delivered to your door.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="#shop"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-2xl transition-all duration-200 shadow-xl shadow-emerald-200/50 hover:shadow-emerald-200 cursor-pointer"
                >
                  <ShoppingBag size={18} />
                  Shop Now
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-emerald-200 text-emerald-700 font-semibold rounded-2xl hover:bg-emerald-50 transition-colors cursor-pointer"
                >
                  Create Account
                </Link>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-8 mt-10 pt-10 border-t border-emerald-100">
                {[
                  { value: "500+", label: "Products" },
                  { value: "98%", label: "Satisfaction" },
                  { value: "1-day", label: "Delivery" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-2xl font-bold text-slate-900" style={{ fontFamily: "var(--font-heading)" }}>
                      {stat.value}
                    </p>
                    <p className="text-sm text-slate-500">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Hero Visual */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
              className="hidden lg:flex items-center justify-center"
            >
              <div className="relative">
                <div className="w-80 h-80 bg-gradient-to-br from-emerald-200 to-teal-200 rounded-full flex items-center justify-center">
                  <div className="text-9xl animate-float">🛒</div>
                </div>
                {/* Floating cards */}
                {[
                  { emoji: "🥦", label: "Broccoli", price: "$2.99", top: "-16px", right: "-24px", delay: 0 },
                  { emoji: "🍎", label: "Apples", price: "$4.99", bottom: "20px", left: "-40px", delay: 0.2 },
                  { emoji: "🥛", label: "Milk", price: "$3.49", top: "60%", right: "-48px", delay: 0.4 },
                ].map((card) => (
                  <motion.div
                    key={card.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + card.delay }}
                    style={{ position: "absolute", ...card as any }}
                    className="glass-card px-4 py-3 flex items-center gap-3 shadow-lg"
                  >
                    <span className="text-2xl">{card.emoji}</span>
                    <div>
                      <p className="text-xs font-semibold text-slate-900">{card.label}</p>
                      <p className="text-xs text-emerald-600 font-bold">{card.price}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-12 px-4 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {trustFeatures.map((feature) => (
              <motion.div
                key={feature.label}
                variants={itemVariants}
                className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors cursor-default"
              >
                <div className={`w-12 h-12 ${feature.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <feature.icon size={22} className={feature.color} />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm" style={{ fontFamily: "var(--font-heading)" }}>
                    {feature.label}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2
              className="text-3xl font-bold text-slate-900 mb-3"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Shop by Category
            </h2>
            <p className="text-slate-500">Explore our wide range of fresh products</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-3 md:grid-cols-6 gap-4"
          >
            {categories.map((cat) => {
              const img = getCategoryImage(cat.name);
              const emoji = getCategoryEmoji(cat.name);
              return (
                <motion.div
                  key={cat.name}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className={`group relative flex flex-col items-center justify-center gap-3 p-5 rounded-2xl bg-gradient-to-br ${cat.color} cursor-pointer shadow-md hover:shadow-xl transition-all duration-200 aspect-square overflow-hidden`}
                >
                  {img ? (
                    <Image
                      src={img}
                      alt={cat.name}
                      fill
                      className="object-cover opacity-30 group-hover:opacity-50 transition-opacity"
                    />
                  ) : (
                    <span className="text-3xl z-10">{emoji}</span>
                  )}
                  <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent z-10">
                    <p className="text-white text-sm font-bold text-center drop-shadow-lg">
                      {cat.name}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Product Grid */}
      <section id="shop" className="py-8 pb-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-8"
          >
            <div>
              <h2
                className="text-3xl font-bold text-slate-900 mb-2"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Fresh Picks Today
              </h2>
              <p className="text-slate-500">All items hand-checked for quality</p>
            </div>
          </motion.div>

          <ProductGrid />
        </div>
      </section>
    </div>
  );
}
