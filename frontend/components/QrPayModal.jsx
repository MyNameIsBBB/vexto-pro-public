"use client";
import { useEffect, useState } from "react";

export default function QrPayModal({
    open,
    onClose,
    qrBase64,
    amount,
    ref1,
    timeOut,
    onConfirm,
    confirming,
    status,
}) {
    const [secondsLeft, setSecondsLeft] = useState(timeOut || 0);

    useEffect(() => {
        setSecondsLeft(timeOut || 0);
    }, [timeOut, open]);

    useEffect(() => {
        if (!open) return;
        if (!secondsLeft || secondsLeft <= 0) return;
        const id = setInterval(
            () => setSecondsLeft((s) => Math.max(0, s - 1)),
            1000
        );
        return () => clearInterval(id);
    }, [open, secondsLeft]);

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
                        </span>{" "}
                        · อ้างอิง: <span className="text-white/90">{ref1}</span>
                    </div>
                    {qrBase64 ? (
                        <div className="flex flex-col items-center">
                            <img
                                src={`data:image/png;base64,${qrBase64}`}
                                alt="PromptPay QR"
                                className="w-72 h-72 rounded-xl border border-white/10 bg-white"
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

                    <div className="mt-6 flex items-center gap-3">
                        <button
                            onClick={onConfirm}
                            disabled={confirming}
                            className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] text-white text-sm font-medium disabled:opacity-60"
                        >
                            {confirming
                                ? "กำลังตรวจสอบ..."
                                : "ฉันโอนแล้ว ตรวจสอบ"}
                        </button>
                        {status && (
                            <div
                                className={`text-sm ${
                                    status.ok
                                        ? "text-green-400"
                                        : "text-yellow-300"
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
