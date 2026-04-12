import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: string | number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(price));
}

export function getInitials(email: string): string {
  return email.substring(0, 2).toUpperCase();
}

export function getCategoryEmoji(name: string): string {
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
}

export function getCategoryImage(name: string): string | null {
  const lower = name.toLowerCase();
  if (lower.includes("vegetable") || lower.includes("veggie")) return "/images/categories/vegetables.png";
  if (lower.includes("fruit")) return "/images/categories/fruits.png";
  if (lower.includes("dairy") || lower.includes("milk")) return "/images/categories/dairy.png";
  if (lower.includes("bakery") || lower.includes("bread")) return "/images/categories/bakery.png";
  if (lower.includes("meat") || lower.includes("poultry")) return "/images/categories/meat.png";
  if (lower.includes("seafood") || lower.includes("fish")) return "/images/categories/seafood.png";
  
  // High-quality photography placeholders for missing category assets
  if (lower.includes("snacks")) return "https://images.unsplash.com/photo-1599490659213-e2b9527bb087?q=80&w=800&auto=format&fit=crop";
  if (lower.includes("beverages")) return "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=800&auto=format&fit=crop";
  if (lower.includes("frozen")) return "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=800&auto=format&fit=crop";
  if (lower.includes("grains") || lower.includes("cereals")) return "https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=800&auto=format&fit=crop";
  if (lower.includes("organic")) return "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800&auto=format&fit=crop";

  return null;
}
