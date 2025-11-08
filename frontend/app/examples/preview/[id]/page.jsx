"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import BlockRenderer from "@/components/BlockRenderer";
import SocialIcons from "@/components/SocialIcons";
import Link from "next/link";

// Import same profile data
const streamerProfile = {
    displayName: "Peeratus Gaming",
    avatarUrl:
        "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600&auto=format&fit=crop",
    bio: "Professional Gamer & Content Creator",
    socials: [
        { label: "Twitch", url: "#" },
        { label: "YouTube", url: "#" },
        { label: "Instagram", url: "#" },
        { label: "Discord", url: "#" },
    ],
    theme: {
        primary: "#7c3aed",
        accent: "#22d3ee",
        background: "#0b1020",
        borderRadius: "12px",
        backgroundImage: null,
        backgroundScope: "card",
    },
    blocks: [
        { id: "h1", type: "header", props: { title: "👋 สวัสดีจ้า!" } },
        {
            id: "pr1",
            type: "profile",
            props: {
                name: "Peeratus Gamer",
                role: "Pro Gamer & Streamer",
                location: "Bangkok, Thailand",
                email: "contact@peeratusgaming.com",
                bio: "ว่าง ๆ ก็มาเปิดสตรีมเล่นเกม ส่วนใหญ่เล่น Valorant กับ Apex ชอบเล่นกับเพื่อน ๆ พูดคุยกับคนดู มีเรื่องสนุก ๆ เล่าให้ฟังบ่อย ๆ 😊",
            },
        },
        { id: "d1", type: "divider", props: {} },
        {
            id: "h2",
            type: "header",
            props: { title: "🎮 เล่นเกมมาตั้งแต่เมื่อไหร่?", size: "large" },
        },
        {
            id: "t1",
            type: "text",
            props: {
                text: "เริ่มจากเป็นแค่คนชอบเล่นเกม ก็ลองเปิดสตรีมดู ๆ ช่วงโควิด แล้วก็เริ่มมีคนเข้ามาดูเยอะขึ้นเรื่อย ๆ ตอนนี้เล่นมา 4 ปีแล้ว มีทีมเล็ก ๆ ของเราเองด้วย",
            },
        },
        {
            id: "link1",
            type: "link",
            props: {
                label: "🟣 ตามดูสดได้ที่ Twitch",
                url: "#",
                size: "large",
            },
        },
        {
            id: "link2",
            type: "link",
            props: {
                label: "▶️ คลิปไฮไลท์ที่ YouTube",
                url: "#",
                size: "large",
            },
        },
        { id: "d2", type: "divider", props: {} },
        {
            id: "h3",
            type: "header",
            props: { title: "📅 เปิดสตรีมเมื่อไหร่บ้าง?" },
        },
        {
            id: "f1",
            type: "faq",
            props: {
                items: [
                    {
                        q: "ศุกร์",
                        a: "20:00 - เที่ยงคืน | วันนี้จริงจังหน่อย จะพุ่ง Radiant 🔥",
                    },
                    {
                        q: "เสาร์",
                        a: "20:00 - ดึก | วันนี้ชิล ๆ เล่นกับเพื่อน ลองเกมใหม่ ๆ",
                    },
                    {
                        q: "อาทิตย์",
                        a: "19:00 - 23:00 | Apex แรงค์ หรือทัวร์นาเมนต์ถ้ามี",
                    },
                ],
            },
        },
        { id: "d3", type: "divider", props: {} },
        { id: "h4", type: "header", props: { title: "💬 เล่นเกมอะไรบ้าง?" } },
        {
            id: "t2",
            type: "text",
            props: {
                text: "ส่วนใหญ่เน้น FPS เป็นหลัก แต่บางวันก็เปลี่ยนบรรยากาศเล่นเกมอื่น ๆ ตามอารมณ์:",
            },
        },
        {
            id: "btn1",
            type: "button",
            props: { label: "🎯 Valorant (เกือบทุกวัน)", url: "#" },
        },
        {
            id: "btn2",
            type: "button",
            props: { label: "🔫 Apex Legends", url: "#" },
        },
        {
            id: "btn3",
            type: "button",
            props: { label: "💣 Counter-Strike 2", url: "#" },
        },
        {
            id: "t3",
            type: "text",
            props: {
                text: "วันที่อยากผ่อนคลาย: League of Legends, Minecraft, เกมสยองขวัญ (ถ้ากล้า 😅)",
            },
        },
        { id: "d4", type: "divider", props: {} },
        {
            id: "h5",
            type: "header",
            props: { title: "🌟 ยอดวิวไปถึงไหนแล้ว?" },
        },
        {
            id: "st1",
            type: "stats",
            props: {
                items: [
                    { label: "Followers", value: "52K+", sub: "ทุกช่องทาง" },
                    { label: "Stream Hours", value: "1,200+", sub: "2025" },
                    {
                        label: "Games",
                        value: "15+",
                        sub: "และเพิ่มขึ้นเรื่อย ๆ",
                    },
                ],
            },
        },
        { id: "d5", type: "divider", props: {} },
        { id: "h6", type: "header", props: { title: "☕ อยากซัพพอร์ตมั้ย?" } },
        {
            id: "sup1",
            type: "support",
            props: {
                title: "💜 ขอบคุณที่ติดตาม!",
                description:
                    "ถ้าอยากเห็นสตรีมที่ดีขึ้น อุปกรณ์ที่ดีขึ้น ทุกความช่วยเหลือมีค่ามากเลยจริง ๆ แค่มาคุยด้วยก็มีความสุขมากแล้ว 🙏",
                buttonLabel: "ซื้อกาแฟให้ซักแก้ว ☕",
                url: "#",
            },
        },
        { id: "d6", type: "divider", props: {} },
        {
            id: "q1",
            type: "quote",
            props: {
                text: "เล่นเพื่อความสนุก ชนะเพื่อความภูมิใจ แพ้ก็ไม่เป็นไร แค่อย่าเลิกพยายาม",
                author: "— Peeratus Gamer",
            },
        },
    ],
};

