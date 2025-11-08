"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import BlockRenderer from "@/components/BlockRenderer";
import SocialIcons from "@/components/SocialIcons";
import { MdErrorOutline, MdInbox, MdShare } from "react-icons/md";

export default function UserProfile() {
    const params = useParams();
    const username = params.username;

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Ensure the deepest background is controlled by profile outer background
    useEffect(() => {
        if (typeof document !== "undefined") {
            const prev = document.body.style.background;
            document.body.style.background = "transparent";
            return () => {
                document.body.style.background = prev;
            };
        }
    }, []);

    useEffect(() => {
        async function fetchProfile() {
            try {
                setLoading(true);
                // Resolve API base: prefer env, else use '/api' in production, fallback to localhost in dev
                const apiUrl = (() => {
                    if (process.env.NEXT_PUBLIC_API_BASE_URL)
                        return process.env.NEXT_PUBLIC_API_BASE_URL;
                    if (typeof window !== "undefined") {
                        const host = window.location.hostname;
                        const isLocal =
                            host === "localhost" || host === "127.0.0.1";
                        return isLocal ? "http://localhost:5001/api" : "/api";
                    }
                    return "http://localhost:5001/api";
                })();
                
                const response = await fetch(`${apiUrl}/profiles/${username}`);

                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error("ไม่พบโปรไฟล์นี้");
                    }
                    throw new Error("เกิดข้อผิดพลาดในการโหลดข้อมูล");
                }

                const data = await response.json();
                setProfile(data);
                setError(null);
            } catch (err) {
                console.error("Error fetching profile:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        if (username) {
            fetchProfile();
        } else {
            setLoading(false);
        }
    }, [username]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
                    <p className="text-gray-400">กำลังโหลด...</p>
                </div>
            </div>
        );
    }

    if (error) {
        const isNotFound = error === "ไม่พบโปรไฟล์นี้";
        if (isNotFound) {
            return (
                <div className="min-h-screen relative flex items-center justify-center px-6 py-14 overflow-hidden" style={{ background: "#0a0a0f" }}>
                    {/* Outer themed background overlay */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full bg-gradient-to-br from-fuchsia-600/20 to-cyan-400/20 blur-3xl" />
                        <div className="absolute -bottom-40 -right-40 w-[520px] h-[520px] rounded-full bg-gradient-to-tr from-cyan-400/15 to-fuchsia-600/15 blur-3xl" />
                    </div>

                    <div className="relative z-10 max-w-xl w-full">
                        <div className="rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-8 text-center shadow-2xl">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 border border-white/10">
                                <MdErrorOutline className="h-8 w-8 text-white/80" />
                            </div>
                            <h1 className="text-3xl font-extrabold tracking-tight text-white">
                                ไม่พบโปรไฟล์นี้
                            </h1>
                            <p className="mt-3 text-white/70">
                                อาจมีการลบ เปลี่ยนชื่อ หรือยังไม่ได้เผยแพร่เป็นสาธารณะ
                            </p>
                            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                                <Link href="/examples" className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-white hover:bg-white/10 transition">
                                    ดูตัวอย่างโปรไฟล์
                                </Link>
                                <Link href="/" className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-fuchsia-600 to-cyan-400 px-5 py-3 text-white font-semibold hover:opacity-90 transition">
                                    กลับสู่หน้าหลัก
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        // Generic error
        return (
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
                <div className="max-w-md w-full text-center">
                    <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8">
                        <MdErrorOutline className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-white mb-2">เกิดข้อผิดพลาด</h1>
                        <p className="text-gray-400 mb-6">{error}</p>
                        <Link href="/" className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl transition-colors">
                            กลับสู่หน้าหลัก
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const theme = profile?.theme || {};

    const isPro = Boolean(profile?.isPro);

    if (!profile) {
        return null;
    }

    const buildOuterBg = (t) => {
        const color = t?.outerBackground || t?.background || "#0a0a0f";
        if (t?.outerBackgroundImage) {
            return {
                backgroundColor: color,
                backgroundImage: `url(${t.outerBackgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            };
        }
        return { background: color };
    };
    const buildInnerBg = (t) => {
        const color = t?.background || "transparent";
        if (t?.backgroundImage) {
            return {
                backgroundColor: color,
                backgroundImage: `url(${t.backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            };
        }
        return { background: color };
    };

    // font family mapping like editor/preview
    const fontMap = {
        prompt: "var(--font-prompt)",
        kanit: "var(--font-kanit)",
        sarabun: "var(--font-sarabun)",
    };
    const fontFamily = fontMap[theme?.fontFamily] || fontMap.prompt;
    const nameColor =
        theme?.textOverrides?.name || theme?.textColor || "#f3f4f6";
    const bodyColor =
        theme?.textOverrides?.body || theme?.textColor || "#f3f4f6";

    const handleShare = async () => {
        try {
            const url =
                typeof window !== "undefined" ? window.location.href : "";
            const title = profile?.displayName || "โปรไฟล์ของฉัน";
            if (navigator.share) {
                await navigator.share({ title, url });
            } else if (navigator.clipboard && url) {
                await navigator.clipboard.writeText(url);
                alert("คัดลอกลิงก์แล้ว");
            }
        } catch (_) {
            // user cancelled or share not supported
        }
    };

    return (
        <>
            {/* Full-viewport themed background behind content (covers layout bg) */}
            <div
                className="fixed inset-0 z-0"
                style={buildOuterBg(theme)}
                aria-hidden
            />
            <div className="relative z-10 min-h-screen p-4 sm:p-6">
                <div className="max-w-3xl mx-auto">
                    {/* Single main content frame with inner background */}
                    <div
                        className="relative rounded-3xl border border-white/10 p-4 sm:p-6 md:p-8 shadow-2xl backdrop-blur-md hover:border-white/20 transition-all duration-300"
                        style={{ ...buildInnerBg(theme), fontFamily }}
                    >
                                {/* Share button top-right */}
                                <button
                                    onClick={handleShare}
                                    className="absolute top-2 right-2 sm:top-3 sm:right-3 p-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 transition-colors"
                                    aria-label="แชร์โปรไฟล์นี้"
                                    title="แชร์โปรไฟล์นี้"
                                >
                                    <MdShare className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>
                                <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-5 mb-6">
                                    {/* Avatar with frame options */}
                                    {profile.avatarUrl ? (
                                        (() => {
                                            const frame =
                                                profile.avatarFrame || "none";
                                            if (frame === "gradient") {
                                                return (
                                                    <div className="p-[2px] rounded-full bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] shadow-xl mx-auto sm:mx-0">
                                                        <img
                                                            src={
                                                                profile.avatarUrl
                                                            }
                                                            alt="avatar"
                                                            className="w-20 h-20 rounded-full object-cover"
                                                        />
                                                    </div>
                                                );
                                            }
                                            const ringClass =
                                                frame === "ring-thin"
                                                    ? "ring-2 ring-white/30"
                                                    : frame === "ring-thick"
                                                    ? "ring-4 ring-white/40"
                                                    : frame === "gold-glow"
                                                    ? "ring-2 ring-yellow-400 shadow-[0_0_24px_rgba(250,204,21,0.45)]"
                                                    : "border-2 border-white/20";
                                            return (
                                                <img
                                                    src={profile.avatarUrl}
                                                    alt="avatar"
                                                    className={`w-20 h-20 rounded-full object-cover mx-auto sm:mx-0 ${ringClass}`}
                                                />
                                            );
                                        })()
                                    ) : (
                                        <div className="w-20 h-20 rounded-full bg-white/10 border-2 border-white/20 mx-auto sm:mx-0" />
                                    )}
                                    <div className="flex-1 text-center sm:text-left">
                                        <div
                                            className="text-xl sm:text-2xl font-bold mb-1"
                                            style={{ color: nameColor }}
                                        >
                                            {profile.displayName}
                                        </div>
                                        {profile.bio && (
                                            <p
                                                className="text-sm leading-relaxed"
                                                style={{
                                                    color: bodyColor,
                                                    opacity: 0.9,
                                                }}
                                            >
                                                {profile.bio}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                {Array.isArray(profile.socials) &&
                                    profile.socials.length > 0 && (
                                        <div className="mb-6">
                                            <SocialIcons
                                                items={profile.socials}
                                                theme={theme}
                                            />
                                        </div>
                                    )}
                                {Array.isArray(profile.blocks) &&
                                profile.blocks.length > 0 ? (
                                    <div className="space-y-5">
                                        <BlockRenderer
                                            blocks={
                                                isPro
                                                    ? profile.blocks
                                                    : profile.blocks.slice(0, 3)
                                            }
                                            theme={theme}
                                            separated={true}
                                        />
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <MdInbox className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                        <p className="text-white/60">
                                            ยังไม่มีบล็อกในโปรไฟล์นี้
                                        </p>
                                    </div>
                                )}
                        {/* Yellow branding bar for free users */}
                        {!isPro && (
                            <div className="mt-6 rounded-xl border border-yellow-300/30 bg-yellow-400/90 text-gray-900 text-center py-3 px-4 font-medium text-sm">
                                อยากมีโปรไฟล์แบบนี้?{" "}
                                <Link href="/pro" className="underline font-bold hover:text-gray-700">
                                    มาสร้างกับเรา
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
                {/* Page footer with logo link */}
                <footer className="mt-8 mb-2 flex justify-center">
                    <Link
                        href="/"
                        className="text-sm font-extrabold bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] bg-clip-text text-transparent hover:opacity-90"
                        title="กลับสู่หน้าหลัก"
                    >
                        Vexto
                    </Link>
                </footer>
            </div>
        </>
    );
}
