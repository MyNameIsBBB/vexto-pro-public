"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setToken } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export default function DiscordCallbackPage() {
    const router = useRouter();
    const search = useSearchParams();
    const { loadProfile } = useAuth();
    const [error, setError] = useState("");

    useEffect(() => {
        const t = search.get("token");
        if (t) {
            setToken(t);
            // Load profile then redirect to editor
            (async () => {
                try {
                    await loadProfile();
                    router.replace("/edit");
                } catch (e) {
                    console.error(e);
                    router.replace("/");
                }
            })();
        } else {
            setError("ไม่พบโทเค็นจาก Discord");
        }
    }, [search, router, loadProfile]);

    return (
        <main className="min-h-screen grid place-items-center p-8">
            <div className="text-center">
                <h1 className="text-xl font-semibold mb-2">
                    กำลังเชื่อมต่อ Discord...
                </h1>
                {error ? (
                    <p className="text-red-400">{error}</p>
                ) : (
                    <p className="text-white/70">
                        โปรดรอสักครู่ ระบบกำลังพาคุณไปยังหน้าสร้างโปรไฟล์
                    </p>
                )}
            </div>
        </main>
    );
}