// Example 2: Personal/Developer
const personalProfile = {
    displayName: "Peeratus Dev",
    avatarUrl: "/images/image.png",
    bio: "Full Stack Developer & Designer",
    socials: [
        { label: "GitHub", url: "#" },
        { label: "LinkedIn", url: "#" },
        { label: "X", url: "#" },
    ],
    theme: {
        primary: "#ec4899",
        accent: "#f472b6",
        background: "#0b1020",
        borderRadius: "12px",
        backgroundImage: null,
        backgroundScope: "card",
    },
    blocks: [
        { id: "h1", type: "header", props: { title: "👋 สวัสดีครับ" } },
        {
            id: "pr1",
            type: "profile",
            props: {
                name: "Peeratus Vijijarunrung",
                role: "Software Engineer",
                location: "Bangkok, Thailand",
                email: "dev@example.com",
                bio: "นักศึกษาวิศวกรรมคอมพิวเตอร์ มหาวิทยาลัยเกษตรศาสตร์ ชอบสร้างโปรเจคเล็กๆ เพื่อทดลองไอเดียใหม่ๆ",
            },
        },
        { id: "d1", type: "divider", props: {} },
        { id: "h2", type: "header", props: { title: "💼 ผมทำอะไรมาบ้าง?" } },
        {
            id: "exp1",
            type: "experience",
            props: {
                items: [
                    {
                        title: "Freelance Full Stack Developer",
                        period: "2024 - ปัจจุบัน",
                        description:
                            "พัฒนาเว็บแอปพลิเคชันด้วย Next.js, React และ Node.js",
                    },
                    {
                        title: "Game Developer (FiveM)",
                        period: "2020 - ปัจจุบัน",
                        description:
                            "พัฒนา UI และระบบแบ็กเอนด์สำหรับเซิร์ฟเวอร์ RP ไทย",
                    },
                ],
            },
        },
        { id: "d2", type: "divider", props: {} },
        { id: "h3", type: "header", props: { title: "🛠️ เทคโนโลยีที่ใช้" } },
        {
            id: "sk1",
            type: "skills",
            props: {
                items: [
                    {
                        category: "Frontend",
                        skills: ["React", "Next.js", "Vue.js", "Tailwind CSS"],
                    },
                    {
                        category: "Backend",
                        skills: ["Node.js", "Express.js", "Prisma"],
                    },
                    {
                        category: "Database",
                        skills: ["MySQL", "PostgreSQL", "MongoDB"],
                    },
                    {
                        category: "Tools",
                        skills: ["Git", "Docker", "TypeScript"],
                    },
                ],
            },
        },
        { id: "d3", type: "divider", props: {} },
        { id: "h4", type: "header", props: { title: "💰 ชอบงานที่ผมทำมั้ย?" } },
        {
            id: "sup1",
            type: "support",
            props: {
                title: "☕ อุดหนุนกาแฟสักแก้ว",
                description:
                    "ทุกการสนับสนุนเป็นกำลังใจในการสร้างสรรค์ผลงานต่อไป",
                buttonLabel: "Buy me a coffee",
                url: "#",
            },
        },
        { id: "d4", type: "divider", props: {} },
        {
            id: "q1",
            type: "quote",
            props: {
                text: "Every moment that has passed gives today its meaning",
                author: "— Personal Quote",
            },
        },
    ],
};

