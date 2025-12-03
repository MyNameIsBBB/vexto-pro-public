"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { exampleProfiles } from "@/lib/examplesData";
import BlockRenderer from "@/components/BlockRenderer";
import SocialIcons from "@/components/SocialIcons";

export default function ExamplePreviewPage() {
    const params = useParams();
    const profileId = params.id;

    // Find the matching profile
    const profileData = exampleProfiles.find((p) => p.id === profileId);

    if (!profileData) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-white mb-4">
                        ไม่พบโปรไฟล์ตัวอย่างนี้
                    </h1>
                    <Link
                        href="/examples"
                        className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                    >
                        กลับไปหน้าตัวอย่าง
                    </Link>
                </div>
            </div>
        );
    }

    const { profile } = profileData;
    const isFormal = profile.theme?.variant === "formal" || profileId === "shop";

    // Map font family
    const fontMap = {
        prompt: "var(--font-prompt)",
        kanit: "var(--font-kanit)",
        sarabun: "var(--font-sarabun)",
    };
    const fontFamily = fontMap[profile.theme?.fontFamily] || fontMap.prompt;

    // Build background style
    const scope = profile.theme?.backgroundScope || "card";
    const outerBgStyle =
        scope === "full"
            ? {
                  background: profile.theme?.background || "#0a0a0f",
                  backgroundImage: profile.theme?.backgroundImage
                      ? `url(${profile.theme.backgroundImage})`
                      : undefined,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
              }
            : { background: "#0a0a0f" };

    const cardBgStyle =
        scope === "card"
            ? {
                  background: profile.theme?.background,
                  backgroundImage: profile.theme?.backgroundImage
                      ? `url(${profile.theme.backgroundImage})`
                      : undefined,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
              }
            : {};

    return (
        <div className="min-h-screen" style={{ ...outerBgStyle, fontFamily }}>
            {/* Back Button */}
            <div className="fixed top-4 left-4 z-50">
                <Link
                    href="/examples"
                    className={
                        isFormal
                            ? "inline-flex items-center gap-2 px-4 py-2 rounded-md bg-white border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
                            : "inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-medium transition-all backdrop-blur-sm"
                    }
                >
                    ← กลับ
                </Link>
            </div>

            {/* CTA Banner */}
            <div className="fixed top-4 right-4 z-50">
                <Link
                    href="/register"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white text-sm font-medium transition-all shadow-lg hover:scale-105"
                >
                    สร้างโปรไฟล์ฟรี →
                </Link>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 py-16">
                <div
                    className={
                        isFormal
                            ? "rounded-lg border border-gray-200 p-8 md:p-10 shadow-sm bg-white"
                            : "rounded-3xl border border-white/10 p-8 md:p-10 shadow-2xl backdrop-blur-md bg-white/[0.02]"
                    }
                    style={cardBgStyle}
                >
                    {/* Avatar & Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start gap-6 mb-8">
                        {profile.avatarUrl ? (
                            <img
                                src={profile.avatarUrl}
                                alt="avatar"
                                className={
                                    isFormal
                                        ? "w-32 h-32 rounded-md object-cover border border-gray-200 shadow-sm"
                                        : "w-32 h-32 rounded-2xl object-cover border-2 border-white/20 shadow-xl"
                                }
                            />
                        ) : (
                            <div
                                className={
                                    isFormal
                                        ? "w-32 h-32 rounded-md bg-gray-100 border border-gray-200"
                                        : "w-32 h-32 rounded-2xl bg-white/10 border-2 border-white/20"
                                }
                            />
                        )}
                        <div className="flex-1">
                            <div
                                className="text-4xl font-bold mb-3"
                                style={{
                                    color: isFormal
                                        ? profile.theme?.textColor || "#111827"
                                        : profile.theme?.accent || "#22d3ee",
                                }}
                            >
                                {profile.displayName}
                            </div>
                            <p
                                className={
                                    isFormal
                                        ? "text-lg text-gray-700 leading-relaxed"
                                        : "text-lg text-white/80 leading-relaxed"
                                }
                            >
                                {profile.bio}
                            </p>
                        </div>
                    </div>

                    {/* Social Icons */}
                    {profile.socials && profile.socials.length > 0 && (
                        <div className="mb-8">
                            <SocialIcons socials={profile.socials} theme={profile.theme} />
                        </div>
                    )}

                    {/* Blocks */}
                    <div className="space-y-6">
                        <BlockRenderer
                            blocks={profile.blocks || []}
                            theme={profile.theme}
                            separated={true}
                        />
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className="mt-8 text-center">
                    <div
                        className={
                            isFormal
                                ? "inline-flex flex-col sm:flex-row items-center gap-4 p-6 rounded-lg bg-white border border-gray-200 shadow-sm"
                                : "inline-flex flex-col sm:flex-row items-center gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
                        }
                    >
                        <span
                            className={
                                isFormal
                                    ? "text-gray-700 font-medium"
                                    : "text-white/90 font-medium"
                            }
                        >
                            ชอบตัวอย่างนี้ไหม? สร้างโปรไฟล์ของคุณเองได้เลย — ฟรี! 🎉
                        </span>
                        <Link
                            href="/register"
                            className={
                                isFormal
                                    ? "px-6 py-2.5 rounded-md bg-teal-600 hover:bg-teal-700 text-white font-medium transition-colors whitespace-nowrap"
                                    : "px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-medium transition-all hover:scale-105 whitespace-nowrap"
                            }
                        >
                            เริ่มต้นเลย →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
