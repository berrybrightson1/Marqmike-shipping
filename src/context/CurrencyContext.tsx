"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Currency = 'USD' | 'GHS' | 'NGN' | 'RMB';

interface CurrencyContextType {
    currency: Currency;
    setCurrency: (currency: Currency) => void;
    exchangeRates: Record<Currency, number>;
    convertPrice: (amountInRMB: number, baseCurrency?: 'RMB' | 'USD') => number;
    formatPrice: (amountInRMB: number) => string;
}

const defaultRates: Record<Currency, number> = {
    USD: 0.14, // 1 RMB = 0.14 USD
    GHS: 2.17, // 1 RMB = 2.17 GHS  
    NGN: 224,  // 1 RMB = 224 NGN
    RMB: 1
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
    const [currency, setCurrency] = useState<Currency>('USD');
    const [exchangeRates] = useState<Record<Currency, number>>(defaultRates);

    // In a real app, we would fetch rates from the DB here
    useEffect(() => {
        // Placeholder for fetching settings
    }, []);

    const convertPrice = (amountInRMB: number, baseCurrency: 'RMB' | 'USD' = 'RMB') => {
        // If base is USD, first convert to RMB
        const inRMB = baseCurrency === 'USD' ? amountInRMB / defaultRates.USD : amountInRMB;
        return inRMB * exchangeRates[currency];
    };

    const formatPrice = (amountInUSD: number) => {
        const converted = convertPrice(amountInUSD, 'USD');
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
