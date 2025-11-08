"use client";
import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

export default function StripePromptPayModal({
    open,
    onClose,
    clientSecret,
    stripePublishableKey,
    amount,
    paymentId,
    expiresAt,
    onSuccess,
    onError,
}) {
    const [stripe, setStripe] = useState(null);
    const [loading, setLoading] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(0);
    const [email, setEmail] = useState("");

    // Load Stripe.js
    useEffect(() => {
        if (!stripePublishableKey) return;

        const initStripe = async () => {
            const stripeInstance = await loadStripe(stripePublishableKey);
            setStripe(stripeInstance);
        };

        initStripe();
    }, [stripePublishableKey]);

    // Timer countdown
    useEffect(() => {
        if (!expiresAt) return;
        const calcSeconds = () => {
            const diff = new Date(expiresAt) - new Date();
            return Math.max(0, Math.floor(diff / 1000));
        };
        setSecondsLeft(calcSeconds());
        const id = setInterval(() => {
            setSecondsLeft(calcSeconds());
        }, 1000);
        return () => clearInterval(id);
    }, [expiresAt, open]);

    const handlePayment = async (e) => {
        e.preventDefault();

        if (!stripe || !clientSecret) {
            onError("Stripe ยังไม่พร้อมใช้งาน");
            return;
        }

        if (!email) {
            onError("กรุณากรอกอีเมล");
            return;
        }

        setLoading(true);

        try {
            // Confirm PromptPay payment with Stripe.js
            const result = await stripe.confirmPromptPayPayment(clientSecret, {
                payment_method: {
                    type: "promptpay",
                    billing_details: {
                        email: email,
                    },
                },
            });

            if (result.error) {
                onError(result.error.message || "เกิดข้อผิดพลาดในการชำระเงิน");
            } else if (result.paymentIntent.status === "succeeded") {
                onSuccess(result.paymentIntent);
            } else {
                onError(`สถานะการชำระเงิน: ${result.paymentIntent.status}`);
            }
        } catch (error) {
            console.error("Payment error:", error);
            onError("เกิดข้อผิดพลาดในระบบ");
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    const prettyTime = () => {
        const m = Math.floor(secondsLeft / 60);
        const s = secondsLeft % 60;
        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="relative w-[92vw] max-w-md rounded-2xl border border-white/10 bg-white/5 shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
                    <div className="text-sm text-white/80">
                        ชำระเงินด้วย PromptPay
                    </div>
                    <button
                        onClick={onClose}
                        className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-sm"
                    >
                        ปิด
                    </button>
                </div>

                <div className="p-6">
                    <div className="text-sm text-white/70 mb-4">
                        ยอดชำระ:{" "}
                        <span className="font-semibold text-white">
                            ฿{amount}
                        </span>
                    </div>

                    <div className="text-xs text-white/60 mb-4">
                        หมดเวลาใน: {prettyTime()}
                    </div>

                    <form onSubmit={handlePayment} className="space-y-4">
                        <div>
                            <label className="text-sm text-white/60 mb-2 block">
                                อีเมล *
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your@email.com"
                                required
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none text-white"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !stripe}
                            className="w-full px-5 py-3 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] text-white text-sm font-medium disabled:opacity-60"
                        >
                            {loading
                                ? "กำลังเปิด QR Code..."
                                : "แสดง QR Code PromptPay"}
                        </button>
                    </form>

                    <p className="mt-4 text-xs text-white/50 text-center">
                        ระบบจะแสดง QR Code ให้สแกนด้วยแอปธนาคารที่รองรับ
                        PromptPay
                    </p>
                </div>
            </div>
        </div>
    );
}
