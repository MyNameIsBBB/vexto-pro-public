// Shared example profiles used across pages
export const streamerProfile = {
    id: "streamer",
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
    ],
};

export const personalProfile = {
    id: "personal",
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
    ],
};

export const shopProfile = {
    id: "shop",
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
        primary: "#0d9488",
        accent: "#0f766e",
        background: "#f8fafc",
        textColor: "#0f172a",
        borderRadius: "sharp",
        fontFamily: "sarabun",
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
        { id: "d3", type: "divider", props: {} },
        {
            id: "h-prod",
            type: "header",
            props: { title: "🛍️ สินค้าแนะนำ", size: "default" },
        },
        {
            id: "prod1",
            type: "products",
            props: {
                variant: "image-grid",
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
        {
            id: "h-hrs",
            type: "header",
            props: { title: "🕒 เวลาเปิด-ปิด", size: "default" },
        },
        {
            id: "hours1",
            type: "hours",
            props: {
                items: [
                    { day: "จันทร์-ศุกร์", time: "10:00 - 20:00" },
                    { day: "เสาร์-อาทิตย์", time: "10:00 - 18:00" },
                ],
                note: "ปิดทุกวันอังคารแรกของเดือน",
            },
        },
        { id: "d2", type: "divider", props: {} },
        {
            id: "h-sv",
            type: "header",
            props: { title: "💆‍♀️ บริการของเรา", size: "default" },
        },
        {
            id: "sv1",
            type: "services",
            props: {
                items: [
                    { name: "นวดแผนไทย", desc: "60 นาที", price: "฿350" },
                    { name: "นวดน้ำมัน", desc: "90 นาที", price: "฿690" },
                    { name: "สปาเท้า", desc: "45 นาที", price: "฿250" },
                ],
            },
        },
        { id: "d3", type: "divider", props: {} },
        {
            id: "loc1",
            type: "location",
            props: {
                address: "123 ถนนสุขุมวิท\nคลองเตย กรุงเทพฯ 10110",
                mapUrl: "https://maps.google.com/?q=Bangkok",
                note: "จอดรถได้ที่ลานด้านหลัง",
            },
        },
        {
            id: "ct1",
            type: "contact-info",
            props: {
                phone: "081-234-5678",
                line: "https://line.me/ti/p/~sooksabai",
                website: "https://sooksabai.example.com",
            },
        },
    ],
};

export const examples = [
    {
        id: streamerProfile.id,
        name: "🎮 สตรีมเมอร์",
        profile: streamerProfile,
        color: "from-purple-500 to-cyan-500",
    },
    {
        id: personalProfile.id,
        name: "👤 คนทั่วไป",
        profile: personalProfile,
        color: "from-pink-500 to-rose-500",
    },
    {
        id: shopProfile.id,
        name: "🏪 ร้านค้า/บริการ",
        profile: shopProfile,
        color: "from-emerald-500 to-teal-500",
    },
];
