"use client";
import { useState } from "react";
import { api, setToken, checkUsername } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [usernameCheck, setUsernameCheck] = useState({
        checking: false,
        message: "",
        available: null,
    });

    async function handleUsernameBlur() {
        if (!username || username.length < 3) {
            setUsernameCheck({ checking: false, message: "", available: null });
            return;
        }

        setUsernameCheck({
            checking: true,
            message: "กำลังตรวจสอบ...",
            available: null,
        });

        const result = await checkUsername(username);
        setUsernameCheck({
            checking: false,
            message: result.message || "",
            available: result.available,
        });
    }

    async function onSubmit(e) {
        e.preventDefault();
        setError("");

        if (!usernameCheck.available) {
            setError("กรุณาตรวจสอบ username ก่อนสมัคร");
            return;
        }

        try {
            const res = await api.post("/auth/register", {
                email,
                username,
                password,
                displayName,
            });
            setToken(res.token);
            window.location.href = "/edit";
        } catch (e) {
            setError(e.message || "สมัครไม่สำเร็จ");
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

    function loginWithGoogle() {
        const base =
            process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001/api";
        const redirectUri = `${window.location.origin}/auth/google/callback`;
        const url = `${base}/auth/google/start?redirect_uri=${encodeURIComponent(
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
                            สมัครสมาชิก
                        </h1>
                        <p className="mt-2 text-white/70">
                            เริ่มสร้างโปรไฟล์สวย เท่ และดูเป็นมืออาชีพ
                        </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 shadow-xl">
                        <form onSubmit={onSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-1.5">
                                    อีเมล
                                </label>
                                <input
                                    className="mt-1 w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-[#22d3ee]/60 focus:ring-2 focus:ring-[#22d3ee]/20 transition-all"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-1.5">
                                    ยูสเซอร์เนม (จะเป็น URL)
                                </label>
                                <input
                                    className="mt-1 w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-[#22d3ee]/60 focus:ring-2 focus:ring-[#22d3ee]/20 transition-all"
                                    placeholder="เช่น myname หรือ myshop"
                                    value={username}
                                    onChange={(e) =>
                                        setUsername(
                                            e.target.value.toLowerCase()
                                        )
                                    }
                                    onBlur={handleUsernameBlur}
                                />
                                {usernameCheck.message && (
                                    <p
                                        className={`text-xs mt-1 ${
                                            usernameCheck.checking
                                                ? "text-gray-400"
                                                : usernameCheck.available
                                                ? "text-green-400"
                                                : "text-red-400"
                                        }`}
                                    >
                                        {usernameCheck.checking
                                            ? "⏳"
                                            : usernameCheck.available
                                            ? "✅"
                                            : "❌"}{" "}
                                        {usernameCheck.message}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-1.5">
                                    ชื่อที่แสดง
                                </label>
                                <input
                                    className="mt-1 w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-[#22d3ee]/60 focus:ring-2 focus:ring-[#22d3ee]/20 transition-all"
                                    placeholder="ชื่อที่จะโชว์ในหน้าโปรไฟล์"
                                    value={displayName}
                                    onChange={(e) =>
                                        setDisplayName(e.target.value)
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
                                สมัคร
                            </button>
                        </form>
                        <div className="my-4 flex items-center gap-4">
                            <div className="h-px bg-white/10 flex-1" />
                            <div className="text-white/50 text-sm">หรือ</div>
                            <div className="h-px bg-white/10 flex-1" />
                        </div>
                        <div className="space-y-3">
                            <button
                                onClick={loginWithDiscord}
                                className="w-full px-4 py-3 rounded-xl text-white font-medium border border-[#5865F2]/30 bg-[#5865F2]/10 hover:bg-[#5865F2]/20 transition flex items-center justify-center gap-2"
                            >
                                <svg
                                    className="w-5 h-5"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                                </svg>
                                สมัครด้วย Discord
                            </button>
                            <button
                                onClick={loginWithGoogle}
                                className="w-full px-4 py-3 rounded-xl text-white font-medium border border-white/15 bg-white/5 hover:bg-white/10 transition flex items-center justify-center gap-2"
                            >
                                <svg
                                    className="w-5 h-5"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"
                                    />
                                </svg>
                                สมัครด้วย Google
                            </button>
                        </div>
                        <div className="mt-6 text-center text-sm text-white/80">
                            มีบัญชีแล้ว?{" "}
                            <Link
                                href="/login"
                                className="text-[#22d3ee] hover:underline font-medium"
                            >
                                เข้าสู่ระบบ
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
