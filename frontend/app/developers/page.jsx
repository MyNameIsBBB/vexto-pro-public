"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function DevelopersPage() {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("frame");
    const [price, setPrice] = useState(49);
    const [assetUrls, setAssetUrls] = useState(""); // comma-separated URLs (png/gif)
    const [coverImage, setCoverImage] = useState("");
    const [configText, setConfigText] = useState("{}");
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!isAuthenticated) {
            const current = window.location.pathname + window.location.search;
            router.replace(`/login?returnUrl=${encodeURIComponent(current)}`);
        }
    }, [isAuthenticated, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setResult(null);
        setSubmitting(true);
        try {
            let config = {};
            try {
                config = JSON.parse(configText || "{}");
            } catch (_e) {
                throw new Error("Config ต้องเป็น JSON ที่ถูกต้อง");
            }
            const payload = {
                title,
                description,
                category,
                price: Number(price) || 49,
                assetUrls: assetUrls
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                coverImage,
                config,
            };
            const resp = await api.post("/creators/submit", payload);
            setResult({ ok: true, id: resp.id });
            setTitle("");
            setDescription("");
            setCategory("frame");
            setPrice(49);
            setAssetUrls("");
            setCoverImage("");
            setConfigText("{}");
        } catch (e) {
            setError(e?.message || "ส่งแบบฟอร์มไม่สำเร็จ");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="pb-20">
            <Navbar />
            <section className="max-w-3xl mx-auto mt-6">
                <h1 className="text-3xl font-extrabold mb-2">
                    โปรแกรมนักพัฒนาครีเอเตอร์
                </h1>
                <p className="text-white/70 mb-6">
                    ส่งไอเดียของคุณเพื่อขายเอฟเฟกต์/คอมโพเนนต์ในร้านค้า
                    เราคิดค่าคอมมิชชั่นเพียง 15% เมื่อขายได้
                </p>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                    <h2 className="font-semibold mb-4">ส่งผลงานเพื่อพิจารณา</h2>
                    <form onSubmit={handleSubmit} className="grid gap-4">
                        <div>
                            <label className="text-sm text-white/60 mb-2 block">
                                ชื่อผลงาน
                            </label>
                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-sm text-white/60 mb-2 block">
                                คำอธิบาย
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none"
                            />
                        </div>
                        <div className="grid sm:grid-cols-3 gap-4">
                            <div>
                                <label className="text-sm text-white/60 mb-2 block">
                                    หมวดหมู่
                                </label>
                                <select
                                    value={category}
                                    onChange={(e) =>
                                        setCategory(e.target.value)
                                    }
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none"
                                >
                                    <option value="frame">
                                        กรอบรูป (Frame)
                                    </option>
                                    <option value="component">
                                        คอมโพเนนต์
                                    </option>
                                    <option value="background">พื้นหลัง</option>
                                    <option value="effect">เอฟเฟกต์</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm text-white/60 mb-2 block">
                                    ราคา (บาท)
                                </label>
                                <input
                                    type="number"
                                    min={0}
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-white/60 mb-2 block">
                                    รูปหน้าปก (URL)
                                </label>
                                <input
                                    value={coverImage}
                                    onChange={(e) =>
                                        setCoverImage(e.target.value)
                                    }
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm text-white/60 mb-2 block">
                                ลิงก์ไฟล์ภาพ/ GIF (คั่นด้วย ,)
                            </label>
                            <input
                                placeholder="https://...png, https://...gif"
                                value={assetUrls}
                                onChange={(e) => setAssetUrls(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-white/60 mb-2 block">
                                Config ตำแหน่ง (JSON)
                            </label>
                            <textarea
                                value={configText}
                                onChange={(e) => setConfigText(e.target.value)}
                                rows={5}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 font-mono text-xs focus:border-purple-500 focus:outline-none"
                            />
                            <div className="text-xs text-white/50 mt-1">
                                ใส่พารามิเตอร์ตำแหน่ง/ขนาดที่อยากยึด เช่น{" "}
                                {`{"position":"top-right","offset":8,"size":"md"}`}
                            </div>
                        </div>

                        <div className="flex gap-3 mt-2">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] text-white text-sm font-medium disabled:opacity-60"
                            >
                                {submitting
                                    ? "กำลังส่ง..."
                                    : "ส่งให้ทีมงานตรวจสอบ"}
                            </button>
                            {result?.ok && (
                                <div className="text-green-400 text-sm">
                                    ส่งสำเร็จ! รอตรวจสอบก่อนขึ้นร้านค้า
                                </div>
                            )}
                            {error && (
                                <div className="text-yellow-300 text-sm">
                                    {error}
                                </div>
                            )}
                        </div>
                    </form>
                </div>

                <div className="mt-6 text-sm text-white/70">
                    เมื่ออนุมัติแล้ว ผลงานของคุณจะถูกแสดงในหมวดหมู่
                    “สนับสนุนนักพัฒนาครีเอเตอร์” บนหน้า ร้านค้า และแบ่งรายได้
                    85% ให้คุณ (หักค่าคอมมิชชั่น 15%).
                </div>
            </section>
            <Footer />
        </main>
    );
}
