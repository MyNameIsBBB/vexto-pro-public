"use client";
import { useState } from "react";
import { api, setToken } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function LoginPage() {
    const [emailOrUsername, setEmailOrUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function onSubmit(e) {
        e.preventDefault();
        setError("");
        try {
            const res = await api.post("/auth/login", {
                emailOrUsername,
                password,
            });
            setToken(res.token);
            window.location.href = "/edit";
        } catch (e) {
            setError(e.message || "ล็อกอินไม่สำเร็จ");
        }
    }

    function loginWithDiscord() {
        const base =
            process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001/api";
        const redirectUri = `${window.location.origin}/auth/discord/callback`;
        const url = `${base}/auth/discord/start?redirect_uri=${encodeURIComponent(
            redirectUri
        )}`;
        window.location.href = url;
    }

    return (
        <>
            <Navbar />
            <main className="min-h-[70vh] grid place-items-center py-8">
                <div className="w-full max-w-md">
                    <div className="mb-8 text-center">
                        {/* Page title only, brand is in Navbar */}
                        <h1 className="mt-4 text-2xl font-semibold text-white">
                            เข้าสู่ระบบ
                        </h1>
                        <p className="mt-2 text-white/70">
                            กลับมาสร้างโปรไฟล์ของคุณต่อเลย
                        </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 shadow-xl">
                        <form onSubmit={onSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-1.5">
                                    อีเมล หรือ ยูสเซอร์เนม
                                </label>
                                <input
                                    className="mt-1 w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-[#22d3ee]/60 focus:ring-2 focus:ring-[#22d3ee]/20 transition-all"
                                    placeholder="you@example.com หรือ username"
                                    value={emailOrUsername}
                                    onChange={(e) =>
                                        setEmailOrUsername(e.target.value)
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-1.5">
                                    รหัสผ่าน
                                </label>
                                <input
                                    type="password"
                                    className="mt-1 w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-[#22d3ee]/60 focus:ring-2 focus:ring-[#22d3ee]/20 transition-all"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />
                            </div>
                            {error && (
                                <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                                    {error}
                                </p>
                            )}
                            <button
                                className="w-full px-4 py-3 rounded-xl text-white font-medium shadow-lg transition hover:opacity-90 hover:scale-[1.02]"
                                style={{ background: "#7c3aed" }}
                            >
                                ล็อกอิน
                            </button>
                        </form>
                        <div className="my-4 flex items-center gap-4">
                            <div className="h-px bg-white/10 flex-1" />
                            <div className="text-white/50 text-sm">หรือ</div>
                            <div className="h-px bg-white/10 flex-1" />
                        </div>
                        <button
                            onClick={loginWithDiscord}
                            className="w-full px-4 py-3 rounded-xl text-white font-medium border border-white/15 bg-white/5 hover:bg-white/10 transition"
                        >
                            เข้าสู่ระบบด้วย Discord
                        </button>
                        <div className="mt-6 text-center text-sm text-white/80">
                            ยังไม่มีบัญชี?{" "}
                            <Link
                                href="/register"
                                className="text-[#22d3ee] hover:underline font-medium"
                            >
                                สมัครสมาชิก
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
