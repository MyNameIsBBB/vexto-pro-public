// Profile customization options
// แก้ไขค่าต่างๆ ได้ที่นี่โดยตรง ไม่ต้องแก้ในหน้า edit

// กรอบรูปโปรไฟล์
export const avatarFrameOptions = [
    {
        value: "none",
        label: "ไม่มี",
        preview: "ring-0",
        badge: "free",
    },
    {
        value: "ring-thin",
        label: "กรอบบาง",
        preview: "ring-2 ring-white/50",
        badge: "free",
    },
    {
        value: "ring-thick",
        label: "กรอบหนา",
        preview: "ring-4 ring-white",
        badge: "free",
    },
    {
        value: "gold-glow",
        label: "ทองเรืองแสง",
        preview: "ring-4 ring-yellow-500 shadow-lg shadow-yellow-500/50",
        badge: "premium",
    },
    {
        value: "gradient",
        label: "ไล่สี",
        preview: "ring-4 ring-gradient-to-r from-purple-500 to-pink-500",
        badge: "premium",
    },
];

// ธีมสีสำเร็จรูป
export const themePresets = [
    {
        name: "Light",
        primary: "#2563eb",
        accent: "#10b981",
        background: "#ffffff",
        textColor: "#111827",
    },
    {
        name: "Sand",
        primary: "#d97706",
        accent: "#10b981",
        background: "#faf3e0",
        textColor: "#1f2937",
    },
    {
        name: "Dark",
        primary: "#ffffff",
        accent: "#9ca3af",
        background: "#000000",
        textColor: "#ffffff",
    },
    {
        name: "Sunset",
        primary: "#f59e0b",
        accent: "#ef4444",
        background: "#1f2937",
        textColor: "#f3f4f6",
    },
    {
        name: "Sakura",
        primary: "#ec4899",
        accent: "#8b5cf6",
        background: "#111827",
        textColor: "#fff1f2",
    },
];

// มุมโค้ง (Border Radius)
export const borderRadiusOptions = [
    {
        value: "sharp",
        label: "เหลี่ยม",
        radius: "0px",
    },
    {
        value: "modern",
        label: "ปานกลาง",
        radius: "8px",
    },
    {
        value: "rounded",
        label: "มน",
        radius: "16px",
    },
];

// ฟอนต์
export const fontOptions = [
    {
        value: "prompt",
        label: "Prompt",
    },
    {
        value: "kanit",
        label: "Kanit",
    },
    {
        value: "sarabun",
        label: "Sarabun",
    },
];

// Social Media ด่วน
export const quickSocialPlatforms = [
    "Instagram",
    "X",
    "TikTok",
    "Facebook",
    "YouTube",
    "Line",
];
