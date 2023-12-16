import type { Config } from "tailwindcss"

const config: Config = {
    darkMode: "class",
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                "purple-300": "#A8A4FF",
                "purple-600": "#635FC7",
                "neutral-100": "#FFFFFF",
                "neutral-200": "#F4F7FD",
                "neutral-300": "#E4EBFA",
                "neutral-500": "#828FA3",
                "neutral-600": "#3E3F4E",
                "neutral-700": "#2B2C37",
                "neutral-800": "#20212C",
                "neutral-900": "#000112",
                "red-100": "#FF9898",
                "red-300": "#EA5555",
            },
            animation: {
                "pulse-fast":
                    "pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            },
        },
    },
    plugins: [],
}
export default config
