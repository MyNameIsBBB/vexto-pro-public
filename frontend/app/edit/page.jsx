"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import ProExpiryBanner from "@/components/ProExpiryBanner";
import {
    MdEdit,
    MdAdd,
    MdSave,
    MdArrowBack,
    MdClose,
    MdSettings,
    MdPerson,
    MdContactPhone,
    MdPublic,
    MdVideogameAsset,
    MdSchedule,
    MdStore,
    MdBarChart,
    MdLink,
    MdCoffee,
    MdFormatQuote,
    MdWidgets,
    MdCheckCircle,
    MdWarning,
    MdFeedback,
} from "react-icons/md";
import { FiTrash2 } from "react-icons/fi";
import Navbar from "@/components/Navbar";
import BlockRenderer from "@/components/BlockRenderer";
import BlockEditor from "@/components/block-editors/BlockEditor";
import HeaderBlockEditor from "@/components/block-editors/HeaderBlockEditor";
import templateSections from "@/components/editor/templates";
import {
    avatarFrameOptions,
    themePresets,
    borderRadiusOptions,
    fontOptions,
    quickSocialPlatforms,
} from "@/components/editor/profileOptions";
import {
    buildBgStyle,
    buildInnerBgStyle,
} from "@/components/editor/background";
import SocialIcons from "@/components/SocialIcons";
import { useToast } from "@/contexts/ToastContext";
import { api, getToken, checkUsername } from "@/lib/api";

const defaultTheme = {
    primary: "#3b82f6",
    accent: "#10b981",
    background: "#1e293b",
    outerBackground: "#1e293b",
    textColor: "#f3f4f6",
    textOverrides: {
        name: "",
        header: "",
        body: "",
        muted: "",
        role: "",
        link: "",
        buttonLabel: "",
    },
    borderRadius: "modern",
    fontFamily: "prompt",
    backgroundImage: "",
    outerBackgroundImage: "",
    backgroundScope: "card",
};

// Map icon for each category
const categoryIcons = {
    โปรไฟล์: <MdPerson className="w-5 h-5" />,
    เนื้อหา: <MdPublic className="w-5 h-5" />,
    ธุรกิจ: <MdStore className="w-5 h-5" />,
    ลิงก์: <MdLink className="w-5 h-5" />,
    อื่นๆ: <MdWidgets className="w-5 h-5" />,
    Premium: <MdCoffee className="w-5 h-5" />,
};

// Group templates by their category property
function getGroupedTemplates() {
    const groups = {};

    templateSections.forEach((template) => {
        const category = template.category || "อื่นๆ";
        if (!groups[category]) {
            groups[category] = [];
        }
        groups[category].push(template);
    });

    // Convert to array format with icons
    return Object.entries(groups).map(([category, templates]) => ({
        category,
        icon: categoryIcons[category] || <MdWidgets className="w-5 h-5" />,
        templates,
    }));
}

