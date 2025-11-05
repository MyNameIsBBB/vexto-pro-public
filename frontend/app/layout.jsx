import "./globals.css";
import { Prompt, Kanit, Sarabun } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/contexts/ToastContext";

const prompt = Prompt({
    weight: ["300", "400", "500", "600", "700"],
    subsets: ["thai", "latin"],
    display: "swap",
    variable: "--font-prompt",
});

const kanit = Kanit({
    weight: ["300", "400", "500", "600", "700"],
    subsets: ["thai", "latin"],
    display: "swap",
    variable: "--font-kanit",
});

const sarabun = Sarabun({
    weight: ["300", "400", "500", "600", "700"],
    subsets: ["thai", "latin"],
    display: "swap",
    variable: "--font-sarabun",
});

export const metadata = {
    title: "Vexto",
    description: "Build your custom profile page",
    icons: {
        icon: "/favicon.ico",
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="th">
            <body
                className={`min-h-screen max-w-5xl mx-auto bg-brand-bg text-gray-100 ${prompt.variable} ${kanit.variable} ${sarabun.variable} font-sans scroll-smooth overflow-y-auto`}
            >
                <AuthProvider>
                    <ToastProvider defaultPosition="top-center">
                        {children}
                    </ToastProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
