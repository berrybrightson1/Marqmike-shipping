import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { CartProvider } from "@/context/CartContext";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
});

export const metadata: Metadata = {
  title: "Marqmike Shipping",
  description: "Global Logistics Partner",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sora.variable} font-sans antialiased text-sm`} suppressHydrationWarning>
        <div className="w-full min-h-screen overflow-x-hidden no-scrollbar">
          <CurrencyProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </CurrencyProvider>
        </div>
        <Toaster
          position="top-center"
          toastOptions={{
            unstyled: true,
            classNames: {
              toast: "bg-[#0a0a0a] border border-white/10 shadow-2xl rounded-2xl px-6 py-4 flex items-center gap-3 w-auto max-w-[90vw] mb-6",
              title: "text-white font-bold text-sm",
              description: "text-white/60 text-xs font-medium",
              actionButton: "bg-white text-black hover:bg-slate-200",
              cancelButton: "bg-white/10 text-white hover:bg-white/20",
              error: "bg-[#1a0505] border-red-900/50 text-red-200",
              success: "bg-[#051a05] border-green-900/50 text-green-200",
              warning: "bg-[#1a1205] border-orange-900/50 text-orange-200",
              info: "bg-[#050f1a] border-blue-900/50 text-blue-200",
            }
          }}
        />
      </body>
    </html>
  );
}
