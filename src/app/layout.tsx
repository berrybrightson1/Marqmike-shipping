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
              <Toaster
                position="top-center"
                toastOptions={{
                  unstyled: true,
                  classNames: {
                    toast: "bg-black/90 backdrop-blur-md border border-white/10 shadow-2xl rounded-full px-6 py-3 flex items-center gap-3 w-fit min-w-[300px] mx-auto mb-6",
                    title: "text-white font-bold text-sm",
                    description: "text-white/60 text-xs font-medium",
                    actionButton: "bg-white text-black hover:bg-slate-200",
                    cancelButton: "bg-white/10 text-white hover:bg-white/20",
                    error: "bg-red-950/90 border-red-500/20 text-red-200",
                    success: "bg-black/90 border-white/10 text-white",
                    warning: "bg-orange-950/90 border-orange-500/20 text-orange-200",
                    info: "bg-blue-950/90 border-blue-500/20 text-blue-200",
                  }
                }}
              />
            </CartProvider>
          </CurrencyProvider>
        </div>
      </body>
    </html>
  );
}
