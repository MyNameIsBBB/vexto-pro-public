"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function ShopPage() {
    const { isAuthenticated } = useAuth();
    const [creatorItems, setCreatorItems] = useState([]);
    const [loadingCreators, setLoadingCreators] = useState(true);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const data = await api.get("/shop/creator-items");
                if (mounted) setCreatorItems(data.items || []);
            } catch (_e) {
                if (mounted) setCreatorItems([]);
            } finally {
                if (mounted) setLoadingCreators(false);
            }
        })();
        return () => {
            mounted = false;
        };
    }, []);

    return (
        <main className="pb-20">
            <Navbar />

            <section className="mt-6">
                <div className="text-center max-w-2xl mx-auto">
                    <h1 className="text-3xl font-extrabold mb-2">ร้านค้า</h1>
                    <p className="text-white/70">
                        เลือกเอฟเฟกต์และคอมโพเนนต์มาแต่งโปรไฟล์ของคุณ
                    </p>
                    <div className="mt-6 p-4 bg-purple-600/20 border border-purple-500/30 rounded-xl">
                        <p className="text-white/90 text-sm">
                            🎉 <strong>อัปเกรด Pro</strong> เพื่อปลดล็อค Premium
                            Templates, กรอบโปรไฟล์พิเศษ และฟีเจอร์อื่นๆ
                            อีกมากมาย!
                        </p>
                        <Link
                            href="/pro"
                            className="inline-block mt-3 px-6 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-medium hover:opacity-90 transition-opacity"
                        >
                            ดู Pro Plans →
                        </Link>
                    </div>
                </div>

                <div className="mt-12">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-xl font-semibold">
                            สนับสนุนนักพัฒนาครีเอเตอร์
                        </h2>
                        <Link
                            href="/developers"
                            className="text-sm text-white/70 hover:text-white/90"
                        >
                            คุณมีไอเดีย? ส่งผลงาน →
                        </Link>
                    </div>
                    {loadingCreators ? (
                        <div className="text-white/60 text-sm">
                            กำลังโหลด...
                        </div>
                    ) : creatorItems.length === 0 ? (
                        <div className="text-white/60 text-sm">
                            ยังไม่มีผลงานจากครีเอเตอร์
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {creatorItems.map((it) => (
                                <div
                                    key={it.id}
                                    className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col"
                                >
                                    <div className="h-28 rounded-xl mb-3 bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                                        {it.image ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={it.image}
                                                alt={it.title}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-2xl">✨</span>
                                        )}
                                    </div>
                                    <div className="text-xs text-white/60 mb-2">
                                        {it.tag}
                                    </div>
                                    <h3 className="font-semibold mb-1">
                                        {it.title}
                                    </h3>
                                    <p className="text-sm text-white/70 flex-1">
                                        {it.desc}
                                    </p>
                                    <div className="mt-4 flex gap-2">
                                        {(() => {
                                            const payUrl = `/pay?amount=${encodeURIComponent(
                                                it.price || 49
                                            )}&grant=${encodeURIComponent(
                                                `item:${it.id}`
                                            )}&returnUrl=%2Fshop`;
                                            const href = isAuthenticated
                                                ? payUrl
                                                : `/login?returnUrl=${encodeURIComponent(
                                                      payUrl
                                                  )}`;
                                            return (
                                                <Link
                                                    href={href}
                                                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] text-white text-sm font-medium"
                                                >
                                                    ซื้อ {it.price || 49}฿
                                                </Link>
                                            );
                                        })()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </main>
    );
}
