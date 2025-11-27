"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import html2canvas from "html2canvas";
import Link from "next/link";
import BlockRenderer from "@/components/BlockRenderer";
import SocialIcons from "@/components/SocialIcons";
import { MdErrorOutline, MdInbox, MdShare, MdQrCode2 } from "react-icons/md";
import QRCode from "qrcode";

export default function UserProfile() {
    const { username } = useParams();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isExporting, setIsExporting] = useState(false);
    const profileRef = useRef(null);

    // Fetch profile data
    useEffect(() => {
        async function fetchProfile() {
            try {
                setLoading(true);
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
                const res = await fetch(`${apiUrl}/profiles/${username}`);
                if (!res.ok) {
                    if (res.status === 404) throw new Error("ไม่พบโปรไฟล์นี้");
                    throw new Error("เกิดข้อผิดพลาดในการโหลดข้อมูล");
                }
                const data = await res.json();
                setProfile(data);
                setError(null);
            } catch (e) {
                console.error("Error fetching profile:", e);
                setError(e.message);
            } finally {
                setLoading(false);
            }
        }
        if (username) fetchProfile();
        else setLoading(false);
    }, [username]);

    const theme = profile?.theme || {};
    const isPro = Boolean(profile?.isPro);

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
        } catch (_) {}
    };

    const handleExportQrCode = async () => {
        try {
            const url =
                typeof window !== "undefined" ? window.location.href : "";
            if (!url) return;
            const dataUrl = await QRCode.toDataURL(url, {
                errorCorrectionLevel: "H",
                width: 512,
                margin: 1,
                color: { dark: "#111827", light: "#ffffff" },
            });
            const safeName = (profile?.displayName || "profile").replace(
                /[^a-z0-9]/gi,
                "_"
            );
            const a = document.createElement("a");
            a.href = dataUrl;
            a.download = `${safeName}_qr.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (e) {
            console.error("QR Export Error:", e);
            alert("Failed to export QR code");
        }
    };

    const handleExportProfileAsImage = async (format = "png") => {
        if (!profileRef.current) return;
        let yellowBar = null;
        let prevYellowDisplay = null;
        let prevBorderRadius = null;
        try {
            setIsExporting(true);
            const target = profileRef.current;
            prevBorderRadius = target.style.borderRadius;
            target.style.borderRadius = "0";
            yellowBar = target.querySelector("[data-free-bar]");
            if (yellowBar) {
                prevYellowDisplay = yellowBar.style.display;
                yellowBar.style.display = "none";
            }
            const originalOverflow = target.style.overflow;
            target.style.overflow = "visible";
            if (getComputedStyle(target).position === "static")
                target.style.position = "relative";
            const canvas = await html2canvas(target, {
                scale: 2,
                useCORS: true,
                backgroundColor: null,
                windowWidth: document.documentElement.clientWidth,
                windowHeight: target.scrollHeight,
            });
            target.style.overflow = originalOverflow;
            const safeName = (profile?.displayName || "profile").replace(
                /[^a-z0-9]/gi,
                "_"
            );
            const dataUrl =
                format === "jpg"
                    ? canvas.toDataURL("image/jpeg", 0.9)
                    : canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = dataUrl;
            link.download = `${safeName}.${format}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (e) {
            console.error("Image Export Error:", e);
            alert("Failed to export image");
        } finally {
            if (yellowBar) yellowBar.style.display = prevYellowDisplay || "";
            if (prevBorderRadius !== null)
                profileRef.current.style.borderRadius = prevBorderRadius;
            setIsExporting(false);
        }
    };

    if (!profile && loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white/70">
                กำลังโหลด...
            </div>
        );
    }
    if (!profile && error) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 text-center text-white/80">
                <div>
                    <MdErrorOutline className="w-12 h-12 mx-auto mb-4 opacity-70" />
                    <h2 className="text-2xl font-bold mb-2">เกิดข้อผิดพลาด</h2>
                    <p className="mb-6">{error}</p>
                    <Link
                        href="/"
                        className="inline-block px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] text-white text-sm font-medium hover:opacity-90 transition"
                    >
                        กลับหน้าหลัก
                    </Link>
                </div>
            </div>
        );
    }
    if (!profile) return null;

    return (
        <>
            <div className="min-h-screen w-full" style={buildOuterBg(theme)}>
                <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10">
                    <div
                        className="flex justify-end gap-2 mb-4"
                        data-html2canvas-ignore="true"
                    >
                        <button
                            onClick={handleShare}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-sm"
                            title="แชร์ลิงก์"
                            aria-label="แชร์ลิงก์"
                        >
                            <MdShare className="h-5 w-5" />
                            <span className="hidden sm:inline">แชร์</span>
                        </button>
                        <button
                            onClick={() => handleExportProfileAsImage("png")}
                            disabled={isExporting}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 disabled:opacity-60 text-white text-sm"
                            title="บันทึกเป็น PNG"
                            aria-label="บันทึกเป็น PNG"
                        >
                            PNG
                        </button>
                        <button
                            onClick={handleExportQrCode}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-sm"
                            title="ส่งออกเป็น QR"
                            aria-label="ส่งออกเป็น QR"
                        >
                            <MdQrCode2 className="h-5 w-5" />
                            <span className="hidden sm:inline">QR</span>
                        </button>
                    </div>

                    <div
                        ref={profileRef}
                        className="relative max-w-3xl mx-auto rounded-2xl shadow-xl overflow-hidden"
                        style={buildInnerBg(theme)}
                    >
                        {!isPro && (
                            <div
                                data-free-bar
                                className="bg-yellow-400 text-black text-center text-sm py-2"
                            >
                                สร้างโปรไฟล์ฟรีที่ vexto.pro
                            </div>
                        )}

                        <div className="p-6 sm:p-8" style={{ fontFamily }}>
                            <div className="flex items-center gap-4 mb-6">
                                {profile?.avatarUrl && (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={profile.avatarUrl}
                                        alt=""
                                        className="h-20 w-20 rounded-full object-cover border border-white/20"
                                    />
                                )}
                                <div>
                                    <h1
                                        className="text-2xl sm:text-3xl font-bold"
                                        style={{ color: nameColor }}
                                    >
                                        {profile.displayName || username}
                                    </h1>
                                    {profile?.bio && (
                                        <p
                                            className="mt-1 text-sm sm:text-base opacity-80"
                                            style={{ color: bodyColor }}
                                        >
                                            {profile.bio}
                                        </p>
                                    )}
                                    {Array.isArray(profile?.socials) &&
                                        profile.socials.length > 0 && (
                                            <div className="mt-3">
                                                <SocialIcons
                                                    items={profile.socials}
                                                    theme={theme}
                                                />
                                            </div>
                                        )}
                                </div>
                            </div>

                            {Array.isArray(profile?.blocks) &&
                            profile.blocks.length > 0 ? (
                                <BlockRenderer
                                    blocks={profile.blocks}
                                    theme={theme}
                                />
                            ) : (
                                <div
                                    className="text-center py-16 opacity-80"
                                    style={{ color: bodyColor }}
                                >
                                    <MdInbox className="h-10 w-10 mx-auto mb-3 opacity-60" />
                                    <div>ยังไม่มีบล็อกเนื้อหา</div>
                                </div>
                            )}
                        </div>
                    </div>

                    <footer
                        className="mt-8 mb-2 flex justify-center"
                        data-html2canvas-ignore="true"
                    >
                        <Link
                            href="/"
                            className="text-sm text-white/60 hover:text-white/80 transition"
                        >
                            กลับหน้าหลัก
                        </Link>
                    </footer>
                </div>
            </div>
        </>
    );
}
