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

    console.log("🎯 Profile Page Rendered - Username:", username);

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchProfile() {
            try {
                setLoading(true);
                const apiUrl =
                    process.env.NEXT_PUBLIC_API_BASE_URL ||
                    "http://localhost:5001/api";
                
                console.log("Fetching profile for username:", username);
                console.log("API URL:", `${apiUrl}/profiles/${username}`);
                
                const response = await fetch(`${apiUrl}/profiles/${username}`);
                
                console.log("Response status:", response.status);

                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error("ไม่พบโปรไฟล์นี้");
                    }
                    throw new Error("เกิดข้อผิดพลาดในการโหลดข้อมูล");
                }

                const data = await response.json();
                console.log("Profile data loaded:", data);
                setProfile(data);
                setError(null);
            } catch (err) {
                console.error("Error fetching profile:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        console.log("Username from params:", username);
        if (username) {
            fetchProfile();
        } else {
            console.warn("No username provided, skipping fetch");
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
        return (
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
                <div className="max-w-md w-full text-center">
                    <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8">
                        <MdErrorOutline className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-white mb-2">
                            เกิดข้อผิดพลาด
                        </h1>
                        <p className="text-gray-400 mb-6">{error}</p>
                        <Link
                            href="/"
                            className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl transition-colors"
                        >
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
                    <div
                        className="rounded-2xl border p-4 sm:p-5"
                        style={{
                            borderColor: (theme?.textColor || "#f3f4f6") + "33",
                        }}
                    >
                        <div
                            className="rounded-xl overflow-hidden"
                            style={buildInnerBg(theme)}
                        >
                            <div
                                className="relative rounded-3xl border border-white/10 p-4 sm:p-6 md:p-8 shadow-2xl backdrop-blur-md bg-white/[0.02] hover:border-white/20 transition-all duration-300"
                                style={{ fontFamily }}
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
                            </div>
                            {/* Yellow branding bar for free users */}
                            {!isPro && (
                                <div className="bg-yellow-400 text-gray-900 text-center py-3 px-4 font-medium text-sm">
                                    อยากมีโปรไฟล์แบบนี้?{" "}
                                    <Link
                                        href="/pro"
                                        className="underline font-bold hover:text-gray-700"
                                    >
                                        มาสร้างกับเรา
                                    </Link>
                                </div>
                            )}
                            {/* Removed old back button footer */}
                        </div>
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
