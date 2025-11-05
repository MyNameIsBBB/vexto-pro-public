"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { MdCheck } from "react-icons/md";

export default function ProPage() {
    const { isAuthenticated } = useAuth();

    return (
        <main className="pb-20">
            <Navbar />
            <section className="mt-6">
                <div className="text-center max-w-3xl mx-auto">
                    <h1 className="text-4xl font-extrabold mb-3 bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] bg-clip-text text-transparent">
                        อัปเกรดเป็น Pro
                    </h1>
                    <p className="text-white/70 text-lg">
                        ปลดล็อคฟีเจอร์เต็มรูปแบบ สร้างโปรไฟล์ไม่จำกัด
                    </p>
                </div>

                {/* Benefits */}
                <div className="grid md:grid-cols-3 gap-4 mt-10">
                    {[
                        {
                            title: "เปลี่ยน Username ได้",
                            desc: "เปลี่ยน URL โปรไฟล์ของคุณได้ตามต้องการ",
                        },
                        {
                            title: "ไม่มีโลโก้แบรนด์",
                            desc: "ลบแถบสีเหลืองและโลโก้ Vexto ออกจากโปรไฟล์",
                        },
                        {
                            title: "ใช้บล็อกไม่จำกัด",
                            desc: "เพิ่มบล็อกได้ไม่จำกัดจำนวน",
                        },
                        {
                            title: "เทมเพลตพรีเมียม",
                            desc: "เข้าถึงธีมและเทมเพลตพิเศษ",
                        },
                        {
                            title: "พื้นหลังรูป/GIF",
                            desc: "ตั้งค่าพื้นหลังแบบรูปภาพหรือ GIF",
                        },
                        {
                            title: "เอฟเฟกต์พิเศษ",
                            desc: "กรอบทอง ไล่สี เงา Glow และอื่นๆ",
                        },
                    ].map((b) => (
                        <div
                            key={b.title}
                            className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition-colors"
                        >
                            <div className="flex items-start gap-2">
                                <MdCheck className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h3 className="font-semibold mb-1">
                                        {b.title}
                                    </h3>
                                    <p className="text-sm text-white/70">
                                        {b.desc}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pricing */}
                <div className="mt-12 grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {/* Free Plan */}
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                        <div className="text-center mb-6">
                            <h3 className="text-xl font-bold mb-2">Free</h3>
                            <div className="text-4xl font-extrabold mb-1">
                                ฿0
                            </div>
                            <p className="text-sm text-white/60">ตลอดกาล</p>
                        </div>
                        <ul className="space-y-3 text-sm mb-6">
                            <li className="flex items-start gap-2">
                                <MdCheck className="w-5 h-5 text-white/40 mt-0.5 flex-shrink-0" />
                                <span className="text-white/70">
                                    1 หน้าโปรไฟล์
                                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <MdCheck className="w-5 h-5 text-white/40 mt-0.5 flex-shrink-0" />
                                <span className="text-white/70">
                                    จำกัด 3 บล็อก
                                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <MdCheck className="w-5 h-5 text-white/40 mt-0.5 flex-shrink-0" />
                                <span className="text-white/70">
                                    มีแถบโลโก้
                                </span>
                            </li>
                        </ul>
                        <Link
                            href="/register"
                            className="block text-center px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors"
                        >
                            ใช้งานฟรี
                        </Link>
                    </div>

                    {/* Pro Monthly */}
                    <div className="rounded-2xl border-2 border-purple-500/50 bg-gradient-to-br from-purple-500/10 to-blue-500/10 p-6 relative">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                            ยอดนิยม
                        </div>
                        <div className="text-center mb-6">
                            <h3 className="text-xl font-bold mb-2">
                                Pro (รายเดือน)
                            </h3>
                            <div className="text-4xl font-extrabold mb-1">
                                ฿99
                            </div>
                            <p className="text-sm text-white/60">ต่อเดือน</p>
                        </div>
                        <ul className="space-y-3 text-sm mb-6">
                            <li className="flex items-start gap-2">
                                <MdCheck className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                                <span>เปลี่ยน Username ได้</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <MdCheck className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                                <span>ไม่มีโลโก้แบรนด์</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <MdCheck className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                                <span>ใช้บล็อกไม่จำกัด</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <MdCheck className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                                <span>เทมเพลตพรีเมียม</span>
                            </li>
                        </ul>
                        <Link
                            href={
                                isAuthenticated
                                    ? "/pay?amount=99&grant=pro-monthly&returnUrl=%2Fpro"
                                    : `/login?returnUrl=${encodeURIComponent(
                                          "/pay?amount=99&grant=pro-monthly"
                                      )}`
                            }
                            className="block text-center px-5 py-3 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] text-white text-sm font-bold hover:opacity-90 transition-opacity"
                        >
                            เริ่มใช้งาน Pro
                        </Link>
                    </div>

                    {/* Pro Yearly */}
                    <div className="rounded-2xl border border-yellow-400/30 bg-yellow-400/10 p-6 relative">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-gray-900 text-xs font-bold px-3 py-1 rounded-full">
                            ประหยัดสุด
                        </div>
                        <div className="text-center mb-6">
                            <h3 className="text-xl font-bold mb-2">
                                Pro (รายปี)
                            </h3>
                            <div className="flex items-center justify-center gap-2 mb-1">
                                <span className="text-2xl font-bold text-white/50 line-through">
                                    ฿1,188
                                </span>
                                <span className="text-4xl font-extrabold">
                                    ฿999
                                </span>
                            </div>
                            <p className="text-sm text-white/60">
                                ต่อปี · ประหยัด ฿189
                            </p>
                        </div>
                        <ul className="space-y-3 text-sm mb-6">
                            <li className="flex items-start gap-2">
                                <MdCheck className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                                <span>เปลี่ยน Username ได้</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <MdCheck className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                                <span>ไม่มีโลโก้แบรนด์</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <MdCheck className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                                <span>ใช้บล็อกไม่จำกัด</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <MdCheck className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                                <span>เทมเพลตพรีเมียม</span>
                            </li>
                        </ul>
                        <Link
                            href={
                                isAuthenticated
                                    ? "/pay?amount=999&grant=pro-yearly&returnUrl=%2Fpro"
                                    : `/login?returnUrl=${encodeURIComponent(
                                          "/pay?amount=999&grant=pro-yearly"
                                      )}`
                            }
                            className="block text-center px-5 py-3 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-gray-900 text-sm font-bold transition-colors"
                        >
                            เริ่มใช้งาน Pro (รายปี)
                        </Link>
                    </div>
                </div>

                {/* FAQ */}
                <div className="mt-16 max-w-2xl mx-auto">
                    <h2 className="text-2xl font-bold text-center mb-8">
                        คำถามที่พบบ่อย
                    </h2>
                    <div className="space-y-4">
                        {[
                            {
                                q: "ต่ออายุอัตโนมัติหรือไม่?",
                                a: "ไม่ ต้องต่ออายุด้วยตัวเองเมื่อหมดอายุ",
                            },
                            {
                                q: "ยกเลิกได้ไหม?",
                                a: "ได้ แต่ไม่คืนเงิน ใช้งานได้จนครบรอบการชำระ",
                            },
                            {
                                q: "เปลี่ยนแพ็กได้ไหม?",
                                a: "ได้ ติดต่อทีมงานเพื่อปรับเปลี่ยนแพ็ก",
                            },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="rounded-xl border border-white/10 bg-white/5 p-5"
                            >
                                <h3 className="font-semibold mb-2">{item.q}</h3>
                                <p className="text-sm text-white/70">
                                    {item.a}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
