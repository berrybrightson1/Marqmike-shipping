/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                brand: {
                    blue: "#074eaf", // Updated Brand Blue
                    pink: "#ff1493", // Hot Pink (Deep Pink) - Adjusted to be more vibrant like the image
                    white: "#ffffff",
                },
            },
            backgroundImage: {
                'glass-gradient': 'linear-gradient(to bottom right, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.3))',
                'mesh-gradient': 'radial-gradient(at 0% 0%, rgba(0, 73, 173, 0.4) 0, transparent 50%), radial-gradient(at 100% 100%, rgba(255, 38, 155, 0.4) 0, transparent 50%)',
            },
            fontFamily: {
                sans: ['var(--font-sora)', 'sans-serif'],
            },
        },
    },
    plugins: [],
};
