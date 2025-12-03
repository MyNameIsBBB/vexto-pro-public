"use client";
import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import ProExpiryBanner from "@/components/ProExpiryBanner";
import {
    MdAdd,
    MdSave,
    MdArrowBack,
    MdSettings,
    MdPerson,
    MdPublic,
    MdStore,
    MdLink,
    MdCoffee,
    MdWidgets,
    MdCheckCircle,
} from "react-icons/md";
import { FiTrash2 } from "react-icons/fi";
import Navbar from "@/components/Navbar";
import BlockRenderer from "@/components/BlockRenderer";
import ProfilePreview from "@/components/edit/ProfilePreview";
import BlockListItem from "@/components/edit/BlockListItem";
import AddBlockModal from "@/components/edit/AddBlockModal";
import EditBlockModal from "@/components/edit/EditBlockModal";
import SettingsModal from "@/components/edit/SettingsModal";
import ConfirmDialog from "@/components/modals/ConfirmDialog";
import SuccessModal from "@/components/modals/SuccessModal";
import templateSections from "@/components/editor/templates";
import {
    buildBgStyle,
    buildInnerBgStyle,
} from "@/components/editor/background";
import { useToast } from "@/contexts/ToastContext";
import { api, checkUsername } from "@/lib/api";

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
        blockIndex: null,
        blockData: null,
        headerData: null,
    });

    const [addModal, setAddModal] = useState(false);
    const [settingsModal, setSettingsModal] = useState(false);

    // Custom confirm dialog
    const [confirmDialog, setConfirmDialog] = useState({
        open: false,
        title: "",
        message: "",
        onConfirm: null,
        loading: false,
        feedback: "",
        showFeedback: false,
        showLoading: false,
    });

    // Drag and drop
    const [draggedIndex, setDraggedIndex] = useState(null);

    // Success modal
    const [successModal, setSuccessModal] = useState({
        open: false,
        title: "",
        message: "",
    });

    // Computed values
    const groupedTemplates = useMemo(() => getGroupedTemplates(), []);
    const bgStyle = useMemo(() => buildBgStyle(profile.theme), [profile.theme]);
    const innerBgStyle = useMemo(
        () => buildInnerBgStyle(profile.theme),
        [profile.theme]
    );
    const fontFamily = profile.theme.fontFamily
        ? `'${profile.theme.fontFamily}', sans-serif`
        : "'Prompt', sans-serif";

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (
            editModal.open ||
            addModal ||
            settingsModal ||
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
    }, [
        editModal.open,
        addModal,
        settingsModal,
        confirmDialog.open,
        successModal.open,
    ]);

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
        setSettingsModal(true);
    }

    function closeEditModal() {
        setEditModal({
            open: false,
            blockIndex: null,
            blockData: null,
            headerData: null,
        });
    }

    function saveBlockEdit() {
        if (editModal.blockIndex !== null) {
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

                    {/* Profile Preview */}
                    <ProfilePreview
                        profile={profile}
                        bgStyle={bgStyle}
                        innerBgStyle={innerBgStyle}
                        fontFamily={fontFamily}
                        draggedIndex={draggedIndex}
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDragEnd={handleDragEnd}
                        onEdit={openEditModal}
                        onDelete={deleteBlock}
                    />
                </div>
            </div>
            {/* Edit Block Modal */}
            <EditBlockModal
                open={editModal.open}
                blockData={editModal.blockData}
                headerData={editModal.headerData}
                onClose={closeEditModal}
                onSave={saveBlockEdit}
                onBlockChange={(newData) =>
                    setEditModal({ ...editModal, blockData: newData })
                }
                onHeaderChange={(newHeader) =>
                    setEditModal({ ...editModal, headerData: newHeader })
                }
            />
            {/* Settings Modal */}
            <SettingsModal
                open={settingsModal}
                profile={profile}
                onClose={() => setSettingsModal(false)}
                onSave={() => {
                    setSettingsModal(false);
                    setSuccessModal({
                        open: true,
                        title: "เสร็จสิ้น",
                        message: "บันทึกการตั้งค่าเรียบร้อยแล้ว",
                    });
                }}
                onProfileChange={setProfile}
                proActive={proActive}
                username={username}
                originalUsername={originalUsername}
                usernameCheck={usernameCheck}
                onUsernameChange={setUsername}
                onUsernameBlur={handleUsernameBlur}
                onUsernameUpdate={updateUsername}
                notify={notify}
            />
            {/* Add Block Modal */}
            <AddBlockModal
                open={addModal}
                onClose={() => setAddModal(false)}
                onAdd={addBlockFromTemplate}
                groupedTemplates={groupedTemplates}
                proActive={proActive}
            />
            {/* Confirm Dialog */}
            <ConfirmDialog
                open={confirmDialog.open}
                title={confirmDialog.title}
                message={confirmDialog.message}
                loading={confirmDialog.loading}
                showFeedback={confirmDialog.showFeedback}
                showLoading={confirmDialog.showLoading}
                onConfirm={confirmDialog.onConfirm}
                onCancel={() =>
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
            />
            {/* Success Modal */}
            <SuccessModal
                open={successModal.open}
                title={successModal.title}
                message={successModal.message}
                onClose={() =>
                    setSuccessModal({
                        open: false,
                        title: "",
                        message: "",
                    })
                }
            />
        </>
    );
}
