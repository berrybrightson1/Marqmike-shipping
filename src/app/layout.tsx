import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ClerkProvider } from "@clerk/nextjs";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${sora.variable} font-sans antialiased text-sm`}>
          <CurrencyProvider>
            <CartProvider>
              {children}
              <Toaster richColors position="top-center" />
            </CartProvider>
          </CurrencyProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
