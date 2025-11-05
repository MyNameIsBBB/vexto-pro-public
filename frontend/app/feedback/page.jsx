"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { api } from "@/lib/api";

function StarRating({ value, onChange }) {
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
                <button
                    key={i}
                    type="button"
                    aria-label={`${i} stars`}
                    onClick={() => onChange(i)}
                    className={`text-2xl transition-transform ${
                        i <= value ? "text-yellow-400" : "text-white/30"
                    } hover:scale-110`}
                >
                    ★
                </button>
            ))}
        </div>
    );
}

export default function FeedbackPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [rating, setRating] = useState(5);
    const [comments, setComments] = useState("");
    const [improvements, setImprovements] = useState("");
    const [allowContact, setAllowContact] = useState(true);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    async function onSubmit(e) {
        e.preventDefault();
        setError("");
        setSuccess(false);
        setLoading(true);
        try {
            await api.post("/feedback", {
                name,
                email,
                subject,
                rating,
                comments,
                improvements,
                allowContact,
            });
            setSuccess(true);
            setName("");
            setEmail("");
            setSubject("");
            setRating(5);
            setComments("");
            setImprovements("");
            setAllowContact(true);
        } catch (e) {
            setError(e.message || "ส่งฟีดแบ็กไม่สำเร็จ");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Navbar />
            <main className="min-h-[70vh] py-10">
                <div className="mx-auto max-w-3xl px-4">
                    <h1 className="text-3xl font-bold mb-3">
                        ส่งฟีดแบ็กถึงเรา
                    </h1>
                    <p className="text-white/70 mb-8">
                        ช่วยบอกความคิดเห็น ข้อควรปรับปรุง และให้คะแนน
                        เพื่อให้เราพัฒนา Vexto ให้ดียิ่งขึ้น 💜
                    </p>

                    <form
                        onSubmit={onSubmit}
                        className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 md:p-8 space-y-5"
                    >
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-1.5">
                                    ชื่อของคุณ
                                </label>
                                <input
                                    required
                                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-[#22d3ee]/60 focus:ring-2 focus:ring-[#22d3ee]/20 transition-all"
                                    placeholder="ชื่อ-นามสกุล หรือชื่อเล่น"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-1.5">
                                    อีเมลติดต่อกลับ
                                </label>
                                <input
                                    required
                                    type="email"
                                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-[#22d3ee]/60 focus:ring-2 focus:ring-[#22d3ee]/20 transition-all"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-1.5">
                                หัวข้อ (ถ้ามี)
                            </label>
                            <input
                                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-[#22d3ee]/60 focus:ring-2 focus:ring-[#22d3ee]/20 transition-all"
                                placeholder="เช่น ฟีเจอร์ที่อยากได้ หรือข้อผิดพลาด"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-1.5">
                                    ให้คะแนนโดยรวม
                                </label>
                                <StarRating
                                    value={rating}
                                    onChange={setRating}
                                />
                            </div>
                            <div className="text-sm text-white/60">
                                {rating}/5
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-1.5">
                                ความคิดเห็นของคุณ
                            </label>
                            <textarea
                                required
                                rows={5}
                                className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 outline-none focus:border-[#22d3ee]/60 focus:ring-2 focus:ring-[#22d3ee]/20 transition-all"
                                placeholder="บอกเราได้เต็มที่เลยว่าชอบ/ไม่ชอบอะไร และเพราะอะไร"
                                value={comments}
                                onChange={(e) => setComments(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-1.5">
                                ข้อควรปรับปรุง/ฟีเจอร์ที่อยากได้ (ถ้ามี)
                            </label>
                            <textarea
                                rows={4}
                                className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 outline-none focus:border-[#22d3ee]/60 focus:ring-2 focus:ring-[#22d3ee]/20 transition-all"
                                placeholder="ตัวอย่าง: อยากให้เพิ่มตัวแก้ไขบล็อกแบบลากวาง (drag-and-drop)"
                                value={improvements}
                                onChange={(e) =>
                                    setImprovements(e.target.value)
                                }
                            />
                        </div>

                        <label className="inline-flex items-center gap-3 text-white/80">
                            <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-white/20 bg-white/5"
                                checked={allowContact}
                                onChange={(e) =>
                                    setAllowContact(e.target.checked)
                                }
                            />
                            อนุญาตให้ติดต่อกลับได้หากต้องการรายละเอียดเพิ่มเติม
                        </label>

                        {error && (
                            <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                                {error}
                            </p>
                        )}
                        {success && (
                            <p className="text-emerald-400 text-sm bg-emerald-400/10 border border-emerald-400/20 rounded-lg px-3 py-2">
                                ขอบคุณสำหรับฟีดแบ็ก! เราได้รับเรียบร้อยแล้ว 🙏
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full px-4 py-3 rounded-xl text-white font-medium shadow-lg transition hover:opacity-90 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed"
                            style={{ background: "#7c3aed" }}
                        >
                            {loading ? "กำลังส่ง..." : "ส่งฟีดแบ็ก"}
                        </button>
                    </form>
                </div>
            </main>
            <Footer />
        </>
    );
}
