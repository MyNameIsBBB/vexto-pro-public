"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StripePromptPayModal from "@/components/StripePromptPayModal";
import { api, payment } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export default function PayPage() {
    const params = useSearchParams();
    const initialAmount = Number(params.get("amount")) || 99;
    const router = useRouter();
    const grantParam = params.get("grant") || ""; // e.g., pro or item:glow-frame
    const returnUrl = params.get("returnUrl") || "/";
    const { isAuthenticated, user } = useAuth();

    const [amount, setAmount] = useState(initialAmount);
    const [modalOpen, setModalOpen] = useState(false);
    const [session, setSession] = useState(null); // { paymentId, client_secret, stripe_publishable_key, amount, expires_at }
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const startPayment = async () => {
        try {
            setError("");
            setSuccess("");
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

            // Block Pro purchase if user already has active Pro
            if (grantType === "pro" && user) {
                if (user.isPro && user.proExpiry) {
                    const now = new Date();
                    const expiry = new Date(user.proExpiry);
                    if (expiry > now) {
                        const daysLeft = Math.ceil(
                            (expiry - now) / (1000 * 60 * 60 * 24)
                        );
                        setError(
                            `คุณมี Pro อยู่แล้ว หมดอายุในอีก ${daysLeft} วัน`
                        );
                        return;
                    }
                }
            }

            const data = await payment.createPayment(amount, grantType, itemId);

            setSession(data);
            setModalOpen(true);
        } catch (e) {
            setError(e?.message || "เริ่มชำระเงินไม่สำเร็จ");
        }
    };

    const handlePaymentSuccess = async (paymentIntent) => {
        setSuccess("ชำระเงินสำเร็จ! กำลังอัพเดทสิทธิ์...");
        setModalOpen(false);

        // Redirect after 2 seconds
        setTimeout(() => {
            router.push(returnUrl);
        }, 2000);
    };

    const handlePaymentError = (errorMessage) => {
        setError(errorMessage);
    };
    return (
        <main className="pb-20">
            <Navbar />

            <section className="max-w-3xl mx-auto mt-6">
                <h1 className="text-3xl font-extrabold mb-2">ชำระเงิน</h1>
                <p className="text-white/70 mb-6">
                    สแกน QR PromptPay และยืนยันการชำระเงินผ่าน Stripe Payment
                    API
                </p>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                    <div className="mb-4">
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

                    <div className="mt-6">
                        <button
                            onClick={startPayment}
                            className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] text-white text-sm font-medium"
                        >
                            สร้าง QR และชำระเงิน
                        </button>
                    </div>

                    {error && (
                        <div className="mt-4 text-sm text-yellow-300">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mt-4 text-sm text-green-400">
                            {success}
                        </div>
                    )}
                </div>
            </section>

            <Footer />

            <StripePromptPayModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                clientSecret={session?.client_secret}
                stripePublishableKey={session?.stripe_publishable_key}
                amount={session?.amount || amount}
                paymentId={session?.paymentId}
                expiresAt={session?.expires_at}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
            />
        </main>
    );
}