// Example 3: Shop/Spa/Service
const shopProfile = {
    displayName: "สุขสบาย สปา & นวด",
    avatarUrl:
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=600&auto=format&fit=crop",
    bio: "สปาและนวดแผนไทย ด้วยความเอาใจใส่และมาตรฐานสูง",
    socials: [
        { label: "Facebook", url: "#" },
        { label: "Line", url: "#" },
        { label: "Phone", url: "#" },
        { label: "Instagram", url: "#" },
    ],
    theme: {
        // Muted teal formal palette
        primary: "#0d9488", // teal-600
        accent: "#0f766e", // teal-700
        background: "#f8fafc", // light bg
        textColor: "#0f172a", // slate-900
        borderRadius: "sharp", // formal straight corners
        fontFamily: "sarabun", // formal Thai font
        backgroundImage: null,
        backgroundScope: "full",
        variant: "formal",
    },
    blocks: [
        { id: "h1", type: "header", props: { title: "🌿 ยินดีต้อนรับ" } },
        {
            id: "pr1",
            type: "profile",
            props: {
                name: "สุขสบาย สปา & นวด",
                role: "Traditional Thai Massage & Wellness Spa",
                location: "123 ถนนสุขุมวิท คลองเตย กรุงเทพฯ 10110",
                email: "booking@sooksabai.com",
                bio: "ให้บริการนวดแผนไทยและสปาครบวงจร ด้วยนักนวดมืออาชีพที่ผ่านการฝึกอบรมมาเป็นอย่างดี สถานที่สะอาด บรรยากาศผ่อนคลาย",
            },
        },
        { id: "d1", type: "divider", props: {} },
        { id: "h2", type: "header", props: { title: "📖 เรื่องราวของเรา" } },
        {
            id: "t1",
            type: "text",
            props: {
                text: "เปิดให้บริการมาตั้งแต่ปี 2020 เริ่มจากร้านเล็ก ๆ ในย่านเอกมัย จนกระทั่งได้รับการตอบรับดี เราจึงขยายเป็นสาขาใหญ่ในสุขุมวิท และได้รับรางวัล Best Spa Award ในปี 2022 ด้วย",
            },
        },
        { id: "d2", type: "divider", props: {} },
        {
            id: "h3",
            type: "header",
            props: { title: "💆 บริการของเรา", size: "large" },
        },
        {
            id: "t2",
            type: "text",
            props: {
                text: "เราเน้นบริการนวดแผนไทยแท้ๆ และนวดน้ำมันอโรมาบำบัด พร้อมแพ็กเกจสปาครบวงจร:",
            },
        },
        {
            id: "btn1",
            type: "button",
            props: { label: "นวดไทยโบราณ — 300฿/ชม.", url: "#", size: "large" },
        },
        {
            id: "btn2",
            type: "button",
            props: { label: "นวดอโรมา — 400฿/ชม.", url: "#", size: "large" },
        },
        {
            id: "btn3",
            type: "button",
            props: { label: "นวดฝ่าเท้า — 250฿/ชม.", url: "#", size: "large" },
        },
        {
            id: "btn4",
            type: "button",
            props: {
                label: "แพ็กเกจสปา Full Day — 2,500฿",
                url: "#",
                size: "large",
            },
        },
        { id: "d3", type: "divider", props: {} },
        {
            id: "h4",
            type: "header",
            props: { title: "🕐 เปิดบริการเมื่อไหร่บ้าง?" },
        },
        {
            id: "f1",
            type: "faq",
            props: {
                items: [
                    {
                        q: "จันทร์ - ศุกร์",
                        a: "10:00 - 21:00 น. (รับคนสุดท้าย 20:00 น.)",
                    },
                    {
                        q: "เสาร์ - อาทิตย์",
                        a: "09:00 - 22:00 น. (รับคนสุดท้าย 21:00 น.)",
                    },
                    {
                        q: "วันหยุดนักขัตฤกษ์",
                        a: "เปิดตามปกติ แนะนำจองล่วงหน้า",
                    },
                ],
            },
        },
        { id: "d4", type: "divider", props: {} },
        {
            id: "h5",
            type: "header",
            props: { title: "⭐ ลูกค้าพึงพอใจแค่ไหน?" },
        },
        {
            id: "st1",
            type: "stats",
            props: {
                items: [
                    {
                        label: "ลูกค้าประจำ",
                        value: "500+",
                        sub: "ผู้ใช้บริการ",
                    },
                    { label: "คะแนนรีวิว", value: "4.9/5", sub: "จาก Google" },
                    { label: "ประสบการณ์", value: "4+ ปี", sub: "ในธุรกิจ" },
                ],
            },
        },
        { id: "d5", type: "divider", props: {} },
        { id: "h6", type: "header", props: { title: "📞 จองคิวได้ที่นี่" } },
        {
            id: "sup1",
            type: "support",
            props: {
                title: "🌿 จองคิวล่วงหน้า รับส่วนลด 10%",
                description:
                    "จองผ่านออนไลน์รับส่วนลดทันที | รับชำระเงินสด, PromptPay, บัตรเครดิต",
                buttonLabel: "จองเลย 📅",
                url: "#",
            },
        },
        { id: "d6", type: "divider", props: {} },
        {
            id: "q1",
            type: "quote",
            props: {
                text: "ความผ่อนคลายที่แท้จริง เริ่มต้นจากการดูแลตัวเอง",
                author: "— สุขสบาย สปา & นวด",
            },
        },
    ],
};

