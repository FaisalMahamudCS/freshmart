import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "FreshMart — Fresh Groceries Delivered",
  description:
    "Order fresh, organic groceries online. Fast delivery, best prices, and premium quality produce at your doorstep.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#0F172A",
              color: "#F8FAFC",
              borderRadius: "12px",
              padding: "14px 20px",
              fontSize: "14px",
              fontFamily: "'Nunito Sans', sans-serif",
            },
            success: {
              iconTheme: { primary: "#10B981", secondary: "#F8FAFC" },
            },
            error: {
              iconTheme: { primary: "#EF4444", secondary: "#F8FAFC" },
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
