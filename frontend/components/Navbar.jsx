"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiLogOut } from "react-icons/fi";

export default function Navbar() {
    const { isAuthenticated, profile, user, isAdmin, logout } = useAuth();
    const router = useRouter();
    const proActive = Boolean(isAdmin || user?.isPro);

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    return (
        <header className="flex items-center justify-between mb-8 pt-5 px-5 border-b border-white/10 pb-5">
            <Link
                href="/"
                className="text-2xl font-extrabold bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] bg-clip-text text-transparent"
            >
                Vexto
            </Link>
            <nav className="flex items-center gap-6 text-sm text-white/90">
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
                    href="/shop"
                    className="hover:text-cyan-400 transition-colors"
                >
                    ร้านค้า
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
                            {/* Avatar */}
                            <Link
                                href={`/profile/${
                                    profile?.username || profile?.slug || "me"
                                }`}
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
        </header>
    );
}
