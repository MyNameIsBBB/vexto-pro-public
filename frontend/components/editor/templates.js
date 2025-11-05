// Shared template sections used by both Edit and Test pages
// Keep IDs stable; add new variants with new IDs to avoid collisions
// *** UPDATED: header รวมอยู่ใน block แล้ว ไม่แยกเป็นบล็อกต่างหาก ***
// *** CATEGORIES: Free templates และ Premium templates (Pro only) ***

const templateSections = [
    {
        id: "intro-section",
        name: "👋 โปรไฟล์",
        icon: "👋",
        category: "โปรไฟล์",
        blocks: [
            {
                type: "profile",
                header: { title: "สวัสดีครับ/ค่ะ!" },
                props: {
                    name: "ชื่อของคุณ",
                    role: "อาชีพ/บทบาท",
                    variant: "image-grid",
                    location: "กรุงเทพฯ, ไทย",
                    email: "email@example.com",
                    bio: "เล่าเรื่องราวของคุณ...",
                },
            },
        ],
    },
    {
        id: "experience-section",
        name: "💼 ประวัติ / ประสบการณ์",
        icon: "💼",
        category: "โปรไฟล์",
        blocks: [
            {
                type: "experience",
                header: { title: "ประวัติ / ประสบการณ์" },
                props: {
                    items: [
                        {
                            title: "Frontend Developer — บริษัท A",
                            period: "2022 - ปัจจุบัน",
                            description:
                                "พัฒนาเว็บด้วย Next.js/Tailwind และดูแลระบบ CI/CD",
                        },
                        {
                            title: "Software Engineer — บริษัท B",
                            period: "2020 - 2022",
                            description:
                                "ออกแบบและพัฒนา API ด้วย Node.js/Express",
                        },
                    ],
                },
            },
        ],
    },
    {
        id: "skills-section",
        name: "🛠️ ทักษะ / เทคโนโลยี",
        icon: "🛠️",
        category: "โปรไฟล์",
        blocks: [
            {
                type: "skills",
                header: { title: "ทักษะ / เทคโนโลยี" },
                props: {
                    items: [
                        {
                            category: "Frontend",
                            skills: ["React", "Next.js", "Tailwind CSS"],
                        },
                        {
                            category: "Backend",
                            skills: ["Node.js", "Express", "MongoDB"],
                        },
                    ],
                },
            },
        ],
    },
    {
        id: "contact-section",
        name: "📝 ข้อความทั่วไป",
        icon: "📞",
        category: "เนื้อหา",
        blocks: [
            {
                type: "text",
                props: {
                    text: "พิมพ์ข้อความของคุณที่นี่",
                },
            },
        ],
    },
    {
        id: "schedule-section",
        name: "📅 ตาราง / คำถามพบบ่อย",
        icon: "📅",
        category: "อื่นๆ",
        blocks: [
            {
                type: "faq",
                header: { title: "ตาราง / คำถามพบบ่อย" },
                props: {
                    items: [
                        { q: "วันทำงาน", a: "20:00 - 23:00 น." },
                        { q: "เสาร์-อาทิตย์", a: "19:00 - เที่ยงคืน" },
                    ],
                },
            },
        ],
    },
    {
        id: "shop-products-section",
        name: "🧾 รายการการ์ด (สินค้า/โปรเจกต์)",
        icon: "🛍️",
        category: "ธุรกิจ",
        blocks: [
            {
                type: "products",
                header: { title: "รายการการ์ด" },
                props: {
                    items: [
                        {
                            name: "บาล์มนวดสมุนไพร",
                            price: "฿159",
                            desc: "บรรเทาปวดเมื่อย หอมผ่อนคลาย",
                            image: "https://images.unsplash.com/photo-1505575972945-290c4f58a4a6?w=600&auto=format&fit=crop",
                            url: "#",
                        },
                        {
                            name: "น้ำมันนวดอโรมา",
                            price: "฿299",
                            desc: "กลิ่นลาเวนเดอร์ออร์แกนิก",
                            image: "https://images.unsplash.com/photo-1511824409381-71f860bceeeb?w=600&auto=format&fit=crop",
                            url: "#",
                        },
                    ],
                },
            },
        ],
    },
    {
        id: "hours-section",
        name: "🕒 เวลาเปิด-ปิด",
        icon: "🕒",
        category: "ธุรกิจ",
        blocks: [
            {
                type: "hours",
                header: { title: "เวลาเปิด-ปิด" },
                props: {
                    items: [
                        { day: "จันทร์-ศุกร์", time: "10:00 - 20:00" },
                        { day: "เสาร์-อาทิตย์", time: "10:00 - 18:00" },
                    ],
                    note: "อาจมีการเปลี่ยนแปลงในวันหยุดนักขัตฤกษ์",
                },
            },
        ],
    },
    {
        id: "services-section",
        name: "💆‍♀️ บริการของเรา",
        icon: "💆‍♀️",
        category: "ธุรกิจ",
        blocks: [
            {
                type: "services",
                header: { title: "บริการของเรา" },
                props: {
                    items: [
                        { name: "นวดแผนไทย", desc: "60 นาที", price: "฿350" },
                        { name: "นวดน้ำมัน", desc: "90 นาที", price: "฿690" },
                        { name: "สปาเท้า", desc: "45 นาที", price: "฿250" },
                    ],
                },
            },
        ],
    },
    {
        id: "pricing-section",
        name: "💳 แพ็กเกจ/ราคา",
        icon: "💳",
        category: "ธุรกิจ",
        blocks: [
            {
                type: "pricing",
                header: { title: "แพ็กเกจ/ราคา" },
                props: {
                    items: [
                        {
                            title: "Basic",
                            price: "฿399",
                            features: ["บริการพื้นฐาน", "45 นาที"],
                        },
                        {
                            title: "Pro",
                            price: "฿699",
                            features: ["บริการครบ", "90 นาที"],
                        },
                        {
                            title: "VIP",
                            price: "฿999",
                            features: ["สปาพิเศษ", "120 นาที"],
                        },
                    ],
                },
            },
        ],
    },
    {
        id: "contact-location-section",
        name: "📞 ช่องทางติดต่อและที่ตั้ง",
        icon: "📞",
        category: "อื่นๆ",
        blocks: [
            {
                type: "contact-location",
                header: { title: "ติดต่อเรา" },
                props: {
                    phone: "081-234-5678",
                    email: "contact@example.com",
                    line: "https://line.me/ti/p/~yourline",
                    website: "https://example.com",
                    address:
                        "123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110",
                    mapUrl: "https://maps.google.com/?q=Bangkok",
                    note: "ตอบกลับในช่วงเวลาเปิดทำการ 9:00-18:00 น.",
                },
            },
        ],
    },
    {
        id: "stats-section",
        name: "📊 สถิติ/ตัวเลข",
        icon: "📊",
        category: "อื่นๆ",
        blocks: [
            {
                type: "stats",
                header: { title: "ตัวเลขของเรา" },
                props: {
                    items: [
                        {
                            label: "ผู้ติดตาม",
                            value: "10K+",
                            sub: "ทุกช่องทาง",
                        },
                        { label: "ชั่วโมงสตรีม", value: "500+", sub: "ปีนี้" },
                    ],
                },
            },
        ],
    },
    {
        id: "links-section",
        name: "🔗 ลิงก์",
        icon: "🔗",
        category: "ลิงก์",
        blocks: [
            {
                type: "link",
                props: { label: "เว็บไซต์", url: "https://example.com" },
            },
        ],
    },
    {
        id: "quote-section",
        name: "💭 คำคม",
        icon: "💭",
        category: "เนื้อหา",
        blocks: [
            {
                type: "quote",
                props: {
                    text: "คำคมหรือข้อความที่ชอบ",
                    author: "— ชื่อของคุณ",
                },
            },
        ],
    },
    {
        id: "projects-section",
        name: "🧩 โปรเจกต์",
        icon: "🧩",
        category: "อื่นๆ",
        blocks: [
            {
                type: "products",
                header: { title: "ผลงาน/โปรเจกต์" },
                props: {
                    items: [
                        {
                            name: "Portfolio Website",
                            price: "",
                            desc: "Next.js + Tailwind",
                            image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop",
                            url: "https://example.com",
                        },
                        {
                            name: "Mobile App",
                            price: "",
                            desc: "React Native UI",
                            image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&auto=format&fit=crop",
                            url: "#",
                        },
                        {
                            name: "Analytics Dashboard",
                            price: "",
                            desc: "Charts & KPIs",
                            image: "https://images.unsplash.com/photo-1517148815978-75f6acaaf32c?w=800&auto=format&fit=crop",
                            url: "#",
                        },
                    ],
                },
            },
        ],
    },
    {
        id: "gallery-section",
        name: "🖼️ แกลเลอรี",
        icon: "🖼️",
        category: "เนื้อหา",
        blocks: [
            {
                type: "gallery",
                header: { title: "แกลเลอรี" },
                props: {
                    images: [
                        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&auto=format&fit=crop",
                    ],
                },
            },
        ],
    },

    {
        id: "cta-section",
        name: "🚀 ปุ่มลิ้งค์",
        icon: "🚀",
        category: "ลิงก์",
        blocks: [{ type: "button", props: { label: "สมัครใช้งาน", url: "#" } }],
    },
    {
        id: "youtube-section",
        name: "📺 วิดีโอ YouTube/TikTok",
        icon: "📺",
        category: "อื่นๆ",
        blocks: [
            {
                type: "youtube",
                header: { title: "วิดีโอ" },
                props: {
                    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                },
            },
        ],
    },
    {
        id: "spotify-section",
        name: "🎵 Spotify Playlist",
        icon: "🎵",
        category: "อื่นๆ",
        blocks: [
            {
                type: "spotify",
                header: { title: "เพลย์ลิสต์" },
                props: {
                    url: "https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M",
                    height: "380px",
                },
            },
        ],
    },
    {
        id: "countdown-section",
        name: "⏰ นับเวลาถอยหลัง",
        icon: "⏰",
        category: "อื่นๆ",
        blocks: [
            {
                type: "countdown",
                header: { title: "นับถอยหลัง" },
                props: {
                    targetDate: new Date(
                        Date.now() + 7 * 24 * 60 * 60 * 1000
                    ).toISOString(),
                    description: "ถึงวันพิเศษ",
                },
            },
        ],
    },

    {
        id: "contact-form-section",
        name: "📝 แบบฟอร์มติดต่อ",
        icon: "📝",
        category: "อื่นๆ",
        blocks: [
            {
                type: "contact-form",
                header: { title: "ติดต่อเรา" },
                props: {
                    title: "ติดต่อเรา",
                    email: "your@email.com",
                },
            },
        ],
    },

    // ============== PREMIUM TEMPLATES (Pro Only) ==============
    {
        id: "premium-testimonials-section",
        name: "💎 รีวิวลูกค้า (Premium)",
        icon: "💎",
        category: "Premium",
        isPremium: true,
        blocks: [
            {
                type: "testimonials",
                header: { title: "ความคิดเห็นจากลูกค้า" },
                props: {
                    items: [
                        {
                            name: "คุณสมชาย",
                            role: "ลูกค้า",
                            text: "บริการดีมาก ประทับใจ แนะนำเลยครับ!",
                            avatar: "",
                        },
                        {
                            name: "คุณสมหญิง",
                            role: "ผู้ใช้บริการ",
                            text: "คุณภาพเยี่ยม จะกลับมาใช้บริการอีกแน่นอน",
                            avatar: "",
                        },
                    ],
                },
            },
        ],
    },
    {
        id: "premium-pricing-section",
        name: "💎 แพ็คเกจราคา (Premium)",
        icon: "💎",
        category: "Premium",
        isPremium: true,
        blocks: [
            {
                type: "pricing",
                header: { title: "แพ็คเกจของเรา" },
                props: {
                    items: [
                        {
                            name: "Basic",
                            price: "฿299/เดือน",
                            features: ["ฟีเจอร์ 1", "ฟีเจอร์ 2", "ฟีเจอร์ 3"],
                            highlight: false,
                        },
                        {
                            name: "Pro",
                            price: "฿599/เดือน",
                            features: [
                                "ฟีเจอร์ทั้งหมดใน Basic",
                                "ฟีเจอร์เพิ่มเติม 1",
                                "ฟีเจอร์เพิ่มเติม 2",
                                "Support 24/7",
                            ],
                            highlight: true,
                        },
                    ],
                },
            },
        ],
    },
    {
        id: "premium-team-section",
        name: "💎 ทีมงาน (Premium)",
        icon: "💎",
        category: "Premium",
        isPremium: true,
        blocks: [
            {
                type: "team",
                header: { title: "ทีมงานของเรา" },
                props: {
                    items: [
                        {
                            name: "คุณ A",
                            role: "CEO & Founder",
                            bio: "ผู้นำทีมด้วยประสบการณ์ 10+ ปี",
                            avatar: "",
                            social: {
                                linkedin: "",
                                twitter: "",
                            },
                        },
                        {
                            name: "คุณ B",
                            role: "CTO",
                            bio: "ผู้เชี่ยวชาญด้านเทคโนโลยี",
                            avatar: "",
                            social: {
                                linkedin: "",
                                twitter: "",
                            },
                        },
                    ],
                },
            },
        ],
    },
    {
        id: "premium-stats-section",
        name: "💎 สถิติ/ตัวเลข (Premium)",
        icon: "💎",
        category: "Premium",
        isPremium: true,
        blocks: [
            {
                type: "stats",
                header: { title: "ผลงานของเรา" },
                props: {
                    items: [
                        {
                            label: "ลูกค้าที่พึงพอใจ",
                            value: "1,000+",
                            icon: "👥",
                        },
                        {
                            label: "โปรเจกต์ที่สำเร็จ",
                            value: "500+",
                            icon: "✅",
                        },
                        { label: "ปีที่ดำเนินการ", value: "10+", icon: "🏆" },
                        { label: "รางวัลที่ได้รับ", value: "25+", icon: "🌟" },
                    ],
                },
            },
        ],
    },
    {
        id: "premium-timeline-section",
        name: "💎 ไทม์ไลน์ (Premium)",
        icon: "💎",
        category: "Premium",
        isPremium: true,
        blocks: [
            {
                type: "timeline",
                header: { title: "เส้นทางของเรา" },
                props: {
                    items: [
                        {
                            year: "2020",
                            title: "ก่อตั้งบริษัท",
                            description: "เริ่มต้นด้วยทีมเล็กๆ และความมุ่งมั่น",
                        },
                        {
                            year: "2022",
                            title: "ขยายธุรกิจ",
                            description: "เปิดสาขาใหม่และเพิ่มทีมงาน",
                        },
                        {
                            year: "2024",
                            title: "รางวัลแรก",
                            description: "ได้รับรางวัลธุรกิจดีเด่น",
                        },
                    ],
                },
            },
        ],
    },
];

// Category definitions (for future template page organization)
export const templateCategories = [
    {
        id: "free",
        name: "Free Templates",
        description: "เทมเพลตฟรีสำหรับทุกคน",
        templates: templateSections.filter((t) => !t.isPremium),
    },
    {
        id: "premium",
        name: "Premium Templates",
        description: "เทมเพลตพิเศษสำหรับ Pro เท่านั้น",
        templates: templateSections.filter((t) => t.isPremium),
    },
];

export default templateSections;
