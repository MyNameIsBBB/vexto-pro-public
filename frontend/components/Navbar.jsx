"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { useState } from "react";

export default function Navbar() {
    const { isAuthenticated, profile, user, isAdmin, logout, loading } = useAuth();
    const router = useRouter();
    const proActive = Boolean(isAdmin || user?.isPro);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Get username for profile link
    const profileUsername = user?.username || profile?.username;

    // Debug logging
    console.log("🔍 Navbar Debug:", {
        loading,
        isAuthenticated,
        username: user?.username,
        profileUsername: profile?.username,
        slug: profile?.slug,
        finalUsername: profileUsername,
    });

    const handleLogout = () => {
        logout();
        setMobileMenuOpen(false);
        router.push("/");
    };

    const closeMobileMenu = () => setMobileMenuOpen(false);

    return (
        <header className="mb-8 pt-5 px-5 border-b border-white/10 pb-5">
            <div className="flex items-center justify-between">
                <Link
                    href="/"
                    className="text-2xl font-extrabold bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] bg-clip-text text-transparent"
                    onClick={closeMobileMenu}
                >
                    Vexto
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6 text-sm text-white/90">
                    {isAdmin && (
                        <Link
                            href="/admin"
                            className="hover:text-cyan-400 transition-colors"
                        >
                            <span>Admin Panel</span>
                        </Link>
                    )}
                    <Link
                        href="/pro"
                        className="hover:text-cyan-400 transition-colors"
                    >
                        แพ็กเกจ
                    </Link>
                    <Link
                        href="/examples"
                        className="hover:text-cyan-400 transition-colors"
                    >
                        ตัวอย่าง
                    </Link>

                    {isAuthenticated ? (
                        <>
                            <Link
                                href="/edit"
                                className="hover:text-cyan-400 transition-colors"
                                title="แก้ไขโปรไฟล์"
                            >
                                แก้ไขโปรไฟล์
                            </Link>
                            {/* Compact profile cluster */}
                            <div className="flex items-center gap-2 ml-1">
                                {/* Avatar - only show if we have username (loaded) */}
                                {!loading && profileUsername && (
                                    <Link
                                        href={`/profile/${profileUsername}`}
                                        className="relative inline-flex items-center justify-center w-9 h-9 rounded-full overflow-hidden border border-white/20 hover:border-white/40 transition-colors"
                                        title="โปรไฟล์ของฉัน"
                                    >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={
                                                profile?.avatarUrl ||
                                                "/images/no-profile.png"
                                            }
                                            onError={(e) => {
                                                e.currentTarget.onerror = null;
                                                e.currentTarget.src =
                                                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Crect width='100%25' height='100%25' fill='%231a1f35'/%3E%3Ctext x='50%25' y='52%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='22' fill='%23a3a3a3'%3E:%29%3C/text%3E%3C/svg%3E";
                                            }}
                                            alt="avatar"
                                            className="w-full h-full object-cover"
                                        />
                                    </Link>
                                )}
                                {/* PRO badge next to avatar */}
                                {proActive && (
                                    <span
                                        className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-fuchsia-500 to-cyan-400 text-white shadow-sm"
                                        title="Pro account"
                                    >
                                        PRO
                                    </span>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                                    title="ออกจากระบบ"
                                    aria-label="ออกจากระบบ"
                                >
                                    <FiLogOut className="w-5 h-5" />
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="hover:text-fuchsia-400 transition-colors"
                            >
                                ล็อกอิน
                            </Link>
                            <Link
                                href="/register"
                                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] text-white text-sm font-medium hover:opacity-90 transition-opacity"
                            >
                                สมัครฟรี
                            </Link>
                        </>
                    )}
                </nav>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors text-white"
                    aria-label="Toggle menu"
                >
                    {mobileMenuOpen ? (
                        <FiX className="w-6 h-6" />
                    ) : (
                        <FiMenu className="w-6 h-6" />
                    )}
                </button>
            </div>

            {/* Mobile Navigation Menu */}
            {mobileMenuOpen && (
                <nav className="md:hidden mt-4 pb-4 border-t border-white/10 pt-4 space-y-3">
                    {isAdmin && (
                        <Link
                            href="/admin"
                            className="block py-2 px-3 hover:bg-white/10 rounded-lg transition-colors text-white"
                            onClick={closeMobileMenu}
                        >
                            Admin Panel
                        </Link>
                    )}
                    <Link
                        href="/pro"
                        className="block py-2 px-3 hover:bg-white/10 rounded-lg transition-colors text-white"
                        onClick={closeMobileMenu}
                    >
                        แพ็กเกจ
                    </Link>
                    <Link
                        href="/examples"
                        className="block py-2 px-3 hover:bg-white/10 rounded-lg transition-colors text-white"
                        onClick={closeMobileMenu}
                    >
                        ตัวอย่าง
                    </Link>

                    {isAuthenticated ? (
                        <>
                            <Link
                                href="/edit"
                                className="block py-2 px-3 hover:bg-white/10 rounded-lg transition-colors text-white"
                                onClick={closeMobileMenu}
                            >
                                แก้ไขโปรไฟล์
                            </Link>
                            {!loading && profileUsername && (
                                <Link
                                    href={`/profile/${profileUsername}`}
                                    className="flex items-center gap-3 py-2 px-3 hover:bg-white/10 rounded-lg transition-colors text-white"
                                    onClick={closeMobileMenu}
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={
                                            profile?.avatarUrl ||
                                            "/images/no-profile.png"
                                        }
                                        onError={(e) => {
                                            e.currentTarget.onerror = null;
                                            e.currentTarget.src =
                                                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Crect width='100%25' height='100%25' fill='%231a1f35'/%3E%3Ctext x='50%25' y='52%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='22' fill='%23a3a3a3'%3E:%29%3C/text%3E%3C/svg%3E";
                                        }}
                                        alt="avatar"
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                    <span>โปรไฟล์ของฉัน</span>
                                    {proActive && (
                                        <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-fuchsia-500 to-cyan-400 text-white">
                                            PRO
                                        </span>
                                    )}
                                </Link>
                            )}
                            <button
                                onClick={handleLogout}
                                className="w-full text-left py-2 px-3 hover:bg-red-500/10 rounded-lg transition-colors text-red-400 flex items-center gap-2"
                            >
                                <FiLogOut className="w-5 h-5" />
                                <span>ออกจากระบบ</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="block py-2 px-3 hover:bg-white/10 rounded-lg transition-colors text-white"
                                onClick={closeMobileMenu}
                            >
                                ล็อกอิน
                            </Link>
                            <Link
                                href="/register"
                                className="block py-2 px-3 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] text-white text-center font-medium hover:opacity-90 transition-opacity"
                                onClick={closeMobileMenu}
                            >
                                สมัครฟรี
                            </Link>
                        </>
                    )}
                </nav>
            )}
        </header>
    );
}
