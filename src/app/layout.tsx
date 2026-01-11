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
                    toast: "bg-white border border-slate-100 shadow-xl rounded-[20px] p-4 flex items-center gap-3 w-full max-w-sm",
                    title: "text-slate-800 font-bold text-sm",
                    description: "text-slate-500 text-xs font-medium",
                    actionButton: "bg-brand-blue text-white",
                    cancelButton: "bg-slate-100 text-slate-500",
                    error: "bg-white border-red-50",
                    success: "bg-white border-slate-100",
                    warning: "bg-white border-orange-50",
                    info: "bg-white border-blue-50",
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
