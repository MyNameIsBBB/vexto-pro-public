"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import html2canvas from "html2canvas";
import Link from "next/link";
import BlockRenderer from "@/components/BlockRenderer";
import SocialIcons from "@/components/SocialIcons";
import {
    MdErrorOutline,
    MdInbox,
    MdOutlineIosShare,
    MdShare,
} from "react-icons/md";

export default function UserProfile() {
    const params = useParams();
    const username = params.username;

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    setIsExporting(true);
    const target = profileRef.current;

    // Store original styles
    prevBorderRadius = target.style.borderRadius;
    prevPaddingBottom = target.style.paddingBottom;

    // Apply temporary export styles (no watermark padding needed now)
    target.style.borderRadius = "0";

    // Hide the free-user bar
    yellowBar = target.querySelector("[data-free-bar]");
    if (yellowBar) {
        prevYellowDisplay = yellowBar.style.display;
        yellowBar.style.display = "none";
    }

    const originalOverflow = target.style.overflow;
    target.style.overflow = "visible";

    // Ensure container positioning if needed (not strictly required without watermark but kept for consistency)
    if (getComputedStyle(target).position === "static") {
        target.style.position = "relative";
    }
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
            // ignore
        }
    };

    const handleExportProfileAsImage = async (format = "png") => {
        if (!profileRef.current) return;

        let yellowBar = null;
        let prevYellowDisplay = null;
        let prevBorderRadius = null;
        let prevPaddingBottom = null; // 1. Track previous padding

        try {
            setIsExporting(true);
            const target = profileRef.current;

            // --- Store original styles ---
            prevBorderRadius = target.style.borderRadius;
            prevPaddingBottom = target.style.paddingBottom; // Store original padding

            // --- Apply temporary export styles ---
            target.style.borderRadius = "0";
            target.style.paddingBottom = "40px"; // 2. Add extra padding at the bottom of the image

            // Hide the "Create Free Profile" bar if it exists
            yellowBar = target.querySelector("[data-free-bar]");
            if (yellowBar) {
                prevYellowDisplay = yellowBar.style.display;
                yellowBar.style.display = "none";
            }

            const originalOverflow = target.style.overflow;
            target.style.overflow = "visible";

            const buildWatermark = () => {
                const ffMap = {
                    prompt: "Prompt",
                    kanit: "Kanit",
                    sarabun: "Sarabun",
                };
                console.log("theme fontFamily:", theme?.fontFamily);
                const wmFont = ffMap[theme?.fontFamily];

                const container = document.createElement("div");
                container.setAttribute("data-export-watermark", "true");

                // 3. Use Flexbox for perfect alignment
                Object.assign(container.style, {
                    position: "absolute",
                    bottom: "12px", // Moved up slightly to sit inside the new padding
                    right: "12px",
                    display: "flex", // Key fix for alignment
                    alignItems: "baseline", // Aligns text based on the font baseline
                    gap: "4px", // Spacing between "made by" and "Vexto"
                    pointerEvents: "none",
                    fontFamily: wmFont,
                    fontSize: "14px",
                    lineHeight: "1",
                    opacity: "0.85",
                    zIndex: "30",
                    letterSpacing: "0.25px",
                });

                const madeText = document.createElement("span");
                madeText.textContent = "made by ";
                madeText.style.color = nameColor || "#e5e7eb";
                madeText.style.fontWeight = "400";
                // Remove display: inline-block here, let flex handle it

                const brandText = document.createElement("span");
                brandText.textContent = "Vexto";

                // 4. Gradient Fix: Ensure strict webkit support and block behavior
                Object.assign(brandText.style, {
                    backgroundImage: "linear-gradient(90deg, #7c3aed, #22d3ee)", // Use backgroundImage property explicitly
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text", // Crucial for html2canvas
                    color: "transparent",
                    // Remove vertical-align, flex handles it
                });

                container.appendChild(madeText);
                container.appendChild(brandText);

                return container;
            };

            const watermarkEl = buildWatermark();

            // Ensure relative positioning for absolute child
            if (getComputedStyle(target).position === "static") {
                target.style.position = "relative";
            }

            target.appendChild(watermarkEl);

            const canvas = await html2canvas(target, {
                scale: 2, // Higher quality
                useCORS: true,
                backgroundColor: null, // Keeps transparency if set in CSS
                windowWidth: document.documentElement.clientWidth,
                windowHeight: target.scrollHeight,
                // 5. Sometimes html2canvas needs this to render text gradients correctly
                onclone: (clonedDoc) => {
                    const clonedBrand = clonedDoc.querySelector(
                        "[data-export-watermark] span:last-child"
                    );
                    if (clonedBrand) {
                        clonedBrand.style.webkitBackgroundClip = "text";
                    }
                },
            });

            // Restore styles immediately
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
        } catch (err) {
            console.error("Image Export Error:", err);
            alert("Failed to export image");
        } finally {
            // --- Cleanup & Restore ---
            if (yellowBar) yellowBar.style.display = prevYellowDisplay || "";
            if (prevBorderRadius !== null)
                profileRef.current.style.borderRadius = prevBorderRadius;
            if (prevPaddingBottom !== null)
                profileRef.current.style.paddingBottom = prevPaddingBottom;
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
            {/* Full-viewport themed background behind content (covers layout bg) */}
            <div
                className="fixed inset-0 z-0"
                style={buildOuterBg(theme)}
                aria-hidden
            />
            <div className="relative z-10 min-h-screen p-4 sm:p-6">
                <div className="max-w-4xl mx-auto">
                    {/* Single main content frame with inner background */}
                    <div
                        ref={profileRef}
                        className="relative rounded-3xl border border-white/10 p-4 sm:p-6 md:p-8 shadow-2xl backdrop-blur-md hover:border-white/20 transition-all duration-300"
                        style={{ ...buildInnerBg(theme), fontFamily }}
                    >
                        {/* Actions top-right (excluded from export capture via data-html2canvas-ignore) */}
                        <div
                            className="absolute top-2 right-2 sm:top-3 sm:right-3 flex gap-2"
                            data-html2canvas-ignore="true"
                        >
                            <button
                                onClick={handleShare}
                                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition backdrop-blur-sm border border-white/15 shadow"
                                title="แชร์โปรไฟล์"
                            >
                                <MdShare className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                            <button
                                onClick={() =>
                                    handleExportProfileAsImage("png")
                                }
                                disabled={isExporting}
                                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition backdrop-blur-sm border border-white/15 shadow disabled:opacity-40 disabled:cursor-not-allowed"
                                title="บันทึกเป็น PNG"
                            >
                                {isExporting ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <MdOutlineIosShare className="w-4 h-4 sm:w-5 sm:h-5 transform rotate-180" />
                                )}
                            </button>
                        </div>

                        <div className="flex flex-col items-center text-center gap-6 mb-10">
                            {/* Avatar with frame options */}
                            {profile.avatarUrl ? (
                                (() => {
                                    const frame = profile.avatarFrame || "none";
                                    if (frame === "gradient") {
                                        return (
                                            <div className="p-[3px] rounded-full bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] shadow-2xl mx-auto">
                                                <img
                                                    src={profile.avatarUrl}
                                                    crossOrigin="anonymous"
                                                    alt="avatar"
                                                    className="w-28 h-28 rounded-full object-cover"
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
                                            crossOrigin="anonymous"
                                            alt="avatar"
                                            className={`w-28 h-28 rounded-full object-cover mx-auto ${ringClass} shadow-xl`}
                                        />
                                    );
                                })()
                            ) : (
                                <div className="w-28 h-28 rounded-full bg-white/10 border-2 border-white/20 mx-auto" />
                            )}
                            <div className="text-center mt-2">
                                <div
                                    className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3"
                                    style={{ color: nameColor }}
                                >
                                    {profile.displayName}
                                </div>
                                {profile.bio && (
                                    <p
                                        className="text-base md:text-lg leading-relaxed max-w-2xl mx-auto"
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
                            <div className="space-y-5" data-pdf-blocks>
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
                        {/* Yellow branding bar for free users (ignored in PDF export) */}
                        {!isPro && (
                            <div
                                data-free-bar
                                className="mt-6 rounded-xl border border-yellow-300/30 bg-yellow-400/90 text-gray-900 text-center py-3 px-4 font-medium text-sm"
                            >
                                อยากมีโปรไฟล์แบบนี้?{" "}
                                <Link
                                    href="/pro"
                                    className="underline font-bold hover:text-gray-700"
                                >
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
