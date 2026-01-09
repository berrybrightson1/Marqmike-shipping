"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { toast } from "sonner";

export interface CartItem {
    id: string;
    name: string;
    priceRMB: number;
    quantity: number;
    image?: string;
    cbm: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (product: Omit<CartItem, "quantity">, quantity?: number) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    getTotalItems: () => number;
    getTotalPrice: () => number;
    getTotalCBM: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);

    // Load cart from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem("marqmike-cart");
        if (saved) {
            try {
                setItems(JSON.parse(saved));
            } catch (error) {
                console.error("Failed to load cart:", error);
            }
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("marqmike-cart", JSON.stringify(items));
    }, [items]);

    const addToCart = (product: Omit<CartItem, "quantity">, quantity = 1) => {
        setItems(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                toast.success(`Updated ${product.name} quantity`, {
                    description: `Now ${existing.quantity + quantity} in cart`
                });
                return prev.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            toast.success(`Added to cart!`, {
                description: product.name
            });
            return [...prev, { ...product, quantity }];
        });
    };

    const removeFromCart = (productId: string) => {
        setItems(prev => prev.filter(item => item.id !== productId));
        toast.info("Removed from cart");
    };

    const updateQuantity = (productId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        setItems(prev =>
            prev.map(item =>
                item.id === productId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setItems([]);
        toast.info("Cart cleared");
    };

    const getTotalItems = () => {
        return items.reduce((sum, item) => sum + item.quantity, 0);
    };

    const getTotalPrice = () => {
        return items.reduce((sum, item) => sum + item.priceRMB * item.quantity, 0);
    };

    const getTotalCBM = () => {
        return items.reduce((sum, item) => sum + item.cbm * item.quantity, 0);
    };

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                getTotalItems,
                getTotalPrice,
                getTotalCBM,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within CartProvider");
    }
    return context;
}
