"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QrPayModal from "@/components/QrPayModal";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export default function PayPage() {
    const params = useSearchParams();
    const initialAmount = Number(params.get("amount")) || 99;
    const router = useRouter();
    const grantParam = params.get("grant") || ""; // e.g., pro or item:glow-frame
    const returnUrl = params.get("returnUrl") || "/";
    const initialRef = params.get("ref1") || "vexto-support"; // human note only
    // Note field removed; not used by the API
    const { isAuthenticated } = useAuth();

    const [amount, setAmount] = useState(initialAmount);
    const [ref1, setRef1] = useState(initialRef);

    const [modalOpen, setModalOpen] = useState(false);
    const [session, setSession] = useState(null); // { id_pay, qr_image_base64, time_out }
    const [error, setError] = useState("");
    const [confirming, setConfirming] = useState(false);
    const [confirmStatus, setConfirmStatus] = useState(null);

    const startPayment = async () => {
        try {
            setError("");
            setConfirmStatus(null);
            if (!isAuthenticated) {
                const current =
                    window.location.pathname + window.location.search;
                router.push(`/login?returnUrl=${encodeURIComponent(current)}`);
                return;
            }
            let grantType = undefined;
            let itemId = undefined;
            if (grantParam) {
                if (grantParam === "pro") grantType = "pro";
                else if (grantParam.startsWith("item:")) {
                    grantType = "item";
                    itemId = grantParam.slice(5);
                }
            }
            const data = await api.post("/payment/session", {
                amount,
                ref1,
                grantType,
                itemId,
            });
            setSession(data);
            setModalOpen(true);
        } catch (e) {
            setError(e?.message || "เริ่มชำระเงินไม่สำเร็จ");
        }
    };

    const confirmPayment = async () => {
        if (!session?.id_pay) return;
        try {
            setConfirming(true);
            const result = await api.post("/payment/confirm", {
                id_pay: session.id_pay,
            });
            setConfirmStatus({
                ok: true,
                message: `ชำระเงินสำเร็จ: ${result.amount} บาท`,
            });
        } catch (e) {
            setConfirmStatus({
                ok: false,
                message: e?.message || "ยังไม่พบการชำระเงิน",
            });
        } finally {
            setConfirming(false);
        }
    };

    // removed auto-confirm polling per request

    return (
        <main className="pb-20">
            <Navbar />

            <section className="max-w-3xl mx-auto mt-6">
                <h1 className="text-3xl font-extrabold mb-2">ชำระเงิน</h1>
                <p className="text-white/70 mb-6">
                    สแกน QR PromptPay ผ่านระบบ TMWEASY API
                </p>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-white/60 mb-2 block">
                                จำนวนเงิน (บาท)
                            </label>
                            <input
                                type="text"
                                readOnly
                                value={amount}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/90"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-white/60 mb-2 block">
                                อ้างอิง (ref1)
                            </label>
                            <input
                                value={ref1}
                                onChange={(e) => setRef1(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none"
                            />
                        </div>
                        {/* Note field removed */}
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                        <button
                            onClick={startPayment}
                            className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] text-white text-sm font-medium"
                        >
                            สร้าง QR และชำระเงิน
                        </button>
                        {/* auto confirm toggle removed */}
                    </div>

                    {error && (
                        <div className="mt-4 text-sm text-yellow-300">
                            {error}
                        </div>
                    )}
                </div>
            </section>

            <Footer />

            <QrPayModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                qrBase64={session?.qr_image_base64}
                amount={session?.amount || amount}
                ref1={session?.ref1 || ref1}
                timeOut={session?.time_out}
                onConfirm={confirmPayment}
                confirming={confirming}
                status={confirmStatus}
            />
        </main>
    );
}
