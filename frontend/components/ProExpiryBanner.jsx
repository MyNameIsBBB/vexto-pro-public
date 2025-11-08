"use client";
import { useAuth } from "@/contexts/AuthContext";

export default function ProExpiryBanner() {
    const { user } = useAuth();

    if (!user?.isPro || !user?.proExpiry) {
        return null;
    }

    const now = new Date();
    const expiry = new Date(user.proExpiry);
    const isExpired = expiry <= now;

    if (isExpired) {
        return null; // Don't show banner if already expired
    }

    const daysLeft = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));

    return (
        <div className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
                <div className="text-2xl">✨</div>
                <div className="flex-1">
                    <p className="font-medium text-white">คุณมี Pro อยู่</p>
                    <p className="text-sm text-white/70">
                        {daysLeft > 0
                            ? `หมดอายุในอีก ${daysLeft} วัน`
                            : "หมดอายุวันนี้"}
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-white/50">หมดอายุ</p>
                    <p className="text-sm font-medium">
                        {expiry.toLocaleDateString("th-TH", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                        })}
                    </p>
                </div>
            </div>
        </div>
    );
}
