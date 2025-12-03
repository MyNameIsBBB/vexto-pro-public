"use client";
import { useState } from "react";
import { api } from "@/lib/api";
import Navbar from "@/components/Navbar";
import AdminSearchBar from "@/components/admin/AdminSearchBar";
import AdminSearchResults from "@/components/admin/AdminSearchResults";
import AdminUserDetails from "@/components/admin/AdminUserDetails";
import AdminEditUserModal from "@/components/admin/AdminEditUserModal";
import { MdSearch, MdDelete } from "react-icons/md";
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
                // Admin no expiry; pro tier requires expiry
                proExpiry:
                    editData.isAdmin || editData.proTier === "free"
                        ? null
                        : editData.proExpiry || null,
            };

            await api.put(`/admin/users/${editData.userId}`, payload);
            alert("บันทึกข้อมูลสำเร็จ");
            setEditModal(false);
            setEditData(null);

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

    function handleEditModalChange(newData) {
        setEditData(newData);
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
                        <AdminSearchBar
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                            onSearch={handleSearch}
                            searching={searching}
                        />
                    </div>

                    {searchResults.length > 0 ? (
                        <div className="bg-gray-800/50 rounded-2xl p-6 mb-6 border border-white/10">
                            <AdminSearchResults
                                results={searchResults}
                                onViewDetails={viewUserDetails}
                                onEdit={openEditModal}
                                onDelete={deleteUser}
                            />
                        </div>
                    ) : !selectedUser ? (
                        <div className="text-center py-12 text-white/50">
                            <MdSearch className="w-16 h-16 mx-auto mb-4 opacity-30" />
                            <p>กรอกข้อมูลในช่องค้นหาเพื่อเริ่มค้นหาผู้ใช้</p>
                        </div>
                    ) : null}
                </div>
            </main>

            {/* User Details Modal */}
            <AdminUserDetails
                user={selectedUser}
                onClose={() => setSelectedUser(null)}
                onEdit={(userData) => {
                    openEditModal(userData);
                    setSelectedUser(null);
                }}
                onDelete={(userId, username) => {
                    setSelectedUser(null);
                    deleteUser(userId, username);
                }}
            />

            {/* Edit Modal */}
            <AdminEditUserModal
                editData={editData}
                onClose={() => {
                    setEditModal(false);
                    setEditData(null);
                }}
                onSave={saveUserEdit}
                onChange={handleEditModalChange}
            />
        </>
    );
}
