"use client";

import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { exampleProfiles } from "@/lib/examplesData";
import ProfileCard from "@/components/examples/ProfileCard";

export default function ExamplesPage() {
    // Lightweight sanitization: avoid deep JSON cloning
    const sanitizeProfile = (p) => {
        const internal = "/examples";
        return {
            ...p,
            socials: (p.socials || []).map((s) => ({
                label: s.label,
                url: internal,
            })),
            blocks: (p.blocks || []).map((b) => {
                const props = { ...(b.props || {}) };
                ["url", "mapUrl", "website", "line"].forEach((key) => {
                    if (typeof props[key] === "string") props[key] = internal;
                });
                if (Array.isArray(props.items)) {
                    props.items = props.items.map((it) => {
                        const ni = { ...it };
                        if (typeof ni.url === "string") ni.url = internal;
                        return ni;
                    });
                }
                return { ...b, props };
            }),
        };
    };

    // Memoize profiles to prevent re-sanitizing on each render
    const profiles = useMemo(
        () =>
            exampleProfiles.map((p) => ({
                ...p,
                profile: sanitizeProfile(p.profile),
            })),
        []
    );

    const [selectedProfile, setSelectedProfile] = useState(profiles[0]);
    const formalMode =
        selectedProfile.profile.theme?.variant === "formal" ||
        selectedProfile.id === "shop";

    return (
        <>
            <Navbar />
            <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
                {!formalMode && (
                    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                        <div
                            className="absolute -top-24 -left-24 h-96 w-96 rounded-full blur-3xl opacity-30"
                            style={{
                                background:
                                    "radial-gradient(circle at center, rgba(124,58,237,0.5), transparent 60%)",
                            }}
                        />
                        <div
                            className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full blur-3xl opacity-30"
                            style={{
                                background:
                                    "radial-gradient(circle at center, rgba(34,211,238,0.5), transparent 60%)",
                            }}
                        />
                    </div>
                )}

                <div className="mx-auto max-w-5xl px-4 py-8 md:py-12">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            <span className="bg-gradient-to-r from-[#7c3aed] via-[#22d3ee] to-[#7c3aed] bg-clip-text text-transparent">
                                ตัวอย่างโปรไฟล์
                            </span>
                        </h1>
                        <p className="text-white/70 text-lg max-w-2xl mx-auto">
                            เลือกดูตัวอย่างโปรไฟล์ตามประเภทที่เหมาะกับคุณ
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-3 mb-10">
                        {profiles.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setSelectedProfile(item)}
                                className={`px-6 py-3 rounded-2xl font-medium text-sm transition-all ${
                                    selectedProfile.id === item.id
                                        ? `bg-gradient-to-r ${item.color} text-white shadow-lg scale-105`
                                        : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10"
                                }`}
                            >
                                {item.name}
                            </button>
                        ))}
                    </div>

                    <div className="mb-16">
                        <ProfileCard
                            profile={selectedProfile.profile}
                            profileId={selectedProfile.id}
                        />
                    </div>
                </div>

                <div className="fixed inset-x-0 bottom-4 z-50">
                    <div className="mx-auto max-w-5xl px-4">
                        <div className="rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 text-black px-5 py-3.5 shadow-2xl flex flex-wrap items-center justify-between gap-3 backdrop-blur-lg">
                            <span className="text-sm font-semibold">
                                ชอบไหม? 🎉 สร้างโปรไฟล์ของคุณเองได้เลย — ฟรี!
                            </span>
                            <Link
                                href="/register"
                                className="px-5 py-2 rounded-xl bg-black text-white text-sm hover:scale-105 transition-transform font-medium shadow-lg"
                            >
                                เริ่มต้นเลย →
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
