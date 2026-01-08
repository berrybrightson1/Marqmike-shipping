"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Currency = 'USD' | 'GHS' | 'NGN';

interface CurrencyContextType {
    currency: Currency;
    setCurrency: (currency: Currency) => void;
    exchangeRates: Record<Currency, number>;
    convertPrice: (amountInUSD: number) => number;
    formatPrice: (amountInUSD: number) => string;
}

const defaultRates: Record<Currency, number> = {
    USD: 1,
    GHS: 15.5,
    NGN: 1600
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
    const [currency, setCurrency] = useState<Currency>('USD');
    const [exchangeRates] = useState<Record<Currency, number>>(defaultRates);

    // In a real app, we would fetch rates from the DB here
    useEffect(() => {
        // Placeholder for fetching settings
    }, []);

    const convertPrice = (amountInUSD: number) => {
        return amountInUSD * exchangeRates[currency];
    };

    const formatPrice = (amountInUSD: number) => {
        const converted = convertPrice(amountInUSD);
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2
        }).format(converted);
    };

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, exchangeRates, convertPrice, formatPrice }}>
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
    const context = useContext(CurrencyContext);
    if (context === undefined) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
}
