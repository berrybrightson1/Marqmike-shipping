"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BANNERS = [
    "/Banners.webp",
    "/Banners 2.webp"
];

export default function BannerSlider() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % BANNERS.length);
        }, 2000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="w-full flex flex-col items-center mb-8">

            <div className="relative w-full rounded-3xl overflow-hidden grid grid-cols-1 grid-rows-1">
                <AnimatePresence mode="popLayout">
                    <motion.img
                        key={currentIndex}
                        src={BANNERS[currentIndex]}
                        alt="Marqmike Shipping"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="col-start-1 row-start-1 w-full h-auto object-contain"
                    />
                </AnimatePresence>
            </div>

            {/* Indicators */}
            <div className="flex gap-2 mt-4">
                {BANNERS.map((_, index) => (
                    <div
                        key={index}
                        className={`h-1.5 rounded-full transition-all duration-300 ${index === currentIndex ? "w-6 bg-white" : "w-1.5 bg-white/30"}`}
                    />
                ))}
            </div>
        </div>
    );
}
