/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,jsx,ts,tsx}",
        "./components/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    primary: "#3b82f6",
                    accent: "#10b981",
                    bg: "#0f172a",
                },
            },
            borderRadius: {
                xl2: "12px",
            },
            fontFamily: {
                sans: ["var(--font-prompt)", "system-ui", "sans-serif"],
            },
        },
    },
    plugins: [],
};
