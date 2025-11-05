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
