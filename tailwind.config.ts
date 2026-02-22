import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#020202", // Deepest cinematic black
                surface: "#080808", // Slightly lighter for cards
                primary: {
                    DEFAULT: "#D4AF37", // Metallic Gold
                    light: "#E5C55D",
                    dark: "#AA8C2C",
                },
                secondary: "#1A1A1A", // Dark gray accents
                text: {
                    primary: "#FFFFFF",
                    secondary: "#A0A0A0",
                    muted: "#505050",
                }
            },
            fontFamily: {
                serif: ["var(--font-cormorant)", "serif"],
                sans: ["var(--font-outfit)", "sans-serif"],
            },
            letterSpacing: {
                title: "-0.04em",
                editorial: "0.2em",
                widest: "0.4em", // For true luxury ultra-wide tracking
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gold-gradient": "linear-gradient(135deg, #D4AF37 0%, #F3DFA2 50%, #D4AF37 100%)",
            },
            boxShadow: {
                'premium': '0 40px 80px -20px rgba(0, 0, 0, 0.5)',
                'glow': '0 0 30px rgba(255, 255, 255, 0.05)',
            },
            keyframes: {
                shimmer: {
                    "100%": { transform: "translateX(100%)" },
                },
            },
            animation: {
                shimmer: "shimmer 2s infinite",
            },
        },
    },
    plugins: [],
};
export default config;



