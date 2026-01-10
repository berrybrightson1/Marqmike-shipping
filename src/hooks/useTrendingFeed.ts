import { useState, useEffect } from 'react';

// Mock Data mimicking 1688 API response structure
const mockData = [
    {
        id: '1',
        title: "Smart Bluetooth Speaker with LED Lights, Portable Waterproof",
        image: "https://placehold.co/400x400/2563eb/ffffff?text=Speaker",
        price: { amount: 45.00, currency: "CNY" },
        moq: 10,
        sold: 1250,
        url: "https://1688.com/item/1",
        supplier: "Shenzhen Tech"
    },
    {
        id: '2',
        title: "Women's Summer Floral Dress, Chiffon Maxi",
        image: "https://placehold.co/400x400/db2777/ffffff?text=Dress",
        price: { amount: 32.50, currency: "CNY" },
        moq: 2,
        sold: 5400,
        url: "https://1688.com/item/2",
        supplier: "Guangzhou Fashion"
    },
    {
        id: '3',
        title: "Stainless Steel Insulated Water Bottle, 500ml",
        image: "https://placehold.co/400x400/0ea5e9/ffffff?text=Bottle",
        price: { amount: 12.00, currency: "CNY" },
        moq: 50,
        sold: 8900,
        url: "https://1688.com/item/3",
        supplier: "Yiwu Commodities"
    },
    {
        id: '4',
        title: "Wireless Earbuds with Charging Case, Noise Cancelling",
        image: "https://placehold.co/400x400/4f46e5/ffffff?text=Earbuds",
        price: { amount: 68.00, currency: "CNY" },
        moq: 5,
        sold: 3200,
        url: "https://1688.com/item/4",
        supplier: "Shenzhen Audio"
    },
    {
        id: '5',
        title: "Portable Mini Fan, USB Rechargeable",
        image: "https://placehold.co/400x400/ea580c/ffffff?text=Fan",
        price: { amount: 8.50, currency: "CNY" },
        moq: 20,
        sold: 15000,
        url: "https://1688.com/item/5",
        supplier: "Ningbo Electronics"
    },
    {
        id: '6',
        title: "Ceramic Coffee Mug Set, Nordic Style",
        image: "https://placehold.co/400x400/64748b/ffffff?text=Mug",
        price: { amount: 18.00, currency: "CNY" },
        moq: 12,
        sold: 850,
        url: "https://1688.com/item/6",
        supplier: "Chaozhou Ceramics"
    },
    {
        id: '7',
        title: "Men's Leather Belt, Automatic Buckle",
        image: "https://placehold.co/400x400/1e293b/ffffff?text=Belt",
        price: { amount: 25.00, currency: "CNY" },
        moq: 10,
        sold: 2100,
    },
    {
        id: '1688_006',
        title: "Women's Fashion Handbag PU Leather",
        image: "https://cbu01.alicdn.com/img/ibank/O1CN01w5i8R61R4W9X7o8yS_!!2214466966649-0-cib.jpg",
        price: { currency: "CNY", amount: 25.0 },
        moq: 5,
        sold: 3200,
        supplier: "Baigou Bags",
        url: "https://detail.1688.com/offer/..."
    },
    {
        id: '1688_007',
        title: "LED Strip Lights 5m RGB with Remote",
        image: "https://cbu01.alicdn.com/img/ibank/O1CN01z5i8R61R4W9X7o8yS_!!2214466966649-0-cib.jpg",
        price: { currency: "CNY", amount: 12.0 },
        moq: 10,
        sold: 6700,
        supplier: "Zhongshan Lighting",
        url: "https://detail.1688.com/offer/..."
    },
    {
        id: '1688_008',
        title: "Stainless Steel Thermal Water Bottle",
        image: "https://cbu01.alicdn.com/img/ibank/O1CN01x5i8R61R4W9X7o8yS_!!2214466966649-0-cib.jpg",
        price: { currency: "CNY", amount: 15.0 },
        moq: 50,
        sold: 1500,
        supplier: "Yongkang Metal",
        url: "https://detail.1688.com/offer/..."
    }
];

import { getTrendingItems } from '@/app/actions/trending';

// ... (keep mockData variable for fallback)

export function useTrendingFeed() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getTrendingItems();
                if (res.success && res.data && res.data.length > 0) {
                    setData(res.data);
                } else {
                    // Fallback to mock data if DB is empty
                    setData(mockData);
                }
            } catch (error) {
                console.error("Failed to fetch trending feed", error);
                setData(mockData);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { data, loading };
}
