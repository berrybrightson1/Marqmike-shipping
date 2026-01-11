"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { logClientAction } from "@/app/actions/audit";

interface CartItem {
    id: string | number;
    name: string;
    price: number | string;
    image: string;
    quantity: number;
    url?: string;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string | number) => void;
    clearCart: () => void;
    totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);

    // Load cart from local storage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem("marqmike_cart");
        if (savedCart) {
            try {
                // eslint-disable-next-line
                setCart(JSON.parse(savedCart));
            } catch (e) {
                console.error("Failed to parse cart", e);
            }
        }
    }, []);

    // Save cart to local storage whenever it changes
    useEffect(() => {
        localStorage.setItem("marqmike_cart", JSON.stringify(cart));
    }, [cart]);

    const addToCart = (newItem: CartItem) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.id === newItem.id);
            if (existingItem) {
                toast.success("Item quantity updated in cart");
                return prevCart.map((item) =>
                    item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }

            // Log Action
            logClientAction(
                "USER_ADD_TO_CART",
                `Added to cart: ${newItem.name} (${newItem.price})`,
                "CART",
                { itemId: newItem.id, price: newItem.price, url: newItem.url }
            );

            toast.success("Added to cart");
            return [...prevCart, { ...newItem, quantity: 1 }];
        });
    };

    const removeFromCart = (id: string | number) => {
        const itemToRemove = cart.find(i => i.id === id);

        setCart((prevCart) => prevCart.filter((item) => item.id !== id));
        toast.info("Item removed from cart");

        if (itemToRemove) {
            logClientAction(
                "USER_REMOVE_FROM_CART",
                `Removed from cart: ${itemToRemove.name}`,
                "CART",
                { itemId: id }
            );
        }
    };

    const clearCart = () => {
        setCart([]);
        toast.info("Cart cleared");
    };

    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, totalItems }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
