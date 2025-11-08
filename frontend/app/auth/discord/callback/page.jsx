"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setToken } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

function DiscordCallbackContent() {
    const router = useRouter();
    const search = useSearchParams();
    const { loadProfile } = useAuth();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        const processCallback = async () => {
            // Prevent duplicate processing
            if (processing) return;
            setProcessing(true);

            const code = search.get("code");
            const token = search.get("token");

            console.log("Discord callback - code:", code, "token:", token);

            if (token) {
                // Backend already processed and sent token
                console.log("Using provided token");
                setToken(token);
                try {
                    await loadProfile();
                    router.replace("/edit");
                } catch (e) {
                    console.error("Load profile error:", e);
                    setError("ไม่สามารถโหลดโปรไฟล์ได้");
                    setLoading(false);
                }
            } else if (code) {
                // We got code from Discord, need to exchange it via backend
                try {
                    const base =
                        process.env.NEXT_PUBLIC_API_BASE_URL ||
                        "http://localhost:5001/api";

                    console.log("Exchanging Discord code with backend:", base);

                    const res = await fetch(
                        `${base}/auth/discord/callback?code=${encodeURIComponent(
                            code
                        )}`,
                        {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                            },
                        }
                    );

                    console.log("Backend response status:", res.status);

                    const data = await res.json();

                    console.log("Backend response data:", data);

                    if (!res.ok || !data.token) {
                        throw new Error(data.error || "Failed to authenticate");
                    }

                    console.log("Token received, loading profile...");
                    setToken(data.token);
                    await loadProfile();
                    console.log("Profile loaded, redirecting...");
                    router.replace("/edit");
                } catch (e) {
                    console.error("Discord auth error:", e);
                    // Only show error if it's a real failure, not just slow loading
                    if (e.message !== "Failed to authenticate") {
                        setError(e.message || "การเข้าสู่ระบบล้มเหลว");
                    }
                    setLoading(false);
                }
            } else {
                console.error("No code or token found in URL");
                setError("ไม่พบโค้ดจาก Discord");
                setLoading(false);
            }
        };

        processCallback();
    }, [search, router, loadProfile]);

    return (
        <main className="min-h-screen grid place-items-center p-8 bg-[#0b1020]">
            <div className="text-center">
                <div className="mb-6">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#5865F2] mx-auto"></div>
                </div>
                <h1 className="text-2xl font-semibold mb-3 text-white">
                    กำลังเชื่อมต่อ Discord...
                </h1>
                {error ? (
                    <div>
                        <p className="text-red-400 mb-4">{error}</p>
                        <button
                            onClick={() => router.push("/login")}
                            className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 transition"
                        >
                            กลับไปหน้าเข้าสู่ระบบ
                        </button>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <p className="text-white/70">
                            โปรดรอสักครู่ ระบบกำลังยืนยันตัวตน...
                        </p>
                        <p className="text-white/50 text-sm">
                            อาจใช้เวลาสักครู่ โปรดอย่าปิดหน้าต่างนี้
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
}

export default function DiscordCallbackPage() {
    return (
        <Suspense
            fallback={
                <main className="min-h-screen grid place-items-center p-8">
                    <div className="text-center">
                        <h1 className="text-xl font-semibold mb-2">
                            กำลังเชื่อมต่อ Discord...
                        </h1>
                        <p className="text-white/70">กำลังโหลด...</p>
                    </div>
                </main>
            }
        >
            <DiscordCallbackContent />
        </Suspense>
    );
}
