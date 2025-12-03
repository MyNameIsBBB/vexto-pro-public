import { MdClose, MdSettings, MdSave } from "react-icons/md";
import { useState } from "react";
import ThemeEditor from "@/components/edit/ThemeEditor";
import SocialLinksEditor from "@/components/edit/SocialLinksEditor";
import { avatarFrameOptions } from "@/components/editor/profileOptions";

export default function SettingsModal({
    open,
    profile,
    onClose,
    onSave,
    onProfileChange,
    proActive,
    username,
    originalUsername,
    usernameCheck,
    onUsernameChange,
    onUsernameBlur,
    onUsernameUpdate,
    notify,
}) {
    const [settingsTab, setSettingsTab] = useState("profile");
    const [showAdvanced, setShowAdvanced] = useState(false);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={onClose}
        >
            <div
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl max-w-4xl w-full max-h-[85vh] flex flex-col my-8 shadow-2xl border border-gray-700"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex-shrink-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-b border-gray-700 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <MdSettings className="w-6 h-6 text-blue-400" />
                        ตั้งค่าโปรไฟล์
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <MdClose className="w-6 h-6 text-white" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex-shrink-0 flex gap-2 px-6 pt-4 border-b border-gray-700 pb-0">
                    <button
                        onClick={() => setSettingsTab("profile")}
                        className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                            settingsTab === "profile"
                                ? "text-white border-purple-500"
                                : "text-gray-400 hover:text-gray-300 border-transparent"
                        }`}
                    >
                        โปรไฟล์
                    </button>
                    <button
                        onClick={() => setSettingsTab("theme")}
                        className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                            settingsTab === "theme"
                                ? "text-white border-purple-500"
                                : "text-gray-400 hover:text-gray-300 border-transparent"
                        }`}
                    >
                        ธีม
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {settingsTab === "profile" && (
                        <div className="space-y-6">
                            {/* Username (Pro) */}
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
                                                    onUsernameChange(
                                                        e.target.value.toLowerCase()
                                                    )
                                                }
                                                onBlur={onUsernameBlur}
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
                                                    {usernameCheck.message}
                                                </p>
                                            )}
                                        </div>
                                        {username !== originalUsername &&
                                            usernameCheck.available && (
                                                <button
                                                    onClick={onUsernameUpdate}
                                                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                                                >
                                                    บันทึก
                                                </button>
                                            )}
                                    </div>
                                    <p className="text-xs text-gray-400 mt-2">
                                        URL: vexto.app/profile/
                                        {username || originalUsername}
                                    </p>
                                </div>
                            )}

                            {/* Display Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    ชื่อที่แสดง
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                    value={profile.displayName}
                                    onChange={(e) =>
                                        onProfileChange({
                                            ...profile,
                                            displayName: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            {/* Avatar URL */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    URL รูปโปรไฟล์
                                </label>
                                <input
                                    type="url"
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                    value={profile.avatarUrl}
                                    onChange={(e) =>
                                        onProfileChange({
                                            ...profile,
                                            avatarUrl: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            {/* Avatar Frame */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    กรอบรูปโปรไฟล์
                                </label>
                                <div className="grid grid-cols-5 gap-2">
                                    {avatarFrameOptions.map((option) => {
                                        const isFree = option.badge === "free";
                                        const isPremium =
                                            option.badge === "premium";
                                        const isLocked =
                                            isPremium && !proActive;

                                        return (
                                            <button
                                                key={option.value}
                                                onClick={() => {
                                                    if (isLocked) {
                                                        notify(
                                                            "🔒 กรอบนี้สำหรับ Pro เท่านั้น"
                                                        );
                                                    } else {
                                                        onProfileChange({
                                                            ...profile,
                                                            avatarFrame:
                                                                option.value,
                                                        });
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
                                                title={option.label}
                                            >
                                                <div className="text-center">
                                                    <div className="text-2xl mb-1">
                                                        {option.icon}
                                                    </div>
                                                    <div className="text-xs text-gray-400 truncate">
                                                        {option.label}
                                                    </div>
                                                </div>
                                                {isPremium && (
                                                    <div className="absolute top-1 right-1">
                                                        <span className="text-xs">
                                                            👑
                                                        </span>
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Bio */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    คำอธิบาย (Bio)
                                </label>
                                <textarea
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none"
                                    rows={3}
                                    value={profile.bio}
                                    onChange={(e) =>
                                        onProfileChange({
                                            ...profile,
                                            bio: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            {/* Social Links */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-3">
                                    ลิงก์โซเชียลมีเดีย
                                </label>
                                <SocialLinksEditor
                                    socials={profile.socials}
                                    onChange={(newSocials) =>
                                        onProfileChange({
                                            ...profile,
                                            socials: newSocials,
                                        })
                                    }
                                />
                            </div>
                        </div>
                    )}

                    {settingsTab === "theme" && (
                        <ThemeEditor
                            theme={profile.theme}
                            onChange={(newTheme) =>
                                onProfileChange({
                                    ...profile,
                                    theme: newTheme,
                                })
                            }
                            showAdvanced={showAdvanced}
                            onToggleAdvanced={() =>
                                setShowAdvanced(!showAdvanced)
                            }
                        />
                    )}
                </div>

                {/* Footer Actions */}
                <div className="flex-shrink-0 border-t border-gray-700 px-6 py-4 flex justify-end gap-3 bg-gray-800/50 rounded-b-2xl">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                    >
                        ปิด
                    </button>
                    <button
                        onClick={onSave}
                        className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-medium transition-all flex items-center gap-2"
                    >
                        <MdSave className="w-5 h-5" />
                        บันทึก
                    </button>
                </div>
            </div>
        </div>
    );
}