export default function EditV2Page() {
    const { user, isAdmin } = useAuth();
    const proActive = Boolean(isAdmin || user?.isPro);
    const { notify } = useToast();
    const [profile, setProfile] = useState({
        displayName: "ชื่อของคุณ",
        avatarUrl: "/images/no-profile.png",
        bio: "แนะนำตัวสั้นๆ",
        avatarFrame: "ring-thin",
        socials: [],
        theme: defaultTheme,
        blocks: [],
    });

    // Username state (Pro only)
    const [username, setUsername] = useState("");
    const [originalUsername, setOriginalUsername] = useState("");
    const [usernameCheck, setUsernameCheck] = useState({
        checking: false,
        message: "",
        available: null,
    });

    const [editModal, setEditModal] = useState({
        open: false,
        type: null,
        blockIndex: null,
        blockData: null,
        headerData: null,
    });

    const [addModal, setAddModal] = useState(false);
    const [settingsTab, setSettingsTab] = useState("profile");
    const [showAdvanced, setShowAdvanced] = useState(false);

    // Custom confirm dialog
    const [confirmDialog, setConfirmDialog] = useState({
        open: false,
        title: "",
        message: "",
        onConfirm: null,
        loading: false,
        feedback: "",
        showFeedback: false, // เพิ่ม option แสดง feedback
        showLoading: false, // เพิ่ม option แสดง loading
    });

    // Drag and drop
    const [draggedIndex, setDraggedIndex] = useState(null);

    // Success modal
    const [successModal, setSuccessModal] = useState({
        open: false,
        title: "",
        message: "",
    });

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (
            editModal.open ||
            addModal ||
            confirmDialog.open ||
            successModal.open
        ) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }

        return () => {
            document.body.style.overflow = "unset";
        };
    }, [editModal.open, addModal, confirmDialog.open, successModal.open]);

    // Auto-dismiss success modal after 3 seconds
    useEffect(() => {
        if (successModal.open) {
            const timer = setTimeout(() => {
                setSuccessModal({
                    open: false,
                    title: "",
                    message: "",
                });
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [successModal.open]);

    useEffect(() => {
        (async () => {
            try {
                const data = await api.get("/profiles/me/info");
                // Bring any saved header (stored under props.header in DB) up to block.header for editing/preview
                const normalizedBlocks = (data.blocks || []).map((b) => {
                    const header = b?.header || b?.props?.header || null;
                    return header ? { ...b, header } : b;
                });
                setProfile((prev) => ({
                    ...prev,
                    displayName: data.displayName || prev.displayName,
                    avatarUrl: data.avatarUrl || prev.avatarUrl,
                    bio: data.bio || prev.bio,
                    avatarFrame: data.avatarFrame || prev.avatarFrame,
                    socials: data.socials || [],
                    theme: {
                        ...prev.theme,
                        ...data.theme,
                    },
                    blocks: normalizedBlocks,
                }));

                // Load username
                if (data.user?.username) {
                    setUsername(data.user.username);
                    setOriginalUsername(data.user.username);
                }
            } catch (e) {
                console.warn("Failed to load profile:", e?.message);
            }
        })();
    }, []);

    function saveProfile() {
        if (!proActive && profile.blocks.length > 3) {
            notify(
                "error",
                "Free plan จำกัด 3 บล็อก อัปเกรด Pro เพื่อใช้ไม่จำกัด"
            );
            return;
        }

        // Sanitize and validate data before saving
        const sanitizedProfile = {
            displayName: (profile.displayName || "").trim().substring(0, 100),
            avatarUrl: (profile.avatarUrl || "").trim().substring(0, 500),
            bio: (profile.bio || "").trim().substring(0, 500),
            avatarFrame: profile.avatarFrame || "ring-thin",
            socials: (profile.socials || [])
                .map((s) => ({
                    label: (s.label || "").trim().substring(0, 50),
                    url: (s.url || "").trim().substring(0, 500),
                }))
                .filter((s) => s.label && s.url),
            theme: profile.theme || defaultTheme,
            blocks: (profile.blocks || []).slice(0, proActive ? 50 : 3),
        };

        setConfirmDialog({
            open: true,
            title: "ยืนยันการบันทึกโปรไฟล์",
            message: "คุณต้องการบันทึกการเปลี่ยนแปลงทั้งหมดใช่หรือไม่?",
            loading: false,
            feedback: "",
            showFeedback: true, // แสดง feedback สำหรับการบันทึก
            showLoading: true, // แสดง loading 3 วินาที
            onConfirm: async () => {
                setConfirmDialog((prev) => ({ ...prev, loading: true }));

                // Loading for 3 seconds
                await new Promise((resolve) => setTimeout(resolve, 3000));

                try {
                    const payload = {
                        ...sanitizedProfile,
                        isPublic: true,
                    };
                    await api.put("/profiles/me", payload);

                    setConfirmDialog({
                        open: false,
                        title: "",
                        message: "",
                        onConfirm: null,
                        loading: false,
                        feedback: "",
                        showFeedback: false,
                        showLoading: false,
                    });

                    setSuccessModal({
                        open: true,
                        title: "เสร็จสิ้น",
                        message: "บันทึกโปรไฟล์เรียบร้อยแล้ว",
                    });
                } catch (e) {
                    setConfirmDialog({
                        open: false,
                        title: "",
                        message: "",
                        onConfirm: null,
                        loading: false,
                        feedback: "",
                        showFeedback: false,
                        showLoading: false,
                    });
                    notify("error", e?.message || "บันทึกไม่สำเร็จ");
                }
            },
        });
    }

    function openEditModal(index) {
        const block = profile.blocks[index];
        // header is stored directly as props in block.header
        // Wrap it in a structure for consistent editing
        const headerData = block.header
            ? { props: JSON.parse(JSON.stringify(block.header)) }
            : null;

        setEditModal({
            open: true,
            type: "block",
            blockIndex: index,
            blockData: JSON.parse(JSON.stringify(block)),
            headerData: headerData,
        });
    }

    function openSettingsModal() {
        setEditModal({
            open: true,
            type: "settings",
            blockIndex: null,
            blockData: null,
            headerData: null,
        });
    }

    function closeEditModal() {
        setEditModal({
            open: false,
            type: null,
            blockIndex: null,
            blockData: null,
            headerData: null,
        });
        setSettingsTab("profile");
        setShowAdvanced(false);
    }

    function saveBlockEdit() {
        if (editModal.type === "block" && editModal.blockIndex !== null) {
            const newBlocks = [...profile.blocks];
            // Save block with header (if exists)
            const updatedBlock = { ...editModal.blockData };
            if (editModal.headerData && editModal.headerData.props) {
                // Store header props directly (not wrapped)
                updatedBlock.header = editModal.headerData.props;
            } else {
                delete updatedBlock.header; // Remove header if not present
            }
            newBlocks[editModal.blockIndex] = updatedBlock;

            setProfile({ ...profile, blocks: newBlocks });
            closeEditModal();
            setSuccessModal({
                open: true,
                title: "เสร็จสิ้น",
                message: "แก้ไขบล็อกเรียบร้อยแล้ว",
            });
        } else if (editModal.type === "settings") {
            closeEditModal();
            setSuccessModal({
                open: true,
                title: "เสร็จสิ้น",
                message: "บันทึกการตั้งค่าเรียบร้อยแล้ว",
            });
        }
    }

    function deleteBlock(index) {
        setConfirmDialog({
            open: true,
            title: "ยืนยันการลบบล็อก",
            message: "คุณต้องการลบบล็อกนี้ใช่หรือไม่?",
            loading: false,
            feedback: "",
            showFeedback: false, // ไม่แสดง feedback สำหรับการลบ
            showLoading: false, // ไม่มี loading delay
            onConfirm: async () => {
                // ลบ block (header อยู่ใน block แล้ว ไม่ต้องจัดการแยก)
                const newBlocks = [...profile.blocks];
                newBlocks.splice(index, 1);
                setProfile({ ...profile, blocks: newBlocks });

                setConfirmDialog({
                    open: false,
                    title: "",
                    message: "",
                    onConfirm: null,
                    loading: false,
                    feedback: "",
                    showFeedback: false,
                    showLoading: false,
                });

                setSuccessModal({
                    open: true,
                    title: "เสร็จสิ้น",
                    message: "ลบบล็อกเรียบร้อยแล้ว",
                });
            },
        });
    }

    function addBlockFromTemplate(templateSection) {
        const newBlocks = templateSection.blocks.map((b) => ({
            ...b,
            id: crypto.randomUUID(),
        }));
        setProfile({
            ...profile,
            blocks: [...profile.blocks, ...newBlocks],
        });
        setAddModal(false);
        setSuccessModal({
            open: true,
            title: "เสร็จสิ้น",
            message: "เพิ่มบล็อกเรียบร้อยแล้ว",
        });
    }

    function addSocial() {
        setProfile({
            ...profile,
            socials: [...profile.socials, { label: "", url: "" }],
        });
    }

    function updateSocial(index, field, value) {
        const newSocials = [...profile.socials];
        newSocials[index][field] = value;
        setProfile({ ...profile, socials: newSocials });
    }

    function deleteSocial(index) {
        setProfile({
            ...profile,
            socials: profile.socials.filter((_, i) => i !== index),
        });
    }

    function quickAddSocial(platform) {
        const templates = {
            Instagram: { label: "Instagram", url: "https://instagram.com/" },
            X: { label: "X", url: "https://x.com/" },
            TikTok: { label: "TikTok", url: "https://tiktok.com/@" },
            Facebook: { label: "Facebook", url: "https://facebook.com/" },
            YouTube: { label: "YouTube", url: "https://youtube.com/@" },
            Line: { label: "Line", url: "https://line.me/ti/p/~" },
        };
        if (templates[platform]) {
            setProfile({
                ...profile,
                socials: [...profile.socials, templates[platform]],
            });
        }
    }

    function applyThemePreset(preset) {
        const outer = preset.outerBackground || preset.background;
        const textOverrides = {
            name: preset.textColor,
            header: preset.accent || preset.textColor,
            body: preset.textColor,
            role: preset.accent || preset.textColor,
            link: preset.accent || preset.textColor,
            muted: preset.textColor,
            buttonLabel: "",
        };
        setProfile({
            ...profile,
            theme: {
                ...profile.theme,
                primary: preset.primary,
                accent: preset.accent,
                background: preset.background,
                outerBackground: outer,
                textColor: preset.textColor,
                textOverrides: {
                    ...profile.theme?.textOverrides,
                    ...textOverrides,
                },
            },
        });
    }

    // Export/Import profile/theme code
    function encodePayload(obj) {
        try {
            const json = JSON.stringify(obj);
            return typeof window !== "undefined"
                ? btoa(unescape(encodeURIComponent(json)))
                : Buffer.from(json, "utf-8").toString("base64");
        } catch (e) {
            return null;
        }
    }

    function decodePayload(code) {
        try {
            const json =
                typeof window !== "undefined"
                    ? decodeURIComponent(escape(atob(code)))
                    : Buffer.from(code, "base64").toString("utf-8");
            return JSON.parse(json);
        } catch (e) {
            // Try raw JSON
            try {
                return JSON.parse(code);
            } catch {
                return null;
            }
        }
    }

    async function exportThemeCode() {
        const payload = { v: 1, kind: "theme", theme: profile.theme };
        const code = encodePayload(payload);
        if (!code) return notify("error", "สร้างโค้ดธีมไม่สำเร็จ");
        try {
            await navigator.clipboard.writeText(code);
            notify("success", "คัดลอกโค้ดธีมแล้ว");
        } catch {
            notify("warning", code);
        }
    }

    async function exportProfileCode() {
        const payload = {
            v: 1,
            kind: "profile",
            theme: profile.theme,
            blocks: profile.blocks,
            displayName: profile.displayName,
            bio: profile.bio,
            avatarUrl: profile.avatarUrl,
            socials: profile.socials,
        };
        const code = encodePayload(payload);
        if (!code) return notify("error", "สร้างโค้ดโปรไฟล์ไม่สำเร็จ");
        try {
            await navigator.clipboard.writeText(code);
            notify("success", "คัดลอกโค้ดโปรไฟล์แล้ว");
        } catch {
            notify("warning", code);
        }
    }

    function importCode() {
        const code = prompt("วางโค้ดธีมหรือโปรไฟล์ที่นี่");
        if (!code) return;
        const data = decodePayload(code.trim());
        if (!data || !data.kind) {
            notify("error", "โค้ดไม่ถูกต้อง");
            return;
        }
        if (data.kind === "theme" && data.theme) {
            setProfile((prev) => ({
                ...prev,
                theme: { ...prev.theme, ...data.theme },
            }));
            notify("success", "นำเข้าธีมแล้ว");
        } else if (data.kind === "profile") {
            const confirmReplace = confirm(
                "ต้องการนำเข้าโปรไฟล์? บล็อกเดิมจะถูกแทนที่"
            );
            if (!confirmReplace) return;
            setProfile((prev) => ({
                ...prev,
                theme: { ...prev.theme, ...data.theme },
                blocks: Array.isArray(data.blocks) ? data.blocks : prev.blocks,
                displayName: data.displayName || prev.displayName,
                bio: data.bio || prev.bio,
                avatarUrl: data.avatarUrl || prev.avatarUrl,
                socials: Array.isArray(data.socials)
                    ? data.socials
                    : prev.socials,
            }));
            notify("success", "นำเข้าโปรไฟล์แล้ว");
        } else {
            notify("error", "ชนิดโค้ดไม่รองรับ");
        }
    }

    // Drag and drop handlers
    function handleDragStart(index) {
        setDraggedIndex(index);
    }

    function handleDragOver(e, index) {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;

        const newBlocks = [...profile.blocks];
        const draggedBlock = newBlocks[draggedIndex];

        // header อยู่ใน block แล้ว ไม่ต้องจัดการแยก เพียงย้าย block เดียว
        newBlocks.splice(draggedIndex, 1);
        if (index > draggedIndex) index--;
        newBlocks.splice(index, 0, draggedBlock);

        setProfile({ ...profile, blocks: newBlocks });
        setDraggedIndex(index);
    }

    function handleDragEnd() {
        setDraggedIndex(null);
    }

    // Check username availability
    async function handleUsernameBlur() {
        if (!username || username === originalUsername) {
            setUsernameCheck({ checking: false, message: "", available: null });
            return;
        }

        setUsernameCheck({
            checking: true,
            message: "กำลังตรวจสอบ...",
            available: null,
        });

        const result = await checkUsername(username, originalUsername);
        setUsernameCheck({
            checking: false,
            message: result.message || "",
            available: result.available,
        });
    }

    // Update username (Pro only)
    async function updateUsername() {
        if (!proActive) {
            notify("error", "ต้องเป็นสมาชิก Pro ถึงจะเปลี่ยน username ได้");
            return;
        }

        if (username === originalUsername) {
            notify("error", "Username ไม่ได้เปลี่ยนแปลง");
            return;
        }

        if (!usernameCheck.available) {
            notify("error", "กรุณาตรวจสอบ username ก่อน");
            return;
        }

        try {
            await api.put("/profiles/me/username", { username });
            setOriginalUsername(username);
            notify("success", "เปลี่ยน username สำเร็จ");
            setUsernameCheck({ checking: false, message: "", available: null });
        } catch (e) {
            notify("error", e?.message || "เปลี่ยน username ไม่สำเร็จ");
        }
    }

    const bgStyle = buildBgStyle(profile.theme);
    const innerBgStyle = buildInnerBgStyle(profile.theme);
    const fontMap = {
        prompt: "var(--font-prompt)",
        kanit: "var(--font-kanit)",
        sarabun: "var(--font-sarabun)",
    };
    const fontFamily = fontMap[profile.theme?.fontFamily] || fontMap.prompt;

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-900 pt-16 pb-20">
                <div className="max-w-5xl mx-auto p-6">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-3 bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] bg-clip-text text-transparent">
                            แก้ไขโปรไฟล์
                        </h1>
                        <p className="text-gray-400 text-lg">
                            ปรับแต่งโปรไฟล์ของคุณให้โดดเด่นและน่าสนใจ
                        </p>
                    </div>

                    {/* Pro Expiry Banner */}
                    <ProExpiryBanner />

                    {/* Steps Guide */}
                    <div className="mb-8 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-xl p-6">
                        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <MdCheckCircle className="w-6 h-6 text-purple-400" />
                            วิธีสร้างโปรไฟล์
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
                                    1
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white mb-1">
                                        สร้างโปรไฟล์
                                    </h3>
                                    <p className="text-sm text-gray-300">
                                        กด "ตั้งค่า" เพื่อแก้ไขข้อมูล รูปโปรไฟล์
                                        และ Social Media
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                                    2
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white mb-1">
                                        เลือกบล็อกสำเร็จรูป
                                    </h3>
                                    <p className="text-sm text-gray-300">
                                        กด "เพิ่มบล็อก" เพื่อเลือก template
                                        พร้อมใช้มากมาย
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-bold">
                                    3
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white mb-1">
                                        ปรับแต่งเนื้อหา
                                    </h3>
                                    <p className="text-sm text-gray-300">
                                        Hover บน block แล้วกดแก้ไข จากนั้นกด
                                        "บันทึก"
                                    </p>
                                </div>
                            </div>
                        </div>
                        {user?.username && (
                            <div className="mt-4 pt-4 border-t border-white/10">
                                <p className="text-sm text-gray-300">
                                    <span className="text-purple-400 font-medium">
                                        User ID:
                                    </span>{" "}
                                    <code className="bg-gray-800 px-2 py-1 rounded text-xs">
                                        {user.id || user._id || "N/A"}
                                    </code>
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between mb-6">
                        <Link
                            href="/"
                            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                        >
                            <MdArrowBack className="w-5 h-5" />
                            <span className="hidden sm:inline">กลับ</span>
                        </Link>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={openSettingsModal}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl"
                            >
                                <MdSettings className="w-5 h-5" />
                                <span className="hidden sm:inline">
                                    ตั้งค่า
                                </span>
                            </button>
                            <button
                                onClick={() => setAddModal(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl"
                            >
                                <MdAdd className="w-5 h-5" />
                                <span className="hidden sm:inline">
                                    เพิ่มบล็อก
                                </span>
                            </button>
                            <button
                                onClick={saveProfile}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl"
                            >
                                <MdSave className="w-5 h-5" />
                                <span className="hidden sm:inline">บันทึก</span>
                            </button>
                        </div>
                    </div>

                    <div className="bg-gray-800 rounded-xl p-6">
                        <div
                            className="rounded-xl overflow-hidden"
                            style={bgStyle}
                        >
                            <div
                                className="rounded-xl p-6 md:p-8"
                                style={{ ...innerBgStyle, fontFamily }}
                            >
                                <div className="flex flex-col items-center text-center gap-5 mb-10">
                                    {profile.avatarUrl && (
                                        <img
                                            src={profile.avatarUrl}
                                            alt="avatar"
                                            className="w-28 h-28 rounded-full object-cover ring-4 ring-white/40 shadow-xl"
                                        />
                                    )}
                                    <h2
                                        className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2"
                                        style={{
                                            color:
                                                profile.theme.textOverrides
                                                    ?.name ||
                                                profile.theme.textColor,
                                        }}
                                    >
                                        {profile.displayName}
                                    </h2>
                                    {profile.bio && (
                                        <p
                                            className="text-base md:text-lg leading-relaxed max-w-2xl"
                                            style={{
                                                color:
                                                    profile.theme.textOverrides
                                                        ?.body ||
                                                    profile.theme.textColor,
                                                opacity: 0.9,
                                            }}
                                        >
                                            {profile.bio}
                                        </p>
                                    )}
                                </div>

                                {profile.socials &&
                                    profile.socials.length > 0 && (
                                        <div className="mb-6">
                                            <SocialIcons
                                                items={profile.socials}
                                                theme={profile.theme}
                                            />
                                        </div>
                                    )}

                                {/* Unified renderer: pass all blocks at once so internal separators appear */}
                                <div className="relative">
                                    <BlockRenderer
                                        blocks={profile.blocks}
                                        theme={profile.theme}
                                        separated={true}
                                    />
                                    {/* Floating edit controls per block (overlay) */}
                                    <div className="mt-6 space-y-4">
                                        {profile.blocks.map((block, index) => (
                                            <div
                                                key={block.id || index}
                                                className="relative group"
                                                draggable
                                                onDragStart={() =>
                                                    handleDragStart(index)
                                                }
                                                onDragOver={(e) =>
                                                    handleDragOver(e, index)
                                                }
                                                onDragEnd={handleDragEnd}
                                            >
                                                <div className="absolute inset-0 rounded-xl pointer-events-none group-hover:ring-2 group-hover:ring-purple-500/40 transition-all" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2 pointer-events-none">
                                                    <button
                                                        onClick={() =>
                                                            openEditModal(index)
                                                        }
                                                        className="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors pointer-events-auto"
                                                        title="แก้ไข"
                                                    >
                                                        <MdEdit className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            deleteBlock(index)
                                                        }
                                                        className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors pointer-events-auto"
                                                        title="ลบ"
                                                    >
                                                        <FiTrash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {profile.blocks.length === 0 && (
                                    <div className="text-center py-12 text-gray-400">
                                        <p>
                                            ยังไม่มีบล็อก กด "เพิ่มบล็อก"
                                            เพื่อเริ่มต้น
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit/Settings Modal */}
            {editModal.open && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
                    onClick={closeEditModal}
                >
                    <div
                        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl max-w-4xl w-full max-h-[85vh] flex flex-col my-8 shadow-2xl border border-gray-700 animate-fadeIn"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex-shrink-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-b border-gray-700 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                {editModal.type === "block" && (
                                    <>
                                        <MdEdit className="w-6 h-6 text-purple-400" />
                                        แก้ไขบล็อก
                                    </>
                                )}
                                {editModal.type === "settings" && (
                                    <>
                                        <MdSettings className="w-6 h-6 text-blue-400" />
                                        ตั้งค่าโปรไฟล์
                                    </>
                                )}
                            </h3>
                            <button
                                onClick={closeEditModal}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <MdClose className="w-6 h-6 text-white" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6">
                            {editModal.type === "block" &&
                                editModal.blockData && (
                                    <div className="space-y-6">
                                        {editModal.headerData && (
                                            <div className="border border-gray-700 rounded-lg p-4 bg-gray-700/30">
                                                <label className="block text-sm font-medium text-gray-300 mb-3">
                                                    หัวข้อส่วน (Header)
                                                </label>
                                                <HeaderBlockEditor
                                                    value={
                                                        editModal.headerData
                                                            .props
                                                    }
                                                    onChange={(newProps) =>
                                                        setEditModal({
                                                            ...editModal,
                                                            headerData: {
                                                                ...editModal.headerData,
                                                                props: newProps,
                                                            },
                                                        })
                                                    }
                                                />
                                            </div>
                                        )}

                                        <div className="border border-gray-700 rounded-lg p-4">
                                            <label className="block text-sm font-medium text-gray-300 mb-3">
                                                เนื้อหาบล็อก
                                            </label>
                                            <BlockEditor
                                                type={editModal.blockData.type}
                                                value={
                                                    editModal.blockData.props
                                                }
                                                onChange={(newProps) =>
                                                    setEditModal({
                                                        ...editModal,
                                                        blockData: {
                                                            ...editModal.blockData,
                                                            props: newProps,
                                                        },
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>
                                )}

                            {editModal.type === "settings" && (
                                <div>
                                    <div className="flex gap-2 mb-6 border-b border-gray-700">
                                        <button
                                            onClick={() =>
                                                setSettingsTab("profile")
                                            }
                                            className={`px-4 py-2 font-medium transition-colors ${
                                                settingsTab === "profile"
                                                    ? "text-white border-b-2 border-blue-500"
                                                    : "text-gray-400 hover:text-gray-300"
                                            }`}
                                        >
                                            โปรไฟล์
                                        </button>
                                        <button
                                            onClick={() =>
                                                setSettingsTab("theme")
                                            }
                                            className={`px-4 py-2 font-medium transition-colors ${
                                                settingsTab === "theme"
                                                    ? "text-white border-b-2 border-blue-500"
                                                    : "text-gray-400 hover:text-gray-300"
                                            }`}
                                        >
                                            ธีม
                                        </button>
                                    </div>

                                    {settingsTab === "profile" && (
                                        <div className="space-y-6">
                                            {proActive && (
                                                <div className="p-4 bg-purple-600/10 border border-purple-500/30 rounded-lg">
                                                    <label className="block text-sm font-medium text-purple-300 mb-2">
                                                        🔒 Username (Pro)
                                                    </label>
                                                    <div className="flex gap-2">
                                                        <div className="flex-1">
                                                            <input
                                                                type="text"
                                                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                                                value={username}
                                                                onChange={(e) =>
                                                                    setUsername(
                                                                        e.target.value.toLowerCase()
                                                                    )
                                                                }
                                                                onBlur={
                                                                    handleUsernameBlur
                                                                }
                                                                placeholder="username"
                                                            />
                                                            {usernameCheck.message && (
                                                                <p
                                                                    className={`text-xs mt-1 ${
                                                                        usernameCheck.checking
                                                                            ? "text-gray-400"
                                                                            : usernameCheck.available
                                                                            ? "text-green-400"
                                                                            : "text-red-400"
                                                                    }`}
                                                                >
                                                                    {usernameCheck.checking
                                                                        ? "⏳"
                                                                        : usernameCheck.available
                                                                        ? "✅"
                                                                        : "❌"}{" "}
                                                                    {
                                                                        usernameCheck.message
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>
                                                        {username !==
                                                            originalUsername &&
                                                            usernameCheck.available && (
                                                                <button
                                                                    onClick={
                                                                        updateUsername
                                                                    }
                                                                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                                                                >
                                                                    บันทึก
                                                                </button>
                                                            )}
                                                    </div>
                                                    <p className="text-xs text-gray-400 mt-2">
                                                        URL: vexto.app/profile/
                                                        {username ||
                                                            originalUsername}
                                                    </p>
                                                </div>
                                            )}

                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                                    ชื่อที่แสดง
                                                </label>
                                                <input
                                                    type="text"
                                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                                    value={profile.displayName}
                                                    onChange={(e) =>
                                                        setProfile({
                                                            ...profile,
                                                            displayName:
                                                                e.target.value,
                                                        })
                                                    }
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                                    URL รูปโปรไฟล์
                                                </label>
                                                <input
                                                    type="url"
                                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                                    value={profile.avatarUrl}
                                                    onChange={(e) =>
                                                        setProfile({
                                                            ...profile,
                                                            avatarUrl:
                                                                e.target.value,
                                                        })
                                                    }
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                                    กรอบรูปโปรไฟล์
                                                </label>
                                                <div className="grid grid-cols-5 gap-2">
                                                    {avatarFrameOptions.map(
                                                        (option) => {
                                                            const isFree =
                                                                option.badge ===
                                                                "free";
                                                            const isPremium =
                                                                option.badge ===
                                                                "premium";
                                                            const isLocked =
                                                                isPremium &&
                                                                !proActive;

                                                            return (
                                                                <button
                                                                    key={
                                                                        option.value
                                                                    }
                                                                    onClick={() => {
                                                                        if (
                                                                            isLocked
                                                                        ) {
                                                                            notify(
                                                                                "🔒 กรอบนี้สำหรับ Pro เท่านั้น"
                                                                            );
                                                                        } else {
                                                                            setProfile(
                                                                                {
                                                                                    ...profile,
                                                                                    avatarFrame:
                                                                                        option.value,
                                                                                }
                                                                            );
                                                                        }
                                                                    }}
                                                                    className={`p-3 rounded-lg border-2 transition-all relative ${
                                                                        isLocked
                                                                            ? "opacity-60 cursor-not-allowed border-white/5 bg-white/5"
                                                                            : profile.avatarFrame ===
                                                                              option.value
                                                                            ? "border-purple-500 bg-purple-500/20"
                                                                            : "border-white/10 bg-white/5 hover:border-white/30"
                                                                    }`}
                                                                    disabled={
                                                                        isLocked
                                                                    }
                                                                >
                                                                    {/* Badge */}
                                                                    <div className="absolute top-1 right-1 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                                                                        {isFree && (
                                                                            <span className="bg-gray-600/80 text-gray-200">
                                                                                FREE
                                                                            </span>
                                                                        )}
                                                                        {isPremium &&
                                                                            (proActive ? (
                                                                                <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                                                                                    PRO
                                                                                </span>
                                                                            ) : (
                                                                                <span className="bg-purple-600/80 text-white">
                                                                                    🔒
                                                                                    PRO
                                                                                </span>
                                                                            ))}
                                                                    </div>

                                                                    <div
                                                                        className={`w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 mx-auto mb-2 ${
                                                                            option.preview
                                                                        } ${
                                                                            isLocked
                                                                                ? "grayscale"
                                                                                : ""
                                                                        }`}
                                                                    />
                                                                    <div
                                                                        className={`text-xs ${
                                                                            isLocked
                                                                                ? "text-gray-500"
                                                                                : "text-white"
                                                                        }`}
                                                                    >
                                                                        {
                                                                            option.label
                                                                        }
                                                                    </div>
                                                                </button>
                                                            );
                                                        }
                                                    )}
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                                    คำอธิบาย (Bio)
                                                </label>
                                                <textarea
                                                    rows={3}
                                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                                    value={profile.bio}
                                                    onChange={(e) =>
                                                        setProfile({
                                                            ...profile,
                                                            bio: e.target.value,
                                                        })
                                                    }
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                                    🌐 Social Media
                                                </label>
                                                <div className="space-y-2 mb-3">
                                                    {profile.socials.map(
                                                        (social, index) => (
                                                            <div
                                                                key={index}
                                                                className="flex gap-2"
                                                            >
                                                                <input
                                                                    type="text"
                                                                    placeholder="ชื่อ (Instagram)"
                                                                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                                                    value={
                                                                        social.label
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        updateSocial(
                                                                            index,
                                                                            "label",
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                />
                                                                <input
                                                                    type="url"
                                                                    placeholder="URL"
                                                                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                                                    value={
                                                                        social.url
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        updateSocial(
                                                                            index,
                                                                            "url",
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                />
                                                                <button
                                                                    onClick={() =>
                                                                        deleteSocial(
                                                                            index
                                                                        )
                                                                    }
                                                                    className="p-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg transition-colors"
                                                                >
                                                                    <FiTrash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                                <button
                                                    onClick={addSocial}
                                                    className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors mr-2"
                                                >
                                                    + เพิ่มใหม่
                                                </button>
                                                <div className="mt-3">
                                                    <div className="text-xs text-gray-400 mb-2">
                                                        เพิ่มด่วน:
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {quickSocialPlatforms.map(
                                                            (platform) => (
                                                                <button
                                                                    key={
                                                                        platform
                                                                    }
                                                                    onClick={() =>
                                                                        quickAddSocial(
                                                                            platform
                                                                        )
                                                                    }
                                                                    className="px-3 py-1 bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 text-xs rounded-lg transition-colors"
                                                                >
                                                                    {platform}
                                                                </button>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {settingsTab === "theme" && (
                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-3">
                                                    ธีมสำเร็จรูป
                                                </label>
                                                <div className="grid grid-cols-5 gap-2">
                                                    {themePresets.map(
                                                        (preset) => (
                                                            <button
                                                                key={
                                                                    preset.name
                                                                }
                                                                onClick={() =>
                                                                    applyThemePreset(
                                                                        preset
                                                                    )
                                                                }
                                                                className="p-3 rounded-lg border-2 border-white/10 hover:border-white/30 transition-all"
                                                                style={{
                                                                    background:
                                                                        preset.background,
                                                                    color: preset.textColor,
                                                                }}
                                                            >
                                                                <div className="text-xs font-medium mb-1">
                                                                    {
                                                                        preset.name
                                                                    }
                                                                </div>
                                                                <div className="flex gap-1">
                                                                    <div
                                                                        className="w-3 h-3 rounded-full"
                                                                        style={{
                                                                            background:
                                                                                preset.primary,
                                                                        }}
                                                                    />
                                                                    <div
                                                                        className="w-3 h-3 rounded-full"
                                                                        style={{
                                                                            background:
                                                                                preset.accent,
                                                                        }}
                                                                    />
                                                                </div>
                                                            </button>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                            <div className="mt-4">
                                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                                    แชร์/นำเข้า ธีมและโปรไฟล์
                                                </label>
                                                <div className="flex flex-wrap gap-2">
                                                    <button
                                                        onClick={
                                                            exportThemeCode
                                                        }
                                                        className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors"
                                                    >
                                                        คัดลอกโค้ดธีม
                                                    </button>
                                                    <button
                                                        onClick={
                                                            exportProfileCode
                                                        }
                                                        className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors"
                                                    >
                                                        คัดลอกโค้ดโปรไฟล์
                                                    </button>
                                                    <button
                                                        onClick={importCode}
                                                        className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                                                    >
                                                        นำเข้าโค้ด
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                                        สีหลัก (Primary)
                                                    </label>
                                                    <input
                                                        type="color"
                                                        className="w-full h-10 rounded cursor-pointer"
                                                        value={
                                                            profile.theme
                                                                .primary
                                                        }
                                                        onChange={(e) =>
                                                            setProfile({
                                                                ...profile,
                                                                theme: {
                                                                    ...profile.theme,
                                                                    primary:
                                                                        e.target
                                                                            .value,
                                                                },
                                                            })
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                                        สีเน้น (Accent)
                                                    </label>
                                                    <input
                                                        type="color"
                                                        className="w-full h-10 rounded cursor-pointer"
                                                        value={
                                                            profile.theme.accent
                                                        }
                                                        onChange={(e) =>
                                                            setProfile({
                                                                ...profile,
                                                                theme: {
                                                                    ...profile.theme,
                                                                    accent: e
                                                                        .target
                                                                        .value,
                                                                },
                                                            })
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                                        สีพื้นหลัง (Background)
                                                    </label>
                                                    <input
                                                        type="color"
                                                        className="w-full h-10 rounded cursor-pointer"
                                                        value={
                                                            profile.theme
                                                                .background
                                                        }
                                                        onChange={(e) =>
                                                            setProfile({
                                                                ...profile,
                                                                theme: {
                                                                    ...profile.theme,
                                                                    background:
                                                                        e.target
                                                                            .value,
                                                                },
                                                            })
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                                        สีพื้นหลังด้านนอก
                                                        (Outer)
                                                    </label>
                                                    <input
                                                        type="color"
                                                        className="w-full h-10 rounded cursor-pointer"
                                                        value={
                                                            profile.theme
                                                                .outerBackground ||
                                                            profile.theme
                                                                .background
                                                        }
                                                        onChange={(e) =>
                                                            setProfile({
                                                                ...profile,
                                                                theme: {
                                                                    ...profile.theme,
                                                                    outerBackground:
                                                                        e.target
                                                                            .value,
                                                                },
                                                            })
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                                        สีข้อความ (Text)
                                                    </label>
                                                    <input
                                                        type="color"
                                                        className="w-full h-10 rounded cursor-pointer"
                                                        value={
                                                            profile.theme
                                                                .textColor
                                                        }
                                                        onChange={(e) =>
                                                            setProfile({
                                                                ...profile,
                                                                theme: {
                                                                    ...profile.theme,
                                                                    textColor:
                                                                        e.target
                                                                            .value,
                                                                },
                                                            })
                                                        }
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                                        มุมโค้ง (Border Radius)
                                                    </label>
                                                    <div className="grid grid-cols-3 gap-2">
                                                        {borderRadiusOptions.map(
                                                            (option) => (
                                                                <button
                                                                    key={
                                                                        option.value
                                                                    }
                                                                    onClick={() =>
                                                                        setProfile(
                                                                            {
                                                                                ...profile,
                                                                                theme: {
                                                                                    ...profile.theme,
                                                                                    borderRadius:
                                                                                        option.value,
                                                                                },
                                                                            }
                                                                        )
                                                                    }
                                                                    className={`p-3 rounded-lg border-2 transition-all ${
                                                                        profile
                                                                            .theme
                                                                            .borderRadius ===
                                                                        option.value
                                                                            ? "border-blue-500 bg-blue-500/20"
                                                                            : "border-white/10 bg-white/5 hover:border-white/30"
                                                                    }`}
                                                                >
                                                                    <div className="text-xs mb-1">
                                                                        {
                                                                            option.label
                                                                        }
                                                                    </div>
                                                                    <div
                                                                        className="w-full h-6 bg-white/20"
                                                                        style={{
                                                                            borderRadius:
                                                                                option.radius,
                                                                        }}
                                                                    />
                                                                </button>
                                                            )
                                                        )}
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                                        ฟอนต์
                                                    </label>
                                                    <div className="grid grid-cols-3 gap-2">
                                                        {fontOptions.map(
                                                            (option) => (
                                                                <button
                                                                    key={
                                                                        option.value
                                                                    }
                                                                    onClick={() =>
                                                                        setProfile(
                                                                            {
                                                                                ...profile,
                                                                                theme: {
                                                                                    ...profile.theme,
                                                                                    fontFamily:
                                                                                        option.value,
                                                                                },
                                                                            }
                                                                        )
                                                                    }
                                                                    className={`p-3 rounded-lg border-2 transition-all ${
                                                                        profile
                                                                            .theme
                                                                            .fontFamily ===
                                                                        option.value
                                                                            ? "border-blue-500 bg-blue-500/20"
                                                                            : "border-white/10 bg-white/5 hover:border-white/30"
                                                                    }`}
                                                                >
                                                                    <div className="text-xs">
                                                                        {
                                                                            option.label
                                                                        }
                                                                    </div>
                                                                </button>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <button
                                                    onClick={() =>
                                                        setShowAdvanced(
                                                            !showAdvanced
                                                        )
                                                    }
                                                    className="text-sm text-blue-400 hover:text-blue-300 mb-3"
                                                >
                                                    {showAdvanced ? "▼" : "▶"}{" "}
                                                    ตั้งค่าขั้นสูง
                                                </button>

                                                {showAdvanced && (
                                                    <div className="space-y-4 p-4 bg-gray-700/30 rounded-lg">
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <label className="block text-xs text-gray-400 mb-2">
                                                                    สีชื่อ
                                                                    (Name)
                                                                </label>
                                                                <input
                                                                    type="color"
                                                                    className="w-full h-8 rounded cursor-pointer"
                                                                    value={
                                                                        profile
                                                                            .theme
                                                                            .textOverrides
                                                                            ?.name ||
                                                                        profile
                                                                            .theme
                                                                            .textColor
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        setProfile(
                                                                            {
                                                                                ...profile,
                                                                                theme: {
                                                                                    ...profile.theme,
                                                                                    textOverrides:
                                                                                        {
                                                                                            ...profile
                                                                                                .theme
                                                                                                .textOverrides,
                                                                                            name: e
                                                                                                .target
                                                                                                .value,
                                                                                        },
                                                                                },
                                                                            }
                                                                        )
                                                                    }
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-xs text-gray-400 mb-2">
                                                                    สีหัวข้อ
                                                                    (Header)
                                                                </label>
                                                                <input
                                                                    type="color"
                                                                    className="w-full h-8 rounded cursor-pointer"
                                                                    value={
                                                                        profile
                                                                            .theme
                                                                            .textOverrides
                                                                            ?.header ||
                                                                        profile
                                                                            .theme
                                                                            .textColor
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        setProfile(
                                                                            {
                                                                                ...profile,
                                                                                theme: {
                                                                                    ...profile.theme,
                                                                                    textOverrides:
                                                                                        {
                                                                                            ...profile
                                                                                                .theme
                                                                                                .textOverrides,
                                                                                            header: e
                                                                                                .target
                                                                                                .value,
                                                                                        },
                                                                                },
                                                                            }
                                                                        )
                                                                    }
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-xs text-gray-400 mb-2">
                                                                    สีเนื้อหา
                                                                    (Body)
                                                                </label>
                                                                <input
                                                                    type="color"
                                                                    className="w-full h-8 rounded cursor-pointer"
                                                                    value={
                                                                        profile
                                                                            .theme
                                                                            .textOverrides
                                                                            ?.body ||
                                                                        profile
                                                                            .theme
                                                                            .textColor
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        setProfile(
                                                                            {
                                                                                ...profile,
                                                                                theme: {
                                                                                    ...profile.theme,
                                                                                    textOverrides:
                                                                                        {
                                                                                            ...profile
                                                                                                .theme
                                                                                                .textOverrides,
                                                                                            body: e
                                                                                                .target
                                                                                                .value,
                                                                                        },
                                                                                },
                                                                            }
                                                                        )
                                                                    }
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-xs text-gray-400 mb-2">
                                                                    สีลิงก์
                                                                    (Link)
                                                                </label>
                                                                <input
                                                                    type="color"
                                                                    className="w-full h-8 rounded cursor-pointer"
                                                                    value={
                                                                        profile
                                                                            .theme
                                                                            .textOverrides
                                                                            ?.link ||
                                                                        profile
                                                                            .theme
                                                                            .textColor
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        setProfile(
                                                                            {
                                                                                ...profile,
                                                                                theme: {
                                                                                    ...profile.theme,
                                                                                    textOverrides:
                                                                                        {
                                                                                            ...profile
                                                                                                .theme
                                                                                                .textOverrides,
                                                                                            link: e
                                                                                                .target
                                                                                                .value,
                                                                                        },
                                                                                },
                                                                            }
                                                                        )
                                                                    }
                                                                />
                                                            </div>
                                                        </div>

                                                        {proActive && (
                                                            <>
                                                                <div>
                                                                    <label className="block text-xs text-gray-400 mb-2">
                                                                        🔒
                                                                        พื้นหลังด้านนอก
                                                                        (URL
                                                                        รูป/GIF)
                                                                        - Pro
                                                                    </label>
                                                                    <input
                                                                        type="url"
                                                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                                                        value={
                                                                            profile
                                                                                .theme
                                                                                .outerBackgroundImage ||
                                                                            ""
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            setProfile(
                                                                                {
                                                                                    ...profile,
                                                                                    theme: {
                                                                                        ...profile.theme,
                                                                                        outerBackgroundImage:
                                                                                            e
                                                                                                .target
                                                                                                .value,
                                                                                    },
                                                                                }
                                                                            )
                                                                        }
                                                                        placeholder="https://..."
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-xs text-gray-400 mb-2">
                                                                        🔒
                                                                        พื้นหลังด้านใน
                                                                        (URL
                                                                        รูป/GIF)
                                                                        - Pro
                                                                    </label>
                                                                    <input
                                                                        type="url"
                                                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                                                        value={
                                                                            profile
                                                                                .theme
                                                                                .backgroundImage ||
                                                                            ""
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            setProfile(
                                                                                {
                                                                                    ...profile,
                                                                                    theme: {
                                                                                        ...profile.theme,
                                                                                        backgroundImage:
                                                                                            e
                                                                                                .target
                                                                                                .value,
                                                                                    },
                                                                                }
                                                                            )
                                                                        }
                                                                        placeholder="https://..."
                                                                    />
                                                                </div>
                                                            </>
                                                        )}

                                                        {!proActive && (
                                                            <div className="p-4 bg-purple-600/10 border border-purple-500/30 rounded-lg">
                                                                <p className="text-sm text-purple-300">
                                                                    🔒
                                                                    พื้นหลังรูป/GIF
                                                                    ใช้ได้เฉพาะ
                                                                    Pro เท่านั้น
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="flex-shrink-0 bg-gray-800/50 border-t border-gray-700 px-6 py-4 flex justify-end gap-3 rounded-b-2xl">
                            <button
                                onClick={closeEditModal}
                                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl"
                            >
                                ยกเลิก
                            </button>
                            <button
                                onClick={saveBlockEdit}
                                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl"
                            >
                                บันทึก
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Block Modal */}
            {addModal && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
                    onClick={() => setAddModal(false)}
                >
                    <div
                        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl max-w-5xl w-full max-h-[85vh] flex flex-col my-8 shadow-2xl border border-gray-700 animate-fadeIn"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex-shrink-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-b border-gray-700 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <MdAdd className="w-6 h-6 text-purple-400" />
                                เลือกบล็อกที่ต้องการเพิ่ม
                            </h3>
                            <button
                                onClick={() => setAddModal(false)}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <MdClose className="w-6 h-6 text-white" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="space-y-8">
                                {getGroupedTemplates().map((group) => (
                                    <div key={group.category}>
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/30 flex items-center justify-center">
                                                {group.icon}
                                            </div>
                                            <h4 className="font-bold text-lg text-white">
                                                {group.category}
                                            </h4>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                            {group.templates.map((template) => {
                                                const isPremium =
                                                    template.isPremium;
                                                const isLocked =
                                                    isPremium && !proActive;

                                                return (
                                                    <button
                                                        key={template.id}
                                                        onClick={() => {
                                                            if (isLocked) {
                                                                notify(
                                                                    "🔒 เทมเพลตนี้สำหรับ Pro เท่านั้น",
                                                                    "warning"
                                                                );
                                                            } else {
                                                                addBlockFromTemplate(
                                                                    template
                                                                );
                                                            }
                                                        }}
                                                        className={`p-4 rounded-xl transition-all text-left shadow-lg hover:shadow-xl transform relative ${
                                                            isLocked
                                                                ? "bg-gray-800/50 border-2 border-gray-700/50 cursor-not-allowed opacity-60"
                                                                : "bg-gradient-to-br from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 border border-gray-600 hover:scale-105"
                                                        }`}
                                                        disabled={isLocked}
                                                    >
                                                        {isLocked && (
                                                            <div className="absolute top-2 right-2 text-yellow-500">
                                                                🔒
                                                            </div>
                                                        )}
                                                        <div
                                                            className={`text-3xl mb-2 ${
                                                                isLocked
                                                                    ? "grayscale"
                                                                    : ""
                                                            }`}
                                                        >
                                                            {template.icon}
                                                        </div>
                                                        <div
                                                            className={`text-sm font-medium ${
                                                                isLocked
                                                                    ? "text-gray-500"
                                                                    : "text-white"
                                                            }`}
                                                        >
                                                            {template.name}
                                                        </div>
                                                        {isLocked && (
                                                            <div className="text-xs text-gray-600 mt-1">
                                                                Pro only
                                                            </div>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Confirm Dialog */}
            {confirmDialog.open && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
                    onClick={() => {
                        if (!confirmDialog.loading) {
                            setConfirmDialog({
                                open: false,
                                title: "",
                                message: "",
                                onConfirm: null,
                                loading: false,
                                feedback: "",
                            });
                        }
                    }}
                >
                    <div
                        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl max-w-md w-full shadow-2xl border border-yellow-500/30 transform transition-all animate-fadeIn"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6">
                            {confirmDialog.loading &&
                            confirmDialog.showLoading ? (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                                    <p className="text-white font-medium text-lg mb-2">
                                        กำลังดำเนินการ...
                                    </p>
                                    <p className="text-gray-400 text-sm">
                                        กรุณารอสักครู่
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center animate-pulse">
                                            <MdWarning className="w-6 h-6 text-yellow-400" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white">
                                            {confirmDialog.title}
                                        </h3>
                                    </div>
                                    <p className="text-gray-300 mb-6 leading-relaxed">
                                        {confirmDialog.message}
                                    </p>

                                    <div className="flex gap-3 mb-4">
                                        <button
                                            onClick={() =>
                                                setConfirmDialog({
                                                    open: false,
                                                    title: "",
                                                    message: "",
                                                    onConfirm: null,
                                                    loading: false,
                                                    feedback: "",
                                                    showFeedback: false,
                                                    showLoading: false,
                                                })
                                            }
                                            className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl"
                                        >
                                            ยกเลิก
                                        </button>
                                        <button
                                            onClick={confirmDialog.onConfirm}
                                            className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl"
                                        >
                                            ยืนยัน
                                        </button>
                                    </div>

                                    {confirmDialog.showFeedback && (
                                        <Link
                                            href="/feedback"
                                            className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-orange-600/20 hover:bg-orange-600/30 border border-orange-500/50 text-orange-300 rounded-xl font-medium transition-all text-sm"
                                            onClick={() =>
                                                setConfirmDialog({
                                                    open: false,
                                                    title: "",
                                                    message: "",
                                                    onConfirm: null,
                                                    loading: false,
                                                    feedback: "",
                                                    showFeedback: false,
                                                    showLoading: false,
                                                })
                                            }
                                        >
                                            <MdFeedback className="w-4 h-4" />
                                            ให้ Feedback
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {successModal.open && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
                    onClick={() => {
                        setSuccessModal({
                            open: false,
                            title: "",
                            message: "",
                        });
                    }}
                >
                    <div
                        className="bg-gradient-to-br from-green-900/90 to-emerald-900/90 rounded-2xl max-w-md w-full shadow-2xl border border-green-500/30 transform transition-all animate-fadeIn"
                        onClick={() => {
                            setSuccessModal({
                                open: false,
                                title: "",
                                message: "",
                            });
                        }}
                    >
                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                                    <MdCheckCircle className="w-8 h-8 text-green-400" />
                                </div>
                                <h3 className="text-xl font-bold text-white">
                                    {successModal.title}
                                </h3>
                            </div>
                            <p className="text-gray-200 leading-relaxed">
                                {successModal.message}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
