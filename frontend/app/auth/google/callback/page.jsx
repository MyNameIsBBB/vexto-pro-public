"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setToken } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

function GoogleCallbackContent() {
    const router = useRouter();
    const search = useSearchParams();
    const { loadProfile } = useAuth();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const processCallback = async () => {
            const code = search.get("code");
            const token = search.get("token");
            const state = search.get("state");

            console.log("Google callback - code:", code, "token:", token);

            if (token) {
                // Backend already processed and sent token
                console.log("Using provided token");
                setToken(token);
                try {
                    await loadProfile();
                    const redirectUrl = state ? decodeURIComponent(state) : "/edit";
                    router.replace(redirectUrl);
                } catch (e) {
                    console.error("Load profile error:", e);
                    setError("ไม่สามารถโหลดโปรไฟล์ได้");
                    setLoading(false);
                }
            } else if (code) {
                // We got code from Google, need to exchange it via backend
                try {
                    const base =
                        process.env.NEXT_PUBLIC_API_BASE_URL ||
                        "http://localhost:5001/api";

                    console.log("Exchanging Google code with backend:", base);

                    const res = await fetch(
                        `${base}/auth/google/callback?code=${encodeURIComponent(
                            code
                        )}${state ? `&state=${encodeURIComponent(state)}` : ""}`,
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

                    setToken(data.token);
                    await loadProfile();
                    const redirectUrl = state ? decodeURIComponent(state) : "/edit";
                    router.replace(redirectUrl);
                } catch (e) {
                    console.error("Google auth error:", e);
                    setError(e.message || "การเข้าสู่ระบบล้มเหลว");
                    setLoading(false);
                }
            } else {
                console.error("No code or token found in URL");
                setError("ไม่พบโค้ดจาก Google");
                setLoading(false);
            }
        };

        processCallback();
    }, [search, router, loadProfile]);

    return (
        <main className="min-h-screen grid place-items-center p-8">
            <div className="text-center">
                <h1 className="text-xl font-semibold mb-2">
                    กำลังเชื่อมต่อ Google...
                </h1>
                {error ? (
                    <div>
                        <p className="text-red-400 mb-4">{error}</p>
                        <button
                            onClick={() => router.push("/login")}
                            className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700"
                        >
                            กลับไปหน้าเข้าสู่ระบบ
                        </button>
                    </div>
                ) : (
                    <p className="text-white/70">
                        โปรดรอสักครู่ ระบบกำลังพาคุณไปยังหน้าสร้างโปรไฟล์
                    </p>
                )}
            </div>
        </main>
    );
}

export default function GoogleCallbackPage() {
    return (
        <Suspense
            fallback={
                <main className="min-h-screen grid place-items-center p-8">
                    <div className="text-center">
                        <h1 className="text-xl font-semibold mb-2">
                            กำลังเชื่อมต่อ Google...
                        </h1>
                        <p className="text-white/70">กำลังโหลด...</p>
                    </div>
                </main>
            }
        >
            <GoogleCallbackContent />
        </Suspense>
    );
}
