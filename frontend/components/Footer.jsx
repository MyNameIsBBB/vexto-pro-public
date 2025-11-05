"use client";
import Link from "next/link";

export default function Footer() {
    const year = new Date().getFullYear();
    return (
        <footer className="mt-16 pt-8 border-t border-white/10 text-center">
            <div className="text-sm text-gray-400">
                <p className="text-sm text-white/50">
                    © 2024 Vexto - All rights reserved
                </p>{" "}
                <Link
                    href="/feedback"
                    className="text-white/80 hover:text-white underline underline-offset-4"
                >
                    ส่งฟีดแบ็ก
                </Link>
            </div>
        </footer>
    );
}
