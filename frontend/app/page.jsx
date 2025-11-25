"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

const BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001/api";

export default function HomePage() {
    // Auth state (only used to toggle CTA destination)
    const { isAuthenticated } = useAuth();
    const [stats, setStats] = useState({
        users: 0,
        profiles: 0,
        responseTime: "< 1 วินาที",
    });

    useEffect(() => {
        fetch(`${BASE_URL}/stats`)
            .then((res) => res.json())
            .then((data) => {
                if (data.users !== undefined) {
                    setStats(data);
                }
            })
            .catch((err) => console.error("Failed to load stats:", err));
    }, []);

    return (
        <>
            <Navbar />
            <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* background effects */}
                <div className="pointer-events-none absolute inset-0 -z-10">
                    <div
                        className="absolute -top-32 -left-32 h-[28rem] w-[28rem] rounded-full blur-[120px]"
                        style={{
                            background:
                                "radial-gradient( circle at center, rgba(124,58,237,0.35), transparent 60%)",
                        }}
                    />
                    <div
                        className="absolute -bottom-32 -right-32 h-[28rem] w-[28rem] rounded-full blur-[120px]"
                        style={{
                            background:
                                "radial-gradient( circle at center, rgba(34,211,238,0.35), transparent 60%)",
                        }}
                    />
                    {/* Removed horizontal line to avoid crossing stats section */}
                </div>

                {/* hero */}
                <section className="relative text-center py-16 md:py-20 overflow-visible">
                    {/* soft halo behind hero */}
                    <div
                        aria-hidden
                        className="absolute -z-10 left-1/2 top-2 h-72 w-[90vw] max-w-5xl -translate-x-1/2 blur-[120px]"
                        style={{
                            background:
                                "radial-gradient(50%_50%_at_50%_50%, rgba(124,58,237,0.25) 0%, rgba(34,211,238,0.2) 40%, transparent 75%)",
                            WebkitMaskImage:
                                "radial-gradient(circle at center, white 40%, transparent 75%)",
                            maskImage:
                                "radial-gradient(circle at center, white 40%, transparent 75%)",
                        }}
                    />
                    <p className="inline-flex items-center gap-2 text-xs tracking-wide uppercase text-white/70 bg-white/5 border border-white/10 rounded-full px-4 py-1.5">
                        <span
                            className="inline-block h-2 w-2 rounded-full"
                            style={{ background: "#22d3ee" }}
                        />
                        โปรไฟล์เท่ ทันสมัย สำหรับทุกคน
                    </p>
                    <h1 className="mt-6 text-5xl md:text-6xl font-extrabold leading-tight">
                        <span className="block text-white">
                            สร้างโปรไฟล์/พอร์ตโฟลิโอ
                        </span>
                        <span className="block mt-2 pb-5 bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] bg-clip-text text-transparent">
                            ทันสมัย อิสระ ไม่ยุ่งยาก ในสไตล์คุณ
                        </span>
                    </h1>
                    <p className="mt-6 text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
                        เหมาะกับวัยรุ่น ครีเอเตอร์ ร้านเล็ก ๆ
                        ไปจนถึงทุกคนที่อยากมีหน้าโปรไฟล์สวยแบบมือโปร — ปรับธีม
                        ใส่บล็อก ลิงก์ โซเชียล รูป วิดีโอ
                    </p>
                    <div className="mt-8 flex items-center justify-center gap-4">
                        <Link
                            href={isAuthenticated ? "/edit" : "/register"}
                            className="px-6 py-3.5 rounded-xl text-white font-medium shadow-lg transition hover:opacity-95 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7c3aed]/50"
                            style={{
                                background:
                                    "linear-gradient(90deg, #7c3aed 0%, #22d3ee 100%)",
                                boxShadow:
                                    "0 10px 30px rgba(124,58,237,0.25), 0 6px 18px rgba(34,211,238,0.15)",
                            }}
                        >
                            เริ่มต้นฟรี
                        </Link>
                        <Link
                            href="/examples"
                            className="px-6 py-3.5 rounded-xl border border-white/20 text-white/90 hover:border-white/40 hover:bg-white/5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                        >
                            ดูตัวอย่าง
                        </Link>
                    </div>

                    {/* subtle divider contained to hero */}
                    <div className="mx-auto mt-12 h-px w-full max-w-3xl bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                </section>

                {/* stats */}
                <section
                    className="mt-12 grid gap-6 sm:grid-cols-3"
                    aria-label="site stats"
                >
                    {[
                        {
                            label: "ผู้ใช้งาน",
                            value:
                                stats.users > 0
                                    ? stats.users.toLocaleString() + "+"
                                    : "0",
                            sub: "และเพิ่มขึ้นทุกวัน",
                        },
                        {
                            label: "โปรไฟล์ที่สร้าง",
                            value:
                                stats.profiles > 0
                                    ? stats.profiles.toLocaleString() + "+"
                                    : "0",
                            sub: "ครีเอเตอร์ ร้านค้า และบุคคลทั่วไป",
                        },
                        {
                            label: "เวลาตอบสนอง",
                            value: stats.responseTime,
                            sub: "โหลดเร็ว ใช้งานลื่นไหล",
                        },
                    ].map((s) => (
                        <div
                            key={s.label}
                            className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 hover:border-white/20 transition-all hover:-translate-y-0.5 hover:shadow-xl"
                        >
                            <div className="text-xs uppercase tracking-wide text-white/60">
                                {s.label}
                            </div>
                            <div className="mt-2 text-4xl font-extrabold text-white">
                                {s.value}
                            </div>
                            <div className="mt-1 text-sm text-white/60">
                                {s.sub}
                            </div>
                        </div>
                    ))}
                </section>

                {/* features */}
                <section className="mt-16 grid gap-5 sm:grid-cols-2">
                    {[
                        {
                            icon: "🎨",
                            title: "ธีมดาร์คโทนเท่",
                            desc: "เลือกสี Primary/Accent/Background และภาพพื้นหลังได้",
                        },
                        {
                            icon: "🧱",
                            title: "บล็อกแบบลากวาง",
                            desc: "เพิ่มข้อความ ลิงก์ รูปภาพ วิดีโอ โซเชียลง่าย ๆ",
                        },
                        {
                            icon: "⚡️",
                            title: "เร็วและลื่น",
                            desc: "Next.js + Tailwind โหลดไว ตอบสนองดี",
                        },
                        {
                            icon: "🔗",
                            title: "แชร์ง่าย",
                            desc: "URL สั้นตาม username พร้อม SEO เบื้องต้น",
                        },
                    ].map((f) => (
                        <div
                            key={f.title}
                            className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 hover:border-white/20 hover:bg-white/[0.07] transition-all hover:scale-[1.01]"
                        >
                            <div className="text-3xl mb-3" aria-hidden>
                                {f.icon}
                            </div>
                            <h3 className="font-semibold text-white text-lg">
                                {f.title}
                            </h3>
                            <p className="text-white/70 text-sm mt-2 leading-relaxed">
                                {f.desc}
                            </p>
                        </div>
                    ))}
                </section>

                {/* streamer preview */}
                <section className="mt-20 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent overflow-hidden backdrop-blur-sm">
                    <div className="grid gap-8 md:grid-cols-2 p-8 md:p-10">
                        <div className="flex flex-col justify-center">
                            <p className="inline-flex items-center gap-2 text-xs tracking-wide uppercase text-white/70 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 w-max">
                                <span
                                    className="inline-block h-2 w-2 rounded-full"
                                    style={{ background: "#22d3ee" }}
                                />
                                เหมาะกับครีเอเตอร์
                            </p>
                            <h3 className="mt-4 text-3xl font-bold text-white leading-snug">
                                โชว์ตัวตนแบบสวย เท่ และคลิกเดียวถึงทุกช่อง
                            </h3>
                            <ul className="mt-5 space-y-3 text-white/80">
                                <li className="flex items-start gap-3">
                                    <span className="text-brand-accent mt-0.5">
                                        ✓
                                    </span>
                                    <span>
                                        ปุ่มลิงก์ไป
                                        Twitch/YouTube/Discord/Coffee/Tip
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-brand-accent mt-0.5">
                                        ✓
                                    </span>
                                    <span>
                                        โชว์วิดีโอไฮไลต์/คลิปเด่นได้ทันที
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-brand-accent mt-0.5">
                                        ✓
                                    </span>
                                    <span>
                                        ปรับธีม/พื้นหลังให้เข้ากับแบรนด์คุณ
                                    </span>
                                </li>
                            </ul>
                            <div className="mt-6 flex gap-3">
                                <Link
                                    href="/examples"
                                    className="px-6 py-3 rounded-xl text-white shadow-lg transition hover:opacity-95 hover:scale-105 font-medium"
                                    style={{ background: "#7c3aed" }}
                                >
                                    ดูตัวอย่าง
                                </Link>
                                <Link
                                    href="/register"
                                    className="px-6 py-3 rounded-xl border border-white/20 text-white/90 hover:border-white/40 hover:bg-white/5 transition-all"
                                >
                                    เริ่มต้นฟรี
                                </Link>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="relative aspect-[16/10] rounded-2xl border border-white/10 bg-black/40 overflow-hidden">
                                {/* backdrop */}
                                <div className="absolute inset-0 bg-gradient-to-br from-[#7c3aed]/30 via-transparent to-[#22d3ee]/30" />
                                <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_70%_30%,rgba(124,58,237,0.25)_0,rgba(124,58,237,0.18)_40%,rgba(124,58,237,0.08)_60%,transparent_75%)]" />
                                {/* soft vignette */}
                                <div className="pointer-events-none absolute inset-0 [box-shadow:inset_0_0_120px_rgba(0,0,0,0.35)]" />

                                {/* faux header */}
                                <div className="absolute top-0 inset-x-0 flex items-center justify-between p-3">
                                    <div className="flex items-center gap-3">
                                        <div className="h-9 w-9 rounded-full ring-2 ring-white/20 overflow-hidden">
                                            <img
                                                src="https://i.pravatar.cc/80?img=12"
                                                alt="avatar"
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <div className="text-white font-semibold leading-tight">
                                                peeratus-streamer
                                            </div>
                                            <div className="text-xs text-white/70">
                                                Valorant • Variety
                                            </div>
                                        </div>
                                    </div>
                                    <div className="inline-flex items-center gap-2 rounded-full bg-red-500/20 text-red-300 px-3 py-1 text-xs">
                                        <span className="h-2 w-2 rounded-full bg-red-400 animate-pulse" />{" "}
                                        Live
                                    </div>
                                </div>

                                {/* faux body blocks */}
                                <div className="absolute inset-x-0 bottom-0 p-4">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="rounded-xl2 border border-white/15 bg-white/5 p-3">
                                            <div className="text-xs text-white/60">
                                                ลิงก์หลัก
                                            </div>
                                            <div className="mt-1 font-semibold">
                                                twitch.tv/peeratus
                                            </div>
                                        </div>
                                        <div className="rounded-xl2 border border-white/15 bg-white/5 p-3">
                                            <div className="text-xs text-white/60">
                                                YouTube
                                            </div>
                                            <div className="mt-1 font-semibold">
                                                ไฮไลต์ล่าสุด ▶︎
                                            </div>
                                        </div>
                                        <div className="rounded-xl2 border border-white/15 bg-white/5 p-3 col-span-2">
                                            <div className="text-xs text-white/60">
                                                เกี่ยวกับ
                                            </div>
                                            <div className="mt-1 text-sm">
                                                สวัสดี! ผม peeratus
                                                สตรีมเกมแบบสนุก ๆ
                                                ทุกคืนศุกร์-อาทิตย์
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA bottom */}
                <section className="text-center py-16">
                    <h2 className="text-3xl md:text-4xl font-bold">
                        พร้อมจะเริ่มโปรไฟล์ของคุณแล้วหรือยัง?
                    </h2>
                    <p className="mt-4 text-white/70 max-w-xl mx-auto">
                        ไม่มีค่าใช้จ่าย เริ่มต้นใช้งานได้ทันที
                    </p>
                    <div className="mt-6 flex items-center justify-center gap-4">
                        <Link
                            href={isAuthenticated ? "/edit" : "/register"}
                            className="px-6 py-3.5 rounded-xl text-white font-medium shadow-lg transition hover:opacity-95 hover:scale-105"
                            style={{ background: "#7c3aed" }}
                        >
                            สมัครและเริ่มสร้างเลย
                        </Link>
                        <Link
                            href="/login"
                            className="px-6 py-3.5 rounded-xl border border-white/20 text-white/90 hover:border-white/40 hover:bg-white/5 transition-all"
                        >
                            มีบัญชีแล้ว? ล็อกอิน
                        </Link>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
