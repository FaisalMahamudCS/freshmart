"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Leaf, LogIn, UserPlus, AlertCircle } from "lucide-react";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

type TabType = "login" | "register";

export default function LoginPage() {
  const [tab, setTab] = useState<TabType>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuthStore();
  const router = useRouter();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError(null);
    try {
      let res;
      if (tab === "login") {
        res = await authApi.login(data.email, data.password);
      } else {
        res = await authApi.register(data.email, data.password);
      }
      const { access_token, user } = res.data;
      login(access_token, user);
      if (user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const switchTab = (t: TabType) => {
    setTab(t);
    setError(null);
    reset();
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div
        className="hidden lg:flex w-1/2 flex-col items-center justify-center p-16 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 50%, #A7F3D0 100%)" }}
      >
        {/* Decorative circles */}
        <div className="absolute top-[-100px] right-[-100px] w-80 h-80 bg-emerald-200/30 rounded-full" />
        <div className="absolute bottom-[-60px] left-[-60px] w-60 h-60 bg-teal-200/30 rounded-full" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 text-center"
        >
          <div className="text-8xl mb-8 animate-float">🛒</div>
          <Link href="/" className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
              <span className="text-white font-bold text-2xl" style={{ fontFamily: "var(--font-heading)" }}>F</span>
            </div>
            <span className="font-bold text-3xl text-slate-900" style={{ fontFamily: "var(--font-heading)" }}>
              Fresh<span className="text-emerald-500">Mart</span>
            </span>
          </Link>
          <p className="text-slate-600 text-lg leading-relaxed max-w-xs mx-auto">
            Your premium grocery destination. Fresh, organic, and delivered with care.
          </p>

          <div className="grid grid-cols-3 gap-4 mt-10">
            {[
              { emoji: "🥦", label: "Vegetables" },
              { emoji: "🍎", label: "Fruits" },
              { emoji: "🥛", label: "Dairy" },
            ].map((item) => (
              <div key={item.label} className="glass-card p-4 text-center">
                <div className="text-2xl mb-1">{item.emoji}</div>
                <div className="text-xs text-slate-600 font-medium">{item.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center">
              <Leaf size={18} className="text-white" />
            </div>
            <span className="font-bold text-xl text-slate-900" style={{ fontFamily: "var(--font-heading)" }}>
              Fresh<span className="text-emerald-500">Mart</span>
            </span>
          </div>

          {/* Tabs */}
          <div className="flex bg-slate-100 rounded-2xl p-1 mb-8">
            {(["login", "register"] as TabType[]).map((t) => (
              <button
                key={t}
                id={`tab-${t}`}
                onClick={() => switchTab(t)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer capitalize ${
                  tab === t
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {t === "login" ? <LogIn size={15} /> : <UserPlus size={15} />}
                {t === "login" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-6">
                <h1
                  className="text-2xl font-bold text-slate-900 mb-1"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {tab === "login" ? "Welcome back!" : "Join FreshMart"}
                </h1>
                <p className="text-slate-500 text-sm">
                  {tab === "login"
                    ? "Sign in to your account to continue shopping"
                    : "Create an account to start shopping fresh"}
                </p>
              </div>

              {/* Error Alert */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mb-5 flex items-start gap-3 px-4 py-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm"
                  >
                    <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    {...register("email")}
                    className={`w-full px-4 py-3.5 rounded-2xl border text-slate-900 placeholder:text-slate-400 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-300 ${
                      errors.email
                        ? "border-red-300 bg-red-50"
                        : "border-slate-200 bg-white hover:border-slate-300 focus:border-emerald-400"
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1.5 text-xs text-red-500">{errors.email.message}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete={tab === "login" ? "current-password" : "new-password"}
                      placeholder="••••••••"
                      {...register("password")}
                      className={`w-full px-4 py-3.5 pr-12 rounded-2xl border text-slate-900 placeholder:text-slate-400 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-300 ${
                        errors.password
                          ? "border-red-300 bg-red-50"
                          : "border-slate-200 bg-white hover:border-slate-300 focus:border-emerald-400"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1.5 text-xs text-red-500">{errors.password.message}</p>
                  )}
                </div>

                {/* Submit */}
                <button
                  id="auth-submit-btn"
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-2xl transition-all duration-200 shadow-lg shadow-emerald-200/50 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 mt-2"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : tab === "login" ? (
                    <>
                      <LogIn size={17} />
                      Sign In
                    </>
                  ) : (
                    <>
                      <UserPlus size={17} />
                      Create Account
                    </>
                  )}
                </button>
              </form>

              <p className="text-center text-sm text-slate-500 mt-6">
                {tab === "login" ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={() => switchTab(tab === "login" ? "register" : "login")}
                  className="text-emerald-600 font-semibold hover:text-emerald-700 cursor-pointer"
                >
                  {tab === "login" ? "Sign up" : "Sign in"}
                </button>
              </p>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