const profiles = {
    streamer: streamerProfile,
    personal: personalProfile,
    shop: shopProfile,
};

export default function PreviewPage() {
    // Prevent SSR/CSR markup mismatch by rendering only after mount
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    if (!mounted) return null;

    const params = useParams();
    const profileId = params.id;
    const profile = profiles[profileId] || streamerProfile;

    // Background handling to match Examples page behavior
    const scope = profile.theme?.backgroundScope || "card";
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
            : undefined;

    const pageBgStyle =
        scope === "full"
            ? {
                  background: profile.theme?.background,
                  backgroundImage: profile.theme?.backgroundImage
                      ? `url(${profile.theme.backgroundImage})`
                      : undefined,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
              }
            : undefined;

    // Map font family like BlockRenderer
    const fontMap = {
        prompt: "var(--font-prompt)",
        kanit: "var(--font-kanit)",
        sarabun: "var(--font-sarabun)",
    };
    const fontFamily = fontMap[profile.theme?.fontFamily] || fontMap.prompt;
    const isFormal =
        profile.theme?.variant === "formal" || profileId === "shop";

    return (
        <>
            {/* Optional full-screen background when scope is full */}
            {scope === "full" && (
                <div className="fixed inset-0 -z-10" style={pageBgStyle} />
            )}

            <main className="min-h-screen">
                <div className="pt-10 pb-20 px-4 sm:px-6 md:px-8">
                    <div className="max-w-5xl mx-auto">
                        {/* Card container copied from Examples ProfileCard for 1:1 look */}
                        <div
                            className={
                                isFormal
                                    ? "relative rounded-lg border border-gray-200 p-8 md:p-10 shadow-sm bg-white"
                                    : "relative rounded-3xl border border-white/10 p-8 md:p-10 shadow-2xl backdrop-blur-md bg-white/[0.02] hover:border-white/20 transition-all duration-300"
                            }
                            style={{ ...cardBgStyle, fontFamily }}
                        >
                            {/* Header: avatar + name + bio */}
                            <div className="flex flex-col sm:flex-row sm:items-start gap-5 mb-8">
                                {profile.avatarUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={profile.avatarUrl}
                                        alt="avatar"
                                        className={
                                            isFormal
                                                ? "w-24 h-24 rounded-md object-cover border border-gray-200 shadow-sm"
                                                : "w-24 h-24 rounded-2xl object-cover border-2 border-white/20 shadow-xl"
                                        }
                                    />
                                ) : (
                                    <div
                                        className={
                                            isFormal
                                                ? "w-24 h-24 rounded-md bg-gray-100 border border-gray-200"
                                                : "w-24 h-24 rounded-2xl bg-white/10 border-2 border-white/20"
                                        }
                                    />
                                )}
                                <div className="flex-1">
                                    <div
                                        className="text-3xl font-bold mb-2"
                                        style={{
                                            color: isFormal
                                                ? profile.theme?.textColor ||
                                                  "#111827"
                                                : profile.theme?.accent ||
                                                  "#22d3ee",
                                        }}
                                    >
                                        {profile.displayName}
                                    </div>
                                    {profile.bio && (
                                        <p
                                            className={
                                                isFormal
                                                    ? "text-base text-gray-700 leading-relaxed"
                                                    : "text-base text-white/80 leading-relaxed"
                                            }
                                        >
                                            {profile.bio}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {profile.socials && profile.socials.length > 0 && (
                                <div className="mb-8">
                                    <SocialIcons
                                        items={profile.socials}
                                        theme={profile.theme}
                                        disableLinks={true}
                                    />
                                </div>
                            )}

                            {/* Blocks */}
                            <div className="space-y-5">
                                <BlockRenderer
                                    blocks={profile.blocks || []}
                                    theme={profile.theme}
                                    disableLinks={true}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Go Back Button - Fixed Bottom Right */}
                <div className="fixed bottom-6 right-6 z-50">
                    <Link
                        href="/examples"
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gray-900 hover:bg-gray-800 border border-gray-700 font-medium transition-all hover:scale-105 backdrop-blur-md shadow-2xl"
                        style={{ color: "#f3f4f6" }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-5 h-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
                            />
                        </svg>
                        กลับ
                    </Link>
                </div>
            </main>
        </>
    );
}
