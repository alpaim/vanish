import type { Config } from "tailwindcss";

export default {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
            },
            minHeight: {
                "screen-patched": "min(100vh, 100dvh)",
            },
            height: {
                "screen-patched": "min(100vh, 100dvh)",
            },
        },
    },
    plugins: [],
} satisfies Config;
