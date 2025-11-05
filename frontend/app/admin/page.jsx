"use client";
import { useState } from "react";
import { api } from "@/lib/api";
import Navbar from "@/components/Navbar";
import { MdSearch, MdEdit, MdDelete, MdClose, MdSave } from "react-icons/md";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function AdminPage() {
    const { isAdmin, isAuthenticated } = useAuth();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [editModal, setEditModal] = useState(false);
    const [editData, setEditData] = useState(null);

    // Protect admin route
    if (typeof window !== "undefined" && isAuthenticated !== undefined) {
        if (!isAuthenticated || !isAdmin) {
            router.push("/");
            return null;
        }
    }

    // Show loading while checking auth
    if (isAuthenticated === undefined || isAdmin === undefined) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
                <div className="text-white">กำลังตรวจสอบสิทธิ์...</div>
            </div>
        );
    }

    async function handleSearch(e) {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setSearching(true);
        try {
            const results = await api.get(
                `/admin/users/search?q=${encodeURIComponent(searchQuery)}`
            );
            setSearchResults(results);
        } catch (error) {
            console.error("Search error:", error);
            alert("เกิดข้อผิดพลาดในการค้นหา");
        } finally {
            setSearching(false);
        }
    }

    async function viewUserDetails(userId) {
        try {
            const data = await api.get(`/admin/users/${userId}`);
            setSelectedUser(data);
        } catch (error) {
            console.error("Error loading user details:", error);
            alert("ไม่สามารถโหลดข้อมูลผู้ใช้");
        }
    }

    function openEditModal(user) {
        setEditData({
            userId: user._id,
            isPro: user.isPro || false,
            isAdmin: user.isAdmin || false,
            proTier: user.proTier || "free",
            proExpiry: user.proExpiry
                ? new Date(user.proExpiry).toISOString().split("T")[0]
                : "",
        });
        setEditModal(true);
    }

    async function saveUserEdit() {
        if (!editData) return;

        try {
            const payload = {
                isPro: editData.isPro,
                isAdmin: editData.isAdmin,
                proTier: editData.proTier,
                proExpiry: editData.proExpiry || null,
            };

            await api.put(`/admin/users/${editData.userId}`, payload);
            alert("บันทึกข้อมูลสำเร็จ");
            setEditModal(false);

            if (searchQuery) {
                handleSearch(new Event("submit"));
            }

            if (selectedUser && selectedUser.user._id === editData.userId) {
                viewUserDetails(editData.userId);
            }
        } catch (error) {
            console.error("Error updating user:", error);
            alert("เกิดข้อผิดพลาดในการบันทึก");
        }
    }

    async function deleteUser(userId, username) {
        if (
            !confirm(
                `คุณแน่ใจหรือไม่ที่จะลบผู้ใช้ "${username}"? การกระทำนี้ไม่สามารถย้อนกลับได้`
            )
        ) {
            return;
        }

        try {
            await api.delete(`/admin/users/${userId}`);
            alert("ลบผู้ใช้สำเร็จ");
            setSelectedUser(null);
            setSearchResults(searchResults.filter((u) => u._id !== userId));
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("เกิดข้อผิดพลาดในการลบผู้ใช้");
        }
    }

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-[#0a0a0f] text-white p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                            🎛️ Admin Dashboard
                        </h1>
                        <p className="text-white/70">
                            จัดการข้อมูลผู้ใช้ในระบบ
                        </p>
                    </div>

                    <div className="bg-gray-800/50 rounded-2xl p-6 mb-6 border border-white/10">
                        <form onSubmit={handleSearch} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-2">
                                    ค้นหาผู้ใช้ (Email หรือ Username)
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        placeholder="กรอก email หรือ username..."
                                        className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
                                    />
                                    <button
                                        type="submit"
                                        disabled={
                                            searching || !searchQuery.trim()
                                        }
                                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        <MdSearch className="w-5 h-5" />
                                        {searching ? "กำลังค้นหา..." : "ค้นหา"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    {searchResults.length > 0 && (
                        <div className="bg-gray-800/50 rounded-2xl p-6 mb-6 border border-white/10">
                            <h2 className="text-xl font-bold mb-4">
                                ผลการค้นหา ({searchResults.length})
                            </h2>
                            <div className="space-y-3">
                                {searchResults.map((user) => (
                                    <div
                                        key={user._id}
                                        className="bg-gray-900/50 rounded-xl p-4 flex items-center justify-between hover:bg-gray-900 transition-colors border border-gray-700"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-medium">
                                                    {user.username}
                                                </span>
                                                {user.isPro && (
                                                    <span className="px-2 py-0.5 bg-gradient-to-r from-purple-500 to-cyan-500 text-white text-xs rounded-full">
                                                        PRO
                                                    </span>
                                                )}
                                                {user.isAdmin && (
                                                    <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                                                        ADMIN
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-white/60">
                                                {user.email}
                                            </p>
                                            <p className="text-xs text-white/40 mt-1">
                                                สร้างเมื่อ:{" "}
                                                {new Date(
                                                    user.createdAt
                                                ).toLocaleDateString("th-TH")}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() =>
                                                    viewUserDetails(user._id)
                                                }
                                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm"
                                            >
                                                ดูรายละเอียด
                                            </button>
                                            <button
                                                onClick={() =>
                                                    openEditModal(user)
                                                }
                                                className="p-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                                                title="แก้ไข"
                                            >
                                                <MdEdit className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    deleteUser(
                                                        user._id,
                                                        user.username
                                                    )
                                                }
                                                className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                                                title="ลบ"
                                            >
                                                <MdDelete className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {searchResults.length === 0 && !selectedUser && (
                        <div className="text-center py-12 text-white/50">
                            <MdSearch className="w-16 h-16 mx-auto mb-4 opacity-30" />
                            <p>กรอกข้อมูลในช่องค้นหาเพื่อเริ่มค้นหาผู้ใช้</p>
                        </div>
                    )}
                </div>
            </main>

            {/* User Details Modal */}
            {selectedUser && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 rounded-2xl p-6 max-w-2xl w-full border border-white/10 max-h-[80vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold">
                                รายละเอียดผู้ใช้
                            </h3>
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                <MdClose className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-gray-800/50 rounded-xl p-4">
                                <h4 className="font-bold mb-3 text-purple-400">
                                    ข้อมูลบัญชี
                                </h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-white/60">
                                            Username:
                                        </span>
                                        <span className="font-medium">
                                            {selectedUser.user.username}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-white/60">
                                            Email:
                                        </span>
                                        <span className="font-medium">
                                            {selectedUser.user.email}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-white/60">
                                            สร้างเมื่อ:
                                        </span>
                                        <span className="font-medium">
                                            {new Date(
                                                selectedUser.user.createdAt
                                            ).toLocaleDateString("th-TH")}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-white/60">
                                            สถานะ:
                                        </span>
                                        <div className="flex gap-2">
                                            {selectedUser.user.isPro && (
                                                <span className="px-2 py-0.5 bg-gradient-to-r from-purple-500 to-cyan-500 text-white text-xs rounded-full">
                                                    PRO
                                                </span>
                                            )}
                                            {selectedUser.user.isAdmin && (
                                                <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                                                    ADMIN
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    {selectedUser.user.proTier && (
                                        <div className="flex justify-between">
                                            <span className="text-white/60">
                                                ประเภท PRO:
                                            </span>
                                            <span className="font-medium uppercase">
                                                {selectedUser.user.proTier}
                                            </span>
                                        </div>
                                    )}
                                    {selectedUser.user.proExpiry && (
                                        <div className="flex justify-between">
                                            <span className="text-white/60">
                                                หมดอายุ:
                                            </span>
                                            <span className="font-medium">
                                                {new Date(
                                                    selectedUser.user.proExpiry
                                                ).toLocaleDateString("th-TH")}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {selectedUser.profile && (
                                <div className="bg-gray-800/50 rounded-xl p-4">
                                    <h4 className="font-bold mb-3 text-cyan-400">
                                        ข้อมูลโปรไฟล์
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-white/60">
                                                Display Name:
                                            </span>
                                            <span className="font-medium">
                                                {selectedUser.profile
                                                    .displayName || "-"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-white/60">
                                                Bio:
                                            </span>
                                            <span className="font-medium text-right max-w-xs">
                                                {selectedUser.profile.bio ||
                                                    "-"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-white/60">
                                                จำนวน Blocks:
                                            </span>
                                            <span className="font-medium">
                                                {selectedUser.profile.blocks
                                                    ?.length || 0}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => {
                                    openEditModal(selectedUser.user);
                                    setSelectedUser(null);
                                }}
                                className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                <MdEdit className="w-5 h-5" />
                                แก้ไข
                            </button>
                            <button
                                onClick={() => {
                                    const userId = selectedUser.user._id;
                                    const username = selectedUser.user.username;
                                    setSelectedUser(null);
                                    deleteUser(userId, username);
                                }}
                                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                <MdDelete className="w-5 h-5" />
                                ลบ
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editModal && editData && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 rounded-2xl p-6 max-w-md w-full border border-white/10">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold">
                                แก้ไขข้อมูลผู้ใช้
                            </h3>
                            <button
                                onClick={() => setEditModal(false)}
                                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                <MdClose className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium">
                                    สถานะ PRO
                                </label>
                                <input
                                    type="checkbox"
                                    checked={editData.isPro}
                                    onChange={(e) =>
                                        setEditData({
                                            ...editData,
                                            isPro: e.target.checked,
                                        })
                                    }
                                    className="w-5 h-5 rounded"
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium">
                                    สถานะ Admin
                                </label>
                                <input
                                    type="checkbox"
                                    checked={editData.isAdmin}
                                    onChange={(e) =>
                                        setEditData({
                                            ...editData,
                                            isAdmin: e.target.checked,
                                        })
                                    }
                                    className="w-5 h-5 rounded"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    ประเภท PRO
                                </label>
                                <select
                                    value={editData.proTier}
                                    onChange={(e) =>
                                        setEditData({
                                            ...editData,
                                            proTier: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                                >
                                    <option value="free">Free</option>
                                    <option value="basic">Basic</option>
                                    <option value="premium">Premium</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    วันหมดอายุ PRO
                                </label>
                                <input
                                    type="date"
                                    value={editData.proExpiry}
                                    onChange={(e) =>
                                        setEditData({
                                            ...editData,
                                            proExpiry: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setEditModal(false)}
                                className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                ยกเลิก
                            </button>
                            <button
                                onClick={saveUserEdit}
                                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 rounded-lg transition-all flex items-center justify-center gap-2"
                            >
                                <MdSave className="w-5 h-5" />
                                บันทึก
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
