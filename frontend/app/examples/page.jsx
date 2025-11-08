"use client";

import { useState } from "react";
import { MdOpenInFull } from "react-icons/md";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlockRenderer from "@/components/BlockRenderer";
import SocialIcons from "@/components/SocialIcons";
import Link from "next/link";

// Example 1: Streamer/Creator
const streamerProfile = {
    displayName: "NOVA Gaming",
    avatarUrl:
        "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600&auto=format&fit=crop",
    bio: "Professional Gamer & Content Creator",
    socials: [
        { label: "Twitch", url: "https://twitch.tv/nova" },
        { label: "YouTube", url: "https://youtube.com/@nova" },
        { label: "Instagram", url: "https://instagram.com/nova" },
        { label: "Discord", url: "https://discord.gg/nova" },
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
                name: "NOVA Gamer",
                role: "Pro Gamer & Streamer",
                location: "Bangkok, Thailand",
                email: "contact@novagaming.com",
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
                url: "https://twitch.tv/nova",
                size: "large",
            },
        },
        {
            id: "link2",
            type: "link",
            props: {
                label: "▶️ คลิปไฮไลท์ที่ YouTube",
                url: "https://youtube.com/@nova",
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
                url: "https://ko-fi.com/nova",
            },
        },
        { id: "d6", type: "divider", props: {} },
        {
            id: "q1",
            type: "quote",
            props: {
                text: "เล่นเพื่อความสนุก ชนะเพื่อความภูมิใจ แพ้ก็ไม่เป็นไร แค่อย่าเลิกพยายาม",
                author: "— NOVA",
            },
        },
    ],
};

// Example 2: Personal/Developer
const personalProfile = {
    displayName: "Peeratus Dev",
    avatarUrl:
        "https://scontent.fbkk31-1.fna.fbcdn.net/v/t39.30808-6/515921538_122113506404911951_4184501037251844362_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=_r7bn3KgGHUQ7kNvwFYyIer&_nc_oc=AdnGHFAltY-_vJc6z0IsevUhRS4U4CiY7Go1gEQp8ecWnDMnFzCFnAdd55rHXw56MX4&_nc_zt=23&_nc_ht=scontent.fbkk31-1.fna&_nc_gid=USzMo_nXrVvV9kPRGDuIMA&oh=00_AfhP6McLKVWAp9HWJDwZH8lsxkWG5pB6CDW0451hug3pfA&oe=690E47DC",
    bio: "Full Stack Developer & Designer",
    socials: [
        { label: "GitHub", url: "https://github.com/yourusername" },
        { label: "LinkedIn", url: "https://linkedin.com/in/you" },
        { label: "X", url: "https://x.com/you" },
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
                url: "https://ko-fi.com/example",
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
        { label: "Facebook", url: "https://facebook.com/spa" },
        { label: "Line", url: "https://line.me/spa" },
        { label: "Phone", url: "tel:0812345678" },
        { label: "Instagram", url: "https://instagram.com/spa" },
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
                url: "https://line.me/spa",
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

export default function ExamplesPage() {
    const sanitizeProfile = (p) => {
        const clone = JSON.parse(JSON.stringify(p));
        // Make all external links point to this examples page (internal), to avoid navigating out
        const internal = "/examples";
        // socials
        clone.socials = (clone.socials || []).map((s) => ({
            label: s.label,
            url: internal,
        }));
        // blocks
        clone.blocks = (clone.blocks || []).map((b) => {
            const nb = { ...b, props: { ...(b.props || {}) } };
            // Common url fields
            if (nb.props && typeof nb.props.url === "string") nb.props.url = internal;
            if (nb.props && typeof nb.props.mapUrl === "string") nb.props.mapUrl = internal;
            if (nb.props && typeof nb.props.website === "string") nb.props.website = internal;
            if (nb.props && typeof nb.props.line === "string") nb.props.line = internal;
            // Collections with items that may contain url
            if (Array.isArray(nb.props?.items)) {
                nb.props.items = nb.props.items.map((it) => {
                    const ni = { ...it };
                    if (typeof ni.url === "string") ni.url = internal;
                    return ni;
                });
            }
            return nb;
        });
        return clone;
    };

    const profiles = [
        {
            id: "streamer",
            name: "🎮 สตรีมเมอร์",
            profile: sanitizeProfile(streamerProfile),
            color: "from-purple-500 to-cyan-500",
        },
        {
            id: "personal",
            name: "👤 คนทั่วไป",
            profile: sanitizeProfile(personalProfile),
            color: "from-pink-500 to-rose-500",
        },
        {
            id: "shop",
            name: "🏪 ร้านค้า/บริการ",
            profile: sanitizeProfile(shopProfile),
            color: "from-emerald-500 to-teal-500",
        },
    ];

    const [selectedProfile, setSelectedProfile] = useState(profiles[0]);
    const formalMode =
        selectedProfile.profile.theme?.variant === "formal" ||
        selectedProfile.id === "shop";

    return (
        <>
            <Navbar />
            <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

function ProfileCard({ profile, profileId }) {
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

    const isFormal =
        profile.theme?.variant === "formal" || profileId === "shop";

    // Map font family for header area to match BlockRenderer
    const fontMap = {
        prompt: "var(--font-prompt)",
        kanit: "var(--font-kanit)",
        sarabun: "var(--font-sarabun)",
    };
    const fontFamily = fontMap[profile.theme?.fontFamily] || fontMap.prompt;

    return (
        <div
            className={
                isFormal
                    ? "relative rounded-lg border border-gray-200 p-8 md:p-10 shadow-sm bg-white"
                    : "relative rounded-3xl border border-white/10 p-8 md:p-10 shadow-2xl backdrop-blur-md bg-white/[0.02] hover:border-white/20 transition-all duration-300"
            }
            style={{ ...cardBgStyle, fontFamily }}
        >
            {/* View Fullscreen Button */}
            <div className="absolute top-4 right-4 z-10">
                <Link
                    href={`/examples/preview/${profileId}`}
                    className={
                        isFormal
                            ? "inline-flex items-center gap-2 px-3.5 py-2 rounded-md bg-white border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
                            : "inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-medium transition-all hover:scale-105 backdrop-blur-sm"
                    }
                >
                    <MdOpenInFull className="w-4 h-4" />
                    ดูแบบเต็มจอ
                </Link>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-start gap-5 mb-8">
                {profile.avatarUrl ? (
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
                                ? profile.theme?.textColor || "#111827"
                                : profile.theme?.accent || "#22d3ee",
                        }}
                    >
                        {profile.displayName}
                    </div>
                    <p
                        className={
                            isFormal
                                ? "text-base text-gray-700 leading-relaxed"
                                : "text-base text-white/80 leading-relaxed"
                        }
                    >
                        {profile.bio}
                    </p>
                </div>
            </div>

            {profile.socials && profile.socials.length > 0 && (
                <div className="mb-8">
                    <SocialIcons
                        items={profile.socials}
                        theme={profile.theme}
                    />
                </div>
            )}

            <div className="space-y-5">
                <BlockRenderer
                    blocks={profile.blocks || []}
                    theme={profile.theme}
                    separated={true}
                />
            </div>
        </div>
    );
}
