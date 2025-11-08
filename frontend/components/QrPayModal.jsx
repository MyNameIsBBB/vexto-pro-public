"use client";
import { useEffect, useState } from "react";

export default function QrPayModal({
    open,
    onClose,
    qrBase64,
    amount,
    paymentId,
    expiresAt,
    onVerify,
    verifying,
    status,
    transactionId,
    onTransactionIdChange,
}) {
    const [secondsLeft, setSecondsLeft] = useState(0);

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
            <div className="relative w-[92vw] max-w-xl rounded-2xl border border-white/10 bg-white/5 shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
                    <div className="text-sm text-white/80">
                        สแกน QR เพื่อชำระเงิน
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
                    {qrBase64 ? (
                        <div className="flex flex-col items-center">
                            <img
                                src={`data:image/png;base64,${qrBase64}`}
                                alt="PromptPay QR"
                                className="w-72 h-72 rounded-xl border border-white/10 bg-white p-4"
                            />
                            <div className="mt-3 text-sm text-white/70">
                                หมดเวลาใน: {prettyTime()}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-white/70">
                            กำลังสร้าง QR...
                        </div>
                    )}

                    <div className="mt-6 space-y-4">
                        <div>
                            <label className="text-sm text-white/60 mb-2 block">
                                หมายเลขอ้างอิงจากสลิป (Transaction ID) -
                                ไม่บังคับ
                            </label>
                            <input
                                type="text"
                                value={transactionId}
                                onChange={(e) =>
                                    onTransactionIdChange(e.target.value)
                                }
                                placeholder="กรอกหมายเลขอ้างอิงหากต้องการ (ไม่จำเป็น)"
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none text-white"
                            />
                            <p className="mt-1 text-xs text-white/50">
                                Stripe PromptPay จะตรวจสอบการชำระเงินอัตโนมัติ -
                                ไม่จำเป็นต้องกรอก Transaction ID
                            </p>
                        </div>

                        <button
                            onClick={onVerify}
                            disabled={verifying}
                            className="w-full px-5 py-3 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] text-white text-sm font-medium disabled:opacity-60"
                        >
                            {verifying
                                ? "กำลังตรวจสอบการชำระเงิน..."
                                : "ตรวจสอบการชำระเงิน"}
                        </button>

                        {status && (
                            <div
                                className={`text-sm text-center p-3 rounded-xl ${
                                    status.ok
                                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                        : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                                }`}
                            >
                                {status.message}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
